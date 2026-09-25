#!/usr/bin/env node
/**
 * Multi-tenant SSR server.
 *
 * Each TanStack Start build emits `dist/server/server.js`, which default-
 * exports a Web-standard fetch handler — `{ fetch(Request) => Response }`
 * with no listener of its own. That is what makes this possible: N site
 * bundles can live in one Node process, each an isolated module graph,
 * dispatched by the Host header.
 *
 * Layout this expects:
 *
 *   /app/sites/<name>/server/server.js   <- SSR fetch handler
 *   /app/sites/<name>/client/           <- hashed assets + prerendered html
 *   /app/sites.json                     <- host -> site name mapping
 *
 * SECRETS. Sites legitimately need server-side third-party keys (OpenAI,
 * Helius, a paid RPC) — that is usually the reason a site needs SSR at
 * all. But one process means one `process.env`, so by default every
 * tenant can read every other tenant's keys.
 *
 * Fixed here by scoping `process.env` per tenant with AsyncLocalStorage:
 *   - Per-site secrets are supplied as SITE_<NAME>_<KEY> and stripped from
 *     the real environment at boot.
 *   - Each request runs inside an ALS context holding only that site's
 *     keys, exposed under their un-prefixed names.
 *   - Site code keeps reading `process.env.OPENAI_API_KEY` unchanged and
 *     gets its own value; another tenant's key reads as undefined.
 *
 * PLATFORM credentials are still refused outright — this tier must not be
 * able to reach the platform database. See assertNoPlatformSecrets().
 */
import { createServer } from 'node:http';
import { AsyncLocalStorage } from 'node:async_hooks';
import { Readable } from 'node:stream';
import { readFile, stat } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.env.SITES_ROOT ?? '/app/sites';
const CONFIG = process.env.SITES_CONFIG ?? '/app/sites.json';
const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOSTNAME ?? '0.0.0.0';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN ?? '';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

// ---------------------------------------------------------------------------
// Tenant registry
// ---------------------------------------------------------------------------

/** host -> { name, dir, handler, loadError, secrets } */
const tenants = new Map();

// ---------------------------------------------------------------------------
// Per-tenant secrets
// ---------------------------------------------------------------------------

const siteEnv = new AsyncLocalStorage();

/**
 * Pull SITE_<NAME>_<KEY> vars out of the real environment and index them
 * by site. Reading them here and deleting them means that even if a site
 * bundle walks the raw environment, the keys are already gone.
 */
function extractSiteSecrets() {
  const bySite = new Map();
  for (const [key, value] of Object.entries(process.env)) {
    const m = /^SITE_([A-Z0-9]+)_(.+)$/.exec(key);
    if (!m) continue;
    const [, site, name] = m;
    const bag = bySite.get(site.toLowerCase()) ?? {};
    bag[name] = value;
    bySite.set(site.toLowerCase(), bag);
    delete process.env[key];
  }
  return bySite;
}

const SITE_SECRETS = extractSiteSecrets();

/**
 * Swap process.env for a view that overlays the current tenant's secrets.
 * Shared, non-secret vars (PATH, NODE_ENV, TZ) still resolve normally.
 *
 * ALS is what makes this concurrency-safe: a plain global would race
 * between interleaved requests from different tenants.
 */
const REAL_ENV = { ...process.env };
const scopedEnv = new Proxy(
  {},
  {
    get(_, k) {
      if (typeof k !== 'string') return undefined;
      const store = siteEnv.getStore();
      if (store && k in store) return store[k];
      return REAL_ENV[k];
    },
    set(_, k, v) {
      REAL_ENV[k] = String(v);
      return true;
    },
    has(_, k) {
      return k in (siteEnv.getStore() ?? {}) || k in REAL_ENV;
    },
    ownKeys() {
      return [...new Set([...Object.keys(REAL_ENV), ...Object.keys(siteEnv.getStore() ?? {})])];
    },
    getOwnPropertyDescriptor(_, k) {
      // MUST include `value`. A descriptor without it violates the proxy
      // invariants in a way that silently HANGS server.listen() — no error
      // event, the callback simply never fires. Cost an hour to find.
      const store = siteEnv.getStore();
      const v = store && k in store ? store[k] : REAL_ENV[k];
      return v === undefined
        ? undefined
        : { value: v, enumerable: true, configurable: true, writable: true };
    },
  },
);
Object.defineProperty(process, 'env', { get: () => scopedEnv, configurable: true });

/**
 * Count of module graphs ever loaded. Each hot reload permanently adds
 * one: ESM's module cache has no eviction, so a swapped-out bundle's
 * memory is never reclaimed. Exposed in /_health so you can watch it
 * climb and restart before it matters. See README "Reload budget".
 */
let graphsLoaded = 0;

async function loadRegistry() {
  const cfg = JSON.parse(await readFile(CONFIG, 'utf8'));
  const next = new Map();

  for (const [host, entry] of Object.entries(cfg.hosts)) {
    // Entry is either "name" (flat layout) or { site, version }.
    const name = typeof entry === 'string' ? entry : entry.site;
    const version = typeof entry === 'string' ? null : entry.version;

    // Versioned dir gives import() a NEW specifier. Overwriting a bundle
    // in place does NOT work — import() returns the cached module and you
    // silently serve the old code forever. Verified.
    const dir = version ? path.join(ROOT, name, version) : path.join(ROOT, name);
    let handler = null;
    let loadError = null;

    try {
      // Dynamic import gives each site its own module graph — separate
      // React instance, separate router, separate module-level state.
      // One site's globals cannot reach another's.
      const mod = await import(pathToFileURL(path.join(dir, 'server', 'server.js')).href);
      graphsLoaded += 1;
      handler = mod.default;
      if (typeof handler?.fetch !== 'function') {
        throw new Error('bundle default export has no fetch()');
      }
    } catch (err) {
      // A broken bundle must not stop the other tenants from booting.
      // It 503s on its own host and logs loudly; everyone else is fine.
      loadError = err;
      console.error(`[registry] ${name} failed to load:`, err.message);
    }

    next.set(host.toLowerCase(), {
      name,
      version,
      dir,
      handler,
      loadError,
      secrets: SITE_SECRETS.get(name.toLowerCase()) ?? {},
    });
  }

  // Swap atomically: in-flight requests finish against the old handler
  // they already captured, new requests get the new map.
  tenants.clear();
  for (const [k, v] of next) tenants.set(k, v);

  console.log(
    `[registry] ${tenants.size} host(s): ` +
      [...tenants.entries()]
        .map(([h, t]) => `${h}->${t.name}${t.handler ? '' : ' (FAILED)'}`)
        .join(', '),
  );
  for (const [site, bag] of SITE_SECRETS) {
    // Names only — never log values.
    console.log(`[secrets] ${site}: ${Object.keys(bag).join(', ')}`);
  }
}

// ---------------------------------------------------------------------------
// Static assets
// ---------------------------------------------------------------------------

/**
 * Serve from the site's client dir. Tried BEFORE SSR: hashed assets are
 * the bulk of requests and should never wake the React renderer.
 *
 * Returns true if it handled the request.
 */
async function tryStatic(tenant, urlPath, req, res) {
  // Normalise and confine to the tenant's own client dir. path.join
  // collapses "..", and the prefix check rejects anything that escaped —
  // without this, a crafted URL reads another tenant's files.
  const clientDir = path.join(tenant.dir, 'client');
  const rel = decodeURIComponent(urlPath.split('?')[0]).replace(/^\/+/, '');
  const file = path.join(clientDir, rel);
  if (!file.startsWith(clientDir + path.sep) && file !== clientDir) return false;

  let info;
  try {
    info = await stat(file);
  } catch {
    return false;
  }
  if (!info.isFile()) return false;

  const ext = path.extname(file).toLowerCase();

  // Vite content-hashes everything under assets/, so those are immutable.
  // Anything else keeps a short TTL — same split as the S3 path.
  const immutable = rel.startsWith('assets/');

  res.writeHead(200, {
    'content-type': MIME[ext] ?? 'application/octet-stream',
    'content-length': info.size,
    'cache-control': immutable
      ? 'public, max-age=31536000, immutable'
      : ext === '.html'
        ? 'public, max-age=0, must-revalidate'
        : 'public, max-age=300',
  });

  if (req.method === 'HEAD') return res.end(), true;
  createReadStream(file).pipe(res);
  return true;
}

// ---------------------------------------------------------------------------
// node:http  <->  fetch handler bridge
// ---------------------------------------------------------------------------

function toRequest(req, host) {
  // Trust the proxy's forwarded proto — Traefik terminates TLS, so the
  // app always sees plain HTTP and would otherwise build http:// URLs
  // and generate wrong absolute links and redirects.
  const proto = (req.headers['x-forwarded-proto'] ?? 'https').split(',')[0].trim();
  const url = new URL(req.url, `${proto}://${host}`);

  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) {
    if (Array.isArray(v)) v.forEach((x) => headers.append(k, x));
    else if (v !== undefined) headers.set(k, v);
  }

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  return new Request(url, {
    method: req.method,
    headers,
    body: hasBody ? Readable.toWeb(req) : undefined,
    duplex: hasBody ? 'half' : undefined,
  });
}

async function send(res, response) {
  const headers = {};
  response.headers.forEach((v, k) => {
    headers[k] = k === 'set-cookie' ? response.headers.getSetCookie?.() ?? v : v;
  });
  res.writeHead(response.status, headers);

  if (!response.body) return res.end();
  // Stream rather than buffer: SSR responses can be chunked, and buffering
  // would hold whole pages in memory across every concurrent request.
  Readable.fromWeb(response.body).pipe(res);
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = createServer(async (req, res) => {
  const rawHost = (req.headers['x-forwarded-host'] ?? req.headers.host ?? '')
    .toString()
    .split(',')[0]
    .trim();
  const host = rawHost.split(':')[0].toLowerCase();

  // Health check must never depend on a tenant — Traefik uses it to decide
  // whether to route at all, and a single bad site shouldn't blackhole the
  // whole container.
  if (req.url === '/_rss') { res.writeHead(200,{'content-type':'application/json'}); return res.end(JSON.stringify({rss: Math.round(process.memoryUsage().rss/1048576)})); }
  if (req.url === '/_health') {
    const failed = [...tenants.values()].filter((t) => !t.handler).map((t) => t.name);
    res.writeHead(failed.length ? 503 : 200, { 'content-type': 'application/json' });
    return res.end(
      JSON.stringify({
        ok: !failed.length,
        tenants: tenants.size,
        failed,
        graphsLoaded,
        rssMb: Math.round(process.memoryUsage().rss / 1048576),
      }),
    );
  }

  // Re-read sites.json and load any new bundle versions, without dropping
  // connections. Prefer this over SIGHUP: n8n can call an HTTP endpoint,
  // but signalling a container from outside needs docker socket access.
  if (req.url === '/_admin/reload' && req.method === 'POST') {
    const token = (req.headers.authorization ?? '').replace(/^Bearer /, '');
    if (!ADMIN_TOKEN || token !== ADMIN_TOKEN) {
      res.writeHead(401, { 'content-type': 'application/json' });
      return res.end('{"ok":false}');
    }
    try {
      await loadRegistry();
      res.writeHead(200, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ ok: true, tenants: tenants.size, graphsLoaded }));
    } catch (err) {
      console.error('[reload] failed:', err);
      res.writeHead(500, { 'content-type': 'application/json' });
      return res.end(JSON.stringify({ ok: false, error: String(err.message) }));
    }
  }

  // "*" is a catch-all for single-site deploys: one repo -> one container,
  // which then doesn't need to know its own domain (Traefik already only
  // routes that site's hosts here). Exact matches still win.
  const tenant = tenants.get(host) ?? tenants.get('*');
  if (!tenant) {
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end('Unknown host\n');
  }

  try {
    if (await tryStatic(tenant, req.url, req, res)) return;

    if (!tenant.handler) {
      res.writeHead(503, { 'content-type': 'text/plain' });
      return res.end('Site temporarily unavailable\n');
    }

    // Run inside the tenant's env scope. Site code reading
    // process.env.OPENAI_API_KEY gets THIS site's key and nothing else.
    // The same bag is passed as the fetch handler's `env` argument, which
    // is where Start would surface it if it ever threads it through.
    const response = await siteEnv.run(tenant.secrets, () =>
      tenant.handler.fetch(toRequest(req, host), tenant.secrets, {}),
    );
    await send(res, response);
  } catch (err) {
    // Per-request containment. A throw in one site's render must not take
    // down the process and with it every other tenant.
    console.error(`[${tenant.name}] ${req.method} ${req.url}:`, err);
    if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain' });
    res.end('Internal error\n');
  }
});

/**
 * Refuse to boot with PLATFORM credentials present.
 *
 * Narrow on purpose: third-party API keys are expected and supported (as
 * SITE_<NAME>_*). What this tier must never hold is a path to the platform
 * database. A process that won't start is a stronger guarantee than a
 * policy someone has to remember.
 */
function assertNoPlatformSecrets() {
  const banned = /(SUPABASE|DATABASE_URL|POSTGRES|^PG(HOST|USER|PASSWORD|DATABASE)$|SERVICE_ROLE|AWS_SECRET_ACCESS_KEY)/i;
  const found = Object.keys(REAL_ENV).filter((k) => banned.test(k));
  if (found.length) {
    console.error(`REFUSING TO START: platform credentials in env: ${found.join(', ')}`);
    process.exit(1);
  }
}

assertNoPlatformSecrets();
await loadRegistry();

// SIGHUP reloads the registry without dropping connections — lets you add
// a site or swap a bundle without restarting the other tenants.
process.on('SIGHUP', () => {
  console.log('[registry] SIGHUP — reloading');
  loadRegistry().catch((e) => console.error('[registry] reload failed:', e));
});

server.listen(PORT, HOST, () => console.log(`listening on ${HOST}:${PORT}`));
