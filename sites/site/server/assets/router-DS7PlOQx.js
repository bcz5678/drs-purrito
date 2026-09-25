import { K as require_react, M as escapeHtml, Y as __toESM, o as useHydrated, r as useRouter, s as require_jsx_runtime } from "./react-dom-Dk58sb-z.js";
import { b as createNonReactiveReadonlyStore, c as appendUniqueUserTags, d as getAssetCrossOrigin, f as getScriptPreloadAttrs, g as RouterCore, h as resolveManifestCssLink, n as Outlet, y as createNonReactiveMutableStore } from "./Match-D1CK22Zg.js";
import { r as Link, t as Toaster$1 } from "./dist-Dgzuy_xe.js";
import { i as createRootRouteWithContext, n as lazyRouteComponent, r as createFileRoute, t as Route$3 } from "./order._pickup-Chk0olMu.js";
//#region node_modules/@tanstack/react-router/dist/esm/routerStores.js
var getStoreFactory = (opts) => {
	return {
		createMutableStore: createNonReactiveMutableStore,
		createReadonlyStore: createNonReactiveReadonlyStore,
		batch: (fn) => fn()
	};
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/router.js
/**
* Creates a new Router instance for React.
*
* Pass the returned router to `RouterProvider` to enable routing.
* Notable options: `routeTree` (your route definitions) and `context`
* (required if the root route was created with `createRootRouteWithContext`).
*
* @param options Router options used to configure the router.
* @returns A Router instance to be provided to `RouterProvider`.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/createRouterFunction
*/
var createRouter = (options) => {
	return new Router(options);
};
var Router = class extends RouterCore {
	constructor(options) {
		super(options, getStoreFactory);
	}
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/Asset.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var noopScriptHandler = () => {};
function setScriptAttrs(script, attrs) {
	if (!attrs) return;
	for (const [key, value] of Object.entries(attrs)) if (key !== "suppressHydrationWarning" && value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
}
function Asset(asset) {
	const { attrs, children, nonce, preventScriptHoist } = asset;
	switch (asset.tag) {
		case "title": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", {
			...attrs,
			suppressHydrationWarning: true,
			children
		});
		case "meta": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			...attrs,
			suppressHydrationWarning: true
		});
		case "link": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			...attrs,
			precedence: attrs?.precedence ?? (attrs?.rel === "stylesheet" ? "default" : void 0),
			nonce,
			suppressHydrationWarning: true
		});
		case "style":
			if (asset.inlineCss && false);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
				...attrs,
				dangerouslySetInnerHTML: { __html: children },
				nonce
			});
		case "script": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Script, {
			attrs,
			preventScriptHoist,
			children
		});
		default: return null;
	}
}
function Script({ attrs, children, preventScriptHoist }) {
	useRouter();
	useHydrated();
	const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
	import_react.useEffect(() => {
		if (dataScript) return;
		if (attrs?.src) {
			const normSrc = (() => {
				try {
					const base = document.baseURI || window.location.href;
					return new URL(attrs.src, base).href;
				} catch {
					return attrs.src;
				}
			})();
			for (const el of document.querySelectorAll("script[src]")) if (el.src === normSrc) return;
			const script = document.createElement("script");
			setScriptAttrs(script, attrs);
			document.head.appendChild(script);
			return () => script.remove();
		}
		if (typeof children === "string") {
			const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
			const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
			for (const el of document.querySelectorAll("script:not([src])")) {
				if (!(el instanceof HTMLScriptElement)) continue;
				const sType = el.getAttribute("type") ?? "text/javascript";
				const sNonce = el.getAttribute("nonce") ?? void 0;
				if (el.textContent === children && sType === typeAttr && sNonce === nonceAttr) return;
			}
			const script = document.createElement("script");
			script.textContent = children;
			setScriptAttrs(script, attrs);
			document.head.appendChild(script);
			return () => script.remove();
		}
	}, [
		attrs,
		children,
		dataScript
	]);
	if (attrs?.src) {
		if (!preventScriptHoist) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			...attrs,
			suppressHydrationWarning: true
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			...attrs,
			onLoad: noopScriptHandler,
			suppressHydrationWarning: true
		});
	}
	if (typeof children === "string") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		...attrs,
		dangerouslySetInnerHTML: { __html: children },
		suppressHydrationWarning: true
	});
	return null;
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/headContentUtils.js
function buildTagsFromMatches(router, nonce, matches, assetCrossOrigin) {
	const routeMeta = matches.map((match) => match.meta).filter((meta) => meta !== void 0);
	const resultMeta = [];
	const metaByAttribute = {};
	let title;
	for (let i = routeMeta.length - 1; i >= 0; i--) {
		const metas = routeMeta[i];
		for (let j = metas.length - 1; j >= 0; j--) {
			const m = metas[j];
			if (!m) continue;
			if (m.title) {
				if (!title) title = {
					tag: "title",
					children: m.title
				};
			} else if ("script:ld+json" in m) try {
				const json = JSON.stringify(m["script:ld+json"]);
				resultMeta.push({
					tag: "script",
					attrs: { type: "application/ld+json" },
					children: escapeHtml(json)
				});
			} catch {}
			else {
				const attribute = m.name ?? m.property;
				if (attribute) if (metaByAttribute[attribute]) continue;
				else metaByAttribute[attribute] = true;
				resultMeta.push({
					tag: "meta",
					attrs: {
						...m,
						nonce
					}
				});
			}
		}
	}
	if (title) resultMeta.push(title);
	if (nonce) resultMeta.push({
		tag: "meta",
		attrs: {
			property: "csp-nonce",
			content: nonce
		}
	});
	resultMeta.reverse();
	const constructedLinks = matches.flatMap((match) => match.links ?? []).filter((link) => link !== void 0).map((link) => ({
		tag: "link",
		attrs: {
			...link,
			nonce
		}
	}));
	const manifest = router.ssr?.manifest;
	const manifestCssTags = [];
	if (manifest) {
		matches.forEach((match) => {
			(manifest.routes[match.routeId]?.css)?.forEach((link) => {
				const resolvedLink = resolveManifestCssLink(link);
				manifestCssTags.push({
					tag: "link",
					attrs: {
						rel: "stylesheet",
						...resolvedLink,
						crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? resolvedLink.crossOrigin,
						suppressHydrationWarning: true,
						nonce
					}
				});
			});
		});
		if (manifest.inlineStyle) manifestCssTags.push({
			tag: "style",
			attrs: {
				...manifest.inlineStyle.attrs,
				nonce
			},
			children: manifest.inlineStyle.children,
			inlineCss: true
		});
	}
	const preloadLinks = [];
	if (manifest) matches.forEach((match) => {
		manifest.routes[match.routeId]?.preloads?.forEach((preload) => {
			preloadLinks.push({
				tag: "link",
				attrs: {
					...getScriptPreloadAttrs(manifest, preload, assetCrossOrigin),
					nonce
				}
			});
		});
	});
	const styles = matches.flatMap((match) => match.styles ?? []).filter((style) => style !== void 0).map(({ children, ...attrs }) => ({
		tag: "style",
		attrs: {
			...attrs,
			nonce
		},
		children
	}));
	const headScripts = matches.flatMap((match) => match.headScripts ?? []).filter((script) => script !== void 0).map(({ children, ...script }) => ({
		tag: "script",
		attrs: {
			...script,
			nonce
		},
		children
	}));
	const tags = [];
	appendUniqueUserTags(tags, resultMeta);
	tags.push(...preloadLinks);
	appendUniqueUserTags(tags, constructedLinks);
	tags.push(...manifestCssTags);
	appendUniqueUserTags(tags, styles);
	appendUniqueUserTags(tags, headScripts);
	return tags;
}
/**
* Build the list of head/link/meta/script tags to render for active matches.
* Used internally by `HeadContent`.
*/
var useTags = (assetCrossOrigin) => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	return buildTagsFromMatches(router, nonce, router.stores.matches.get(), assetCrossOrigin);
};
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/HeadContent.js
/**
* Render route-managed head tags (title, meta, links, styles, head scripts).
* Place inside the document head of your app shell.
* @link https://tanstack.com/router/latest/docs/framework/react/guide/document-head-management
*/
function HeadContent(props) {
	const tags = useTags(props.assetCrossOrigin);
	const nonce = useRouter().options.ssr?.nonce;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: tags.map((tag) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...tag,
		key: `tsr-meta-${JSON.stringify(tag)}`,
		nonce
	})) });
}
//#endregion
//#region node_modules/@tanstack/react-router/dist/esm/Scripts.js
/**
* Render body script tags collected from route matches and SSR manifests.
* Should be placed near the end of the document body.
*/
var Scripts = () => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const getAssetScripts = (matches) => {
		const assetScripts = [];
		const manifest = router.ssr?.manifest;
		if (!manifest) return [];
		for (const match of matches) {
			const scripts = manifest.routes[match.routeId]?.scripts;
			if (!scripts) continue;
			for (const asset of scripts) assetScripts.push({
				tag: "script",
				attrs: {
					...asset.attrs,
					nonce
				},
				children: asset.children,
				...typeof asset.attrs?.src === "string" ? { preventScriptHoist: true } : {}
			});
		}
		return assetScripts;
	};
	const getScripts = (matches) => matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
		tag: "script",
		attrs: {
			...script,
			suppressHydrationWarning: true,
			nonce
		},
		children
	}));
	{
		const activeMatches = router.stores.matches.get();
		const assetScripts = getAssetScripts(activeMatches);
		return renderScripts(router, getScripts(activeMatches), assetScripts);
	}
};
function renderScripts(router, scripts, assetScripts) {
	const allScripts = [...scripts, ...assetScripts];
	if (router.serverSsr) {
		const serverBufferedScript = router.serverSsr.takeBufferedScripts();
		if (serverBufferedScript) allScripts.unshift(serverBufferedScript);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: allScripts.map((asset, i) => /* @__PURE__ */ (0, import_react.createElement)(Asset, {
		...asset,
		key: `tsr-scripts-${asset.tag}-${i}`
	})) });
}
//#endregion
//#region node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
/**
* The context that `useQueryClient` reads from. `QueryClientProvider` is the normal way to set it.
*/
var QueryClientContext = import_react.createContext(void 0);
/**
* Use the `QueryClientProvider` component to connect and provide a `QueryClient` to your application. Also
* calls `client.mount()`/`client.unmount()` as this component mounts/unmounts, which subscribes the client to
* focus/online events (resuming any paused mutations and refetching as needed when the app regains focus or
* comes back online).
*
* @returns The provided `children`, wrapped so they can read the `QueryClient` via `useQueryClient`.
*
* @example
* ```tsx
* import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
*
* const queryClient = new QueryClient()
*
* function App() {
*   return <QueryClientProvider client={queryClient}>...</QueryClientProvider>
* }
* ```
*/
var QueryClientProvider = ({ client, children }) => {
	import_react.useEffect(() => {
		client.mount();
		return () => {
			client.unmount();
		};
	}, [client]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientContext.Provider, {
		value: client,
		children
	});
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/timeoutManager.js
var defaultTimeoutProvider = {
	setTimeout: (callback, delay) => setTimeout(callback, delay),
	clearTimeout: (timeoutId) => clearTimeout(timeoutId),
	setInterval: (callback, delay) => setInterval(callback, delay),
	clearInterval: (intervalId) => clearInterval(intervalId)
};
/**
* Allows customization of how timeouts are created.
*
* @tanstack/query-core makes liberal use of timeouts to implement `staleTime`
* and `gcTime`. The default TimeoutManager provider uses the platform's global
* `setTimeout` implementation, which is known to have scalability issues with
* thousands of timeouts on the event loop.
*
* If you hit this limitation, consider providing a custom TimeoutProvider that
* coalesces timeouts.
*/
var TimeoutManager = class {
	#provider = defaultTimeoutProvider;
	#providerCalled = false;
	/**
	* `setTimeoutProvider` can be used to set a custom implementation of the
	* `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` functions,
	* called a `TimeoutProvider`.
	*
	* This may be useful if you notice event loop performance issues with
	* thousands of queries. A custom TimeoutProvider could also support timer
	* delays longer than the global `setTimeout` maximum delay value of about
	* 24 days.
	*
	* It is important to call `setTimeoutProvider` before creating a
	* QueryClient or queries, so that the same provider is used consistently
	* for all timers in the application, since different TimeoutProviders
	* cannot cancel each others' timers.
	*
	* @example
	* ```ts
	* import { timeoutManager, QueryClient } from '@tanstack/query-core'
	* import { CustomTimeoutProvider } from './CustomTimeoutProvider'
	*
	* timeoutManager.setTimeoutProvider(new CustomTimeoutProvider())
	*
	* export const queryClient = new QueryClient()
	* ```
	*/
	setTimeoutProvider(provider) {
		this.#provider = provider;
	}
	/**
	* `setTimeout` schedules a callback to run after approximately `delay`
	* milliseconds, like the global `setTimeout` function. The callback can be
	* canceled with `clearTimeout`.
	*
	* It returns a timer ID, which may be a number or an object that can be
	* coerced to a number via `Symbol.toPrimitive`.
	*
	* @example
	* ```ts
	* import { timeoutManager } from '@tanstack/query-core'
	*
	* const timeoutId = timeoutManager.setTimeout(
	*   () => console.log('ran at:', new Date()),
	*   1000,
	* )
	*
	* const timeoutIdNumber: number = Number(timeoutId)
	* ```
	*/
	setTimeout(callback, delay) {
		return this.#provider.setTimeout(callback, delay);
	}
	/**
	* `clearTimeout` cancels a timeout callback scheduled with `setTimeout`,
	* like the global `clearTimeout` function. It should be called with a
	* timer ID returned by `setTimeout`.
	*
	* @example
	* ```ts
	* import { timeoutManager } from '@tanstack/query-core'
	*
	* const timeoutId = timeoutManager.setTimeout(
	*   () => console.log('ran at:', new Date()),
	*   1000,
	* )
	*
	* timeoutManager.clearTimeout(timeoutId)
	* ```
	*/
	clearTimeout(timeoutId) {
		this.#provider.clearTimeout(timeoutId);
	}
	/**
	* `setInterval` schedules a callback to be called approximately every
	* `delay` milliseconds, like the global `setInterval` function.
	*
	* Like `setTimeout`, it returns a timer ID, which may be a number or an
	* object that can be coerced to a number via `Symbol.toPrimitive`.
	*
	* @example
	* ```ts
	* import { timeoutManager } from '@tanstack/query-core'
	*
	* const intervalId = timeoutManager.setInterval(
	*   () => console.log('ran at:', new Date()),
	*   1000,
	* )
	* ```
	*/
	setInterval(callback, delay) {
		return this.#provider.setInterval(callback, delay);
	}
	/**
	* `clearInterval` can be used to cancel an interval, like the global
	* `clearInterval` function. It should be called with an interval ID
	* returned by `setInterval`.
	*
	* @example
	* ```ts
	* import { timeoutManager } from '@tanstack/query-core'
	*
	* const intervalId = timeoutManager.setInterval(
	*   () => console.log('ran at:', new Date()),
	*   1000,
	* )
	*
	* timeoutManager.clearInterval(intervalId)
	* ```
	*/
	clearInterval(intervalId) {
		this.#provider.clearInterval(intervalId);
	}
};
/**
* Singleton instance of {@link TimeoutManager}, used throughout TanStack Query to schedule and cancel timers.
*/
var timeoutManager = new TimeoutManager();
/**
* In many cases code wants to delay to the next event loop tick; this is not
* mediated by {@link timeoutManager}.
*
* This function is provided to make auditing the `tanstack/query-core` for
* incorrect use of system `setTimeout` easier.
*/
function systemSetTimeoutZero(callback) {
	setTimeout(callback, 0);
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/utils.js
/** @deprecated
* use `environmentManager.isServer()` instead.
*/
var isServer$1 = typeof window === "undefined" || "Deno" in globalThis;
function noop() {}
function functionalUpdate(updater, input) {
	return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
	return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
	return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveQueryValue(value, query) {
	return typeof value === "function" ? value(query) : value;
}
/**
* Checks whether a query matches the given {@link QueryFilters}.
* Every filter that is specified must match; filters that are left unspecified are ignored.
*
* @example
* ```ts
* const queryCache = queryClient.getQueryCache()
*
* const matchingQueries = queryCache
*   .getAll()
*   .filter((query) => matchQuery({ queryKey: ['posts'] }, query))
* ```
*/
function matchQuery(filters, query) {
	const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
	if (queryKey) {
		if (exact) {
			if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
		} else if (!partialMatchKey(query.queryKey, queryKey)) return false;
	}
	if (type !== "all") {
		const isActive = query.isActive();
		if (type === "active" && !isActive) return false;
		if (type === "inactive" && isActive) return false;
	}
	if (typeof stale === "boolean" && query.isStale() !== stale) return false;
	if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
	if (predicate && !predicate(query)) return false;
	return true;
}
/**
* Checks whether a mutation matches the given {@link MutationFilters}.
* Every filter that is specified must match; filters that are left unspecified are ignored.
* If a `mutationKey` filter is provided but the mutation has no `mutationKey` of its own, it does not match.
*
* @example
* ```ts
* const mutationCache = queryClient.getMutationCache()
*
* const matchingMutations = mutationCache
*   .getAll()
*   .filter((mutation) => matchMutation({ mutationKey: ['addPost'] }, mutation))
* ```
*/
function matchMutation(filters, mutation) {
	const { exact, status, predicate, mutationKey } = filters;
	if (mutationKey) {
		if (!mutation.options.mutationKey) return false;
		if (exact) {
			if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
		} else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
	}
	if (status && mutation.state.status !== status) return false;
	if (predicate && !predicate(mutation)) return false;
	return true;
}
function hashQueryKeyByOptions(queryKey, options) {
	return (options?.queryKeyHashFn || hashKey)(queryKey);
}
/**
* Default query & mutation keys hash function.
* Hashes the value into a stable hash.
*
* @example
* ```ts
* // Object keys are sorted, so key order doesn't affect the hash:
* hashKey(['todos', { page: 1, filter: 'done' }]) // === '["todos",{"filter":"done","page":1}]'
* ```
*/
function hashKey(queryKey) {
	return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
		result[key] = val[key];
		return result;
	}, {}) : val);
}
function partialMatchKey(a, b) {
	if (a === b) return true;
	if (typeof a !== typeof b) return false;
	if (a && b && typeof a === "object" && typeof b === "object") {
		if (Array.isArray(a) && Array.isArray(b)) {
			if (b.length > a.length) return false;
			for (let i = 0; i < b.length; i++) if (!partialMatchKey(a[i], b[i])) return false;
			return true;
		}
		const bKeys = Object.keys(b);
		for (const key of bKeys) if (!partialMatchKey(a[key], b[key])) return false;
		return true;
	}
	return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
	if (a === b) return a;
	if (depth > 500) return b;
	const array = isPlainArray(a) && isPlainArray(b);
	if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
	const aSize = (array ? a : Object.keys(a)).length;
	const bItems = array ? b : Object.keys(b);
	const bSize = bItems.length;
	const copy = array ? new Array(bSize) : {};
	let equalItems = 0;
	for (let i = 0; i < bSize; i++) {
		const key = array ? i : bItems[i];
		const aItem = a[key];
		const bItem = b[key];
		if (aItem === bItem) {
			copy[key] = aItem;
			if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
			continue;
		}
		if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
			copy[key] = bItem;
			continue;
		}
		const v = replaceEqualDeep(aItem, bItem, depth + 1);
		copy[key] = v;
		if (v === aItem) equalItems++;
	}
	return aSize === bSize && equalItems === aSize ? a : copy;
}
function isPlainArray(value) {
	return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
	if (!hasObjectPrototype(o)) return false;
	const objectPrototype = Object.getPrototypeOf(o);
	const ctor = objectPrototype?.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return false;
	const prot = ctor.prototype;
	if (!hasObjectPrototype(prot)) return false;
	if (!prot.hasOwnProperty("isPrototypeOf")) return false;
	if (objectPrototype !== Object.prototype) return false;
	return true;
}
function hasObjectPrototype(o) {
	return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
	return new Promise((resolve) => {
		timeoutManager.setTimeout(resolve, timeout);
	});
}
function replaceData(prevData, data, options) {
	if (typeof options.structuralSharing === "function") return options.structuralSharing(prevData, data);
	else if (options.structuralSharing !== false) return replaceEqualDeep(prevData, data);
	return data;
}
function addToEnd(items, item, max = 0) {
	const newItems = [...items, item];
	return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
	const newItems = [item, ...items];
	return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
/**
* Sentinel value that can be passed as a query's `queryFn` to conditionally disable the query (equivalent
* to `enabled: false`) while preserving full type inference for the query's data. Unlike `enabled: false`,
* a query disabled via `skipToken` cannot be triggered with `refetch`.
*
* @example
* ```ts
* new QueryObserver(queryClient, {
*   queryKey: ['post', postId],
*   queryFn: postId != null ? () => fetchPost(postId) : skipToken,
* })
* ```
*/
var skipToken = Symbol();
function ensureQueryFn(options, fetchOptions) {
	if (!options.queryFn && fetchOptions?.initialPromise) return () => fetchOptions.initialPromise;
	if (!options.queryFn || options.queryFn === skipToken) return () => Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options.queryHash}'`));
	return options.queryFn;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
	let consumed = false;
	let signal;
	Object.defineProperty(object, "signal", {
		enumerable: true,
		get: () => {
			signal ??= getSignal();
			if (consumed) return signal;
			consumed = true;
			if (signal.aborted) onCancelled();
			else signal.addEventListener("abort", onCancelled, { once: true });
			return signal;
		}
	});
	return object;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/environmentManager.js
var isServerFn = () => isServer$1;
/**
* Returns whether the current runtime should be treated as a server environment.
*/
var isServer = () => isServerFn();
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/subscribable.js
var Subscribable = class {
	constructor() {
		this.listeners = /* @__PURE__ */ new Set();
		this.subscribe = this.subscribe.bind(this);
	}
	subscribe(listener) {
		this.listeners.add(listener);
		this.onSubscribe();
		return () => {
			this.listeners.delete(listener);
			this.onUnsubscribe();
		};
	}
	hasListeners() {
		return this.listeners.size > 0;
	}
	onSubscribe() {}
	onUnsubscribe() {}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/focusManager.js
/**
* The `FocusManager` manages the focus state within TanStack Query.
*
* It can be used to change the default event listeners or to manually change the focus state.
*/
var FocusManager = class extends Subscribable {
	#focused;
	#cleanup;
	#setup;
	constructor() {
		super();
		this.#setup = (onFocus) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const listener = () => onFocus();
				window.addEventListener("visibilitychange", listener, false);
				return () => {
					window.removeEventListener("visibilitychange", listener);
				};
			}
		};
	}
	onSubscribe() {
		if (!this.#cleanup) this.setEventListener(this.#setup);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			this.#cleanup?.();
			this.#cleanup = void 0;
		}
	}
	/**
	* `setEventListener` can be used to set a custom event listener that will
	* be used to determine the focus state. The provided `setup` function
	* receives a `setFocused` callback: call it with a `boolean` to manually
	* set the focus state, or with no arguments to re-evaluate the current
	* focus state and notify subscribers.
	*
	* @example
	* ```ts
	* import { focusManager } from '@tanstack/query-core'
	*
	* focusManager.setEventListener((handleFocus) => {
	*   const listener = () => handleFocus()
	*   // Listen to visibilitychange
	*   if (typeof window !== 'undefined' && window.addEventListener) {
	*     window.addEventListener('visibilitychange', listener, false)
	*   }
	*
	*   return () => {
	*     // Be sure to unsubscribe if a new handler is set
	*     window.removeEventListener('visibilitychange', listener)
	*   }
	* })
	* ```
	*/
	setEventListener(setup) {
		this.#setup = setup;
		this.#cleanup?.();
		this.#cleanup = setup((focused) => {
			if (typeof focused === "boolean") this.setFocused(focused);
			else this.onFocus();
		});
	}
	/**
	* `setFocused` can be used to manually set the focus state. Set `undefined`
	* to fall back to the default focus check.
	*
	* @example
	* ```ts
	* import { focusManager } from '@tanstack/query-core'
	*
	* // Set focused
	* focusManager.setFocused(true)
	*
	* // Set unfocused
	* focusManager.setFocused(false)
	*
	* // Fallback to the default focus check
	* focusManager.setFocused(undefined)
	* ```
	*/
	setFocused(focused) {
		if (this.#focused !== focused) {
			this.#focused = focused;
			this.onFocus();
		}
	}
	/**
	* `onFocus` notifies all subscribed listeners with the current focus state.
	*/
	onFocus() {
		const isFocused = this.isFocused();
		this.listeners.forEach((listener) => {
			listener(isFocused);
		});
	}
	/**
	* `isFocused` can be used to get the current focus state.
	*/
	isFocused() {
		if (typeof this.#focused === "boolean") return this.#focused;
		return globalThis.document?.visibilityState !== "hidden";
	}
};
/**
* Singleton instance of {@link FocusManager}, used to manage and observe the focus state within TanStack Query.
*/
var focusManager = new FocusManager();
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/notifyManager.js
/**
* Default scheduling function used by the notify manager.
* Schedules the callback with the system's `setTimeout(callback, 0)`.
*/
var defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
	let queue = [];
	let transactions = 0;
	let notifyFn = (callback) => {
		callback();
	};
	let batchNotifyFn = (callback) => {
		callback();
	};
	let scheduleFn = defaultScheduler;
	const schedule = (callback) => {
		if (transactions) queue.push(callback);
		else scheduleFn(() => {
			notifyFn(callback);
		});
	};
	const flush = () => {
		const originalQueue = queue;
		queue = [];
		if (originalQueue.length) scheduleFn(() => {
			batchNotifyFn(() => {
				originalQueue.forEach((callback) => {
					notifyFn(callback);
				});
			});
		});
	};
	return {
		/**
		* Batches all updates scheduled inside the passed callback.
		* This is mainly used internally to optimize query client updating.
		* Batches can be nested; the queue is only flushed once the outermost `batch` call finishes.
		* The return value of `callback` is passed through.
		*/
		batch: (callback) => {
			let result;
			transactions++;
			try {
				result = callback();
			} finally {
				transactions--;
				if (!transactions) flush();
			}
			return result;
		},
		/**
		* All calls to the wrapped function will be batched.
		*/
		batchCalls: (callback) => {
			return (...args) => {
				schedule(() => {
					callback(...args);
				});
			};
		},
		/**
		* Schedules a function to be run on the next batch.
		* By default, the batch is run with a `setTimeout`, but this can be configured via `setScheduler`.
		*/
		schedule,
		/**
		* Use this method to set a custom notify function.
		* This can be used to for example wrap notifications with `React.act` while running tests.
		*/
		setNotifyFunction: (fn) => {
			notifyFn = fn;
		},
		/**
		* Use this method to set a custom function to batch notifications together into a single tick.
		* Framework adapters use this to plug in their own batching primitive, so that a single query
		* update only triggers one re-render instead of one per subscriber.
		*
		* @example
		* ```ts
		* import { notifyManager } from '@tanstack/query-core'
		* import { batch } from 'solid-js'
		*
		* notifyManager.setBatchNotifyFunction(batch)
		* ```
		*/
		setBatchNotifyFunction: (fn) => {
			batchNotifyFn = fn;
		},
		/**
		* Configures a custom callback that schedules when the next batch runs.
		* The default behavior is `setTimeout(callback, 0)`.
		*
		* @example
		* ```ts
		* import { notifyManager } from '@tanstack/query-core'
		*
		* // Schedule batches in the next microtask
		* notifyManager.setScheduler(queueMicrotask)
		*
		* // Schedule batches before the next frame is rendered
		* notifyManager.setScheduler(requestAnimationFrame)
		*
		* // Schedule batches some time in the future
		* notifyManager.setScheduler((cb) => setTimeout(cb, 10))
		* ```
		*/
		setScheduler: (fn) => {
			scheduleFn = fn;
		}
	};
}
/**
* Handles scheduling and batching callbacks in TanStack Query.
*/
var notifyManager = createNotifyManager();
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/onlineManager.js
/**
* The `OnlineManager` manages the online state within TanStack Query. It can
* be used to change the default event listeners or to manually change the
* online state.
*
* By default, the `onlineManager` assumes an active network connection, and
* listens to the `online` and `offline` events on the `window` object to
* detect changes.
*/
var OnlineManager = class extends Subscribable {
	#online = true;
	#cleanup;
	#setup;
	constructor() {
		super();
		this.#setup = (onOnline) => {
			if (typeof window !== "undefined" && window.addEventListener) {
				const onlineListener = () => onOnline(true);
				const offlineListener = () => onOnline(false);
				window.addEventListener("online", onlineListener, false);
				window.addEventListener("offline", offlineListener, false);
				return () => {
					window.removeEventListener("online", onlineListener);
					window.removeEventListener("offline", offlineListener);
				};
			}
		};
	}
	onSubscribe() {
		if (!this.#cleanup) this.setEventListener(this.#setup);
	}
	onUnsubscribe() {
		if (!this.hasListeners()) {
			this.#cleanup?.();
			this.#cleanup = void 0;
		}
	}
	/**
	* `setEventListener` can be used to set a custom event listener that will
	* be used to determine the online state. The provided `setup` function
	* receives a `setOnline` callback that should be called with a `boolean`
	* whenever the online state changes.
	*
	* @example
	* ```ts
	* import NetInfo from '@react-native-community/netinfo'
	* import { onlineManager } from '@tanstack/query-core'
	*
	* onlineManager.setEventListener((setOnline) => {
	*   return NetInfo.addEventListener((state) => {
	*     setOnline(!!state.isConnected)
	*   })
	* })
	* ```
	*/
	setEventListener(setup) {
		this.#setup = setup;
		this.#cleanup?.();
		this.#cleanup = setup(this.setOnline.bind(this));
	}
	/**
	* `setOnline` can be used to manually set the online state.
	*
	* @example
	* ```ts
	* import { onlineManager } from '@tanstack/query-core'
	*
	* // Set to online
	* onlineManager.setOnline(true)
	*
	* // Set to offline
	* onlineManager.setOnline(false)
	* ```
	*/
	setOnline(online) {
		if (this.#online !== online) {
			this.#online = online;
			this.listeners.forEach((listener) => {
				listener(online);
			});
		}
	}
	/**
	* `isOnline` can be used to get the current online state.
	*/
	isOnline() {
		return this.#online;
	}
};
/**
* Singleton instance of {@link OnlineManager}, used to manage and observe the online state within TanStack Query.
*/
var onlineManager = new OnlineManager();
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/retryer.js
function defaultRetryDelay(failureCount) {
	return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
	return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
/**
* The error thrown by a `Retryer` (and surfaced to `query.promise`/`mutation`) when a fetch is cancelled, e.g. via
* `query.cancel()`. `revert`, if `true`, tells the caller to restore the state the query was in before the fetch
* started instead of surfacing the error. `silent`, if `true`, tells the caller to suppress this error and instead
* resolve with the promise of the fetch that triggered the cancellation.
* @example
* ```ts
* query.cancel()
*
* try {
*   await query.promise
* } catch (error) {
*   if (error instanceof CancelledError) {
*     // the fetch was cancelled, e.g. via `query.cancel()`
*   }
* }
* ```
*/
var CancelledError = class extends Error {
	constructor(options) {
		super("CancelledError");
		this.revert = options?.revert;
		this.silent = options?.silent;
	}
};
function createRetryer(config) {
	let isRetryCancelled = false;
	let failureCount = 0;
	let continueFn;
	let status = "pending";
	let promiseResolve;
	let promiseReject;
	const promise = new Promise((resolve, reject) => {
		promiseResolve = resolve;
		promiseReject = reject;
	});
	promise.catch(noop);
	const isResolved = () => status !== "pending";
	const cancel = (cancelOptions) => {
		if (!isResolved()) {
			const error = new CancelledError(cancelOptions);
			reject(error);
			config.onCancel?.(error);
		}
	};
	const cancelRetry = () => {
		isRetryCancelled = true;
	};
	const continueRetry = () => {
		isRetryCancelled = false;
	};
	const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
	const canStart = () => canFetch(config.networkMode) && config.canRun();
	const resolve = (value) => {
		if (!isResolved()) {
			continueFn?.();
			status = "resolved";
			promiseResolve(value);
		}
	};
	const reject = (value) => {
		if (!isResolved()) {
			continueFn?.();
			status = "rejected";
			promiseReject(value);
		}
	};
	const pause = () => {
		return new Promise((continueResolve) => {
			continueFn = (value) => {
				if (isResolved() || canContinue()) continueResolve(value);
			};
			config.onPause?.();
		}).then(() => {
			continueFn = void 0;
			if (!isResolved()) config.onContinue?.();
		});
	};
	const run = () => {
		if (isResolved()) return;
		let promiseOrValue;
		const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
		try {
			promiseOrValue = initialPromise ?? config.fn();
		} catch (error) {
			promiseOrValue = Promise.reject(error);
		}
		Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
			if (isResolved()) return;
			const retry = config.retry ?? (isServer() ? 0 : 3);
			const retryDelay = config.retryDelay ?? defaultRetryDelay;
			const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
			const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
			if (isRetryCancelled || !shouldRetry) {
				reject(error);
				return;
			}
			failureCount++;
			config.onFail?.(failureCount, error);
			sleep(delay).then(() => {
				return canContinue() ? void 0 : pause();
			}).then(() => {
				if (isRetryCancelled) reject(error);
				else run();
			});
		});
	};
	return {
		promise,
		status: () => status,
		cancel,
		continue: () => {
			continueFn?.();
			return promise;
		},
		cancelRetry,
		continueRetry,
		canStart,
		start: () => {
			if (canStart()) run();
			else pause().then(run);
			return promise;
		}
	};
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/removable.js
var Removable = class {
	#gcTimeout;
	destroy() {
		this.clearGcTimeout();
	}
	scheduleGc() {
		this.clearGcTimeout();
		if (isValidTimeout(this.gcTime)) this.#gcTimeout = timeoutManager.setTimeout(() => {
			this.optionalRemove();
		}, this.gcTime);
	}
	updateGcTime(newGcTime) {
		this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (isServer() ? Infinity : 3e5));
	}
	clearGcTimeout() {
		if (this.#gcTimeout !== void 0) {
			timeoutManager.clearTimeout(this.#gcTimeout);
			this.#gcTimeout = void 0;
		}
	}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js
function infiniteQueryBehavior(pages) {
	return { onFetch: (context, query) => {
		const options = context.options;
		const direction = context.fetchOptions?.meta?.fetchMore?.direction;
		const oldPages = context.state.data?.pages || [];
		const oldPageParams = context.state.data?.pageParams || [];
		let result = {
			pages: [],
			pageParams: []
		};
		let currentPage = 0;
		const fetchFn = async () => {
			let cancelled = false;
			const addSignalProperty = (object) => {
				addConsumeAwareSignal(object, () => context.signal, () => cancelled = true);
			};
			const queryFn = ensureQueryFn(context.options, context.fetchOptions);
			const fetchPage = async (data, param, previous) => {
				if (cancelled) return Promise.reject(context.signal.reason);
				if (param == null && data.pages.length) return Promise.resolve(data);
				const createQueryFnContext = () => {
					const queryFnContext = {
						client: context.client,
						queryKey: context.queryKey,
						pageParam: param,
						direction: previous ? "backward" : "forward",
						meta: context.options.meta
					};
					addSignalProperty(queryFnContext);
					return queryFnContext;
				};
				const queryFnContext = createQueryFnContext();
				const page = await queryFn(queryFnContext);
				const { maxPages } = context.options;
				const addTo = previous ? addToStart : addToEnd;
				return {
					pages: addTo(data.pages, page, maxPages),
					pageParams: addTo(data.pageParams, param, maxPages)
				};
			};
			if (direction && oldPages.length) {
				const previous = direction === "backward";
				const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
				const oldData = {
					pages: oldPages,
					pageParams: oldPageParams
				};
				result = await fetchPage(oldData, pageParamFn(options, oldData), previous);
			} else {
				const remainingPages = pages ?? oldPages.length;
				do {
					const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
					if (currentPage > 0 && param == null) break;
					result = await fetchPage(result, param);
					currentPage++;
				} while (currentPage < remainingPages);
			}
			return result;
		};
		if (context.options.persister) context.fetchFn = () => {
			return context.options.persister?.(fetchFn, {
				client: context.client,
				queryKey: context.queryKey,
				meta: context.options.meta,
				signal: context.signal
			}, query);
		};
		else context.fetchFn = fetchFn;
	} };
}
function getNextPageParam(options, { pages, pageParams }) {
	const lastIndex = pages.length - 1;
	return pages.length > 0 ? options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
	return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/query.js
/**
* Represents a single cached query. A `Query` holds the query's key, options,
* state (data/error/status), and the observers currently subscribed to it.
*
* Instances are created and managed internally by `QueryCache`; application
* code typically interacts with queries indirectly through `QueryClient` or
* a framework hook like `useQuery`. Direct access to a `Query` instance is
* possible via `queryCache.find()`/`findAll()` for inspecting cache state.
*
* @example
* ```ts
* const queryCache = queryClient.getQueryCache()
* const query = queryCache.find({ queryKey: ['posts'] })
*
* if (query) {
*   console.log(query.state.dataUpdatedAt)
* }
* ```
*/
var Query = class extends Removable {
	#queryType;
	#initialState;
	#revertState;
	#cache;
	#client;
	#retryer;
	#defaultOptions;
	#abortSignalConsumed;
	constructor(config) {
		super();
		this.#abortSignalConsumed = false;
		this.#defaultOptions = config.defaultOptions;
		this.setOptions(config.options);
		this.observers = [];
		this.#client = config.client;
		this.#cache = this.#client.getQueryCache();
		this.queryKey = config.queryKey;
		this.queryHash = config.queryHash;
		this.#initialState = getDefaultState$1(this.options);
		this.state = config.state ?? this.#initialState;
		this.scheduleGc();
	}
	/**
	* The `meta` object passed in the query's options, if any.
	*/
	get meta() {
		return this.options.meta;
	}
	/** @internal */
	get queryType() {
		return this.#queryType;
	}
	/**
	* The promise for the currently in-flight fetch, if the query is fetching.
	* `undefined` when the query is not fetching.
	*/
	get promise() {
		return this.#retryer?.promise;
	}
	/** @internal */
	setOptions(options) {
		this.options = {
			...this.#defaultOptions,
			...options
		};
		if (options?._type) this.#queryType = options._type;
		this.updateGcTime(this.options.gcTime);
		if (this.state && this.state.data === void 0) {
			const defaultState = getDefaultState$1(this.options);
			if (defaultState.data !== void 0) {
				this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
				this.#initialState = defaultState;
			}
		}
	}
	optionalRemove() {
		if (!this.observers.length && this.state.fetchStatus === "idle") this.#cache.remove(this);
	}
	/** @internal */
	setData(newData, options) {
		const data = replaceData(this.state.data, newData, this.options);
		this.#dispatch({
			data,
			type: "success",
			dataUpdatedAt: options?.updatedAt,
			manual: options?.manual
		});
		return data;
	}
	/**
	* Merges the given partial state directly into this query's state, notifying observers. Used
	* by persistence and broadcast plugins to restore a state snapshot, and by devtools to let a
	* user manually trigger a loading/error state or edit the cached data.
	*/
	setState(state) {
		this.#dispatch({
			type: "setState",
			state
		});
	}
	/**
	* Cancels the query's currently in-flight fetch, if any.
	* - Returns a promise that resolves once the cancellation has settled.
	* - If no fetch is in progress, resolves immediately.
	*
	* @example
	* ```ts
	* await query.cancel()
	* ```
	*/
	cancel(options) {
		const promise = this.#retryer?.promise;
		this.#retryer?.cancel(options);
		return promise ? promise.then(noop).catch(noop) : Promise.resolve();
	}
	/**
	* Clears the query's garbage collection timeout and silently cancels any
	* in-flight fetch. Called by `QueryCache` when the query is removed from
	* the cache.
	*
	* @see {@link Query#cancel}
	*/
	destroy() {
		super.destroy();
		this.cancel({ silent: true });
	}
	/** @internal */
	get resetState() {
		return this.#initialState;
	}
	/**
	* Resets the query back to its initial state (the state it had when it was
	* first created, e.g. any `initialData`), destroying it first to cancel any
	* in-flight fetch.
	*/
	reset() {
		this.destroy();
		this.setState(this.resetState);
	}
	/**
	* Returns `true` if the query has at least one observer for which `enabled`
	* does not resolve to `false`.
	*/
	isActive() {
		return this.observers.some((observer) => resolveQueryValue(observer.options.enabled, this) !== false);
	}
	/**
	* Returns `true` if the query is disabled, meaning it will not fetch
	* automatically.
	* - If the query has observers, it is disabled when none of them are active
	*   (see `isActive`).
	* - If the query has no observers, it is disabled when its `queryFn` is
	*   `skipToken` or it has never been fetched.
	*/
	isDisabled() {
		if (this.getObserversCount() > 0) return !this.isActive();
		return this.options.queryFn === skipToken || !this.isFetched();
	}
	/**
	* Returns `true` if the query has been fetched, i.e. it has resolved with
	* either data or an error at least once.
	*/
	isFetched() {
		return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
	}
	/**
	* Returns `true` if the query has at least one observer configured with
	* `staleTime: 'static'`, meaning it is treated as never stale.
	*/
	isStatic() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => resolveQueryValue(observer.options.staleTime, this) === "static");
		return false;
	}
	/**
	* Returns `true` if the query is stale.
	* - If the query has observers, defers to whether any observer's current
	*   result reports `isStale` (which accounts for each observer's own
	*   `staleTime` and `enabled` state).
	* - If the query has no observers, it is considered stale when it has no
	*   data or has been invalidated.
	*
	* @see {@link Query#isStaleByTime}
	* @example
	* ```ts
	* if (query.isStale()) {
	*   // refetch or otherwise treat the cached data as outdated
	* }
	* ```
	*/
	isStale() {
		if (this.getObserversCount() > 0) return this.observers.some((observer) => observer.getCurrentResult().isStale);
		return this.state.data === void 0 || this.state.isInvalidated;
	}
	/**
	* Returns `true` if the query's data is stale relative to the given
	* `staleTime` (defaults to `0`).
	* - A query with no data is always stale.
	* - `staleTime: 'static'` is never stale.
	* - An invalidated query is always stale.
	* - Otherwise, staleness is based on elapsed time since `dataUpdatedAt`.
	*
	* @see {@link Query#isStale}
	* @example
	* ```ts
	* const isStale = query.isStaleByTime(1000 * 60)
	* ```
	*/
	isStaleByTime(staleTime = 0) {
		if (this.state.data === void 0) return true;
		if (staleTime === "static") return false;
		if (this.state.isInvalidated) return true;
		return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
	}
	/** @internal */
	onFocus() {
		this.observers.find((x) => x.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: false });
		this.#retryer?.continue();
	}
	/** @internal */
	onOnline() {
		this.observers.find((x) => x.shouldFetchOnReconnect())?.refetch({ cancelRefetch: false });
		this.#retryer?.continue();
	}
	/** @internal */
	addObserver(observer) {
		if (!this.observers.includes(observer)) {
			this.observers.push(observer);
			this.clearGcTimeout();
			this.#cache.notify({
				type: "observerAdded",
				query: this,
				observer
			});
		}
	}
	/** @internal */
	removeObserver(observer) {
		const index = this.observers.indexOf(observer);
		if (index !== -1) {
			this.observers.splice(index, 1);
			if (!this.observers.length) {
				if (this.#retryer) if (this.#abortSignalConsumed || this.state.fetchStatus === "paused" && this.state.status === "pending") this.#retryer.cancel({ revert: true });
				else this.#retryer.cancelRetry();
				this.scheduleGc();
			}
			this.#cache.notify({
				type: "observerRemoved",
				query: this,
				observer
			});
		}
	}
	/**
	* Returns the number of observers currently subscribed to this query.
	*
	* @example
	* ```ts
	* if (query.getObserversCount() === 0) {
	*   // no component is currently watching this query
	* }
	* ```
	*/
	getObserversCount() {
		return this.observers.length;
	}
	/**
	* Marks the query as invalidated, unless it is already invalidated. This
	* updates `state.isInvalidated` and notifies observers, but does not by
	* itself trigger a refetch.
	*
	* @example
	* ```ts
	* query.invalidate()
	* ```
	*/
	invalidate() {
		if (!this.state.isInvalidated) this.#dispatch({ type: "invalidate" });
	}
	/**
	* Fetches the query, i.e. runs its `queryFn` (through any configured
	* retryer/behavior) and updates the query's state with the result.
	* - If a fetch is already in flight, returns its promise instead of
	*   starting a new one, unless `fetchOptions.cancelRefetch` is set and the
	*   query already has data, in which case the current fetch is silently
	*   cancelled first.
	* - If `options` is passed, it replaces the query's current options
	*   before fetching.
	*/
	async fetch(options, fetchOptions) {
		if (this.state.fetchStatus !== "idle" && this.#retryer?.status() !== "rejected") {
			if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) this.cancel({ silent: true });
			else if (this.#retryer) {
				this.#retryer.continueRetry();
				return this.#retryer.promise;
			}
		}
		if (options) this.setOptions(options);
		if (!this.options.queryFn) {
			const observer = this.observers.find((x) => x.options.queryFn);
			if (observer) this.setOptions(observer.options);
		}
		const abortController = new AbortController();
		const addSignalProperty = (object) => {
			Object.defineProperty(object, "signal", {
				enumerable: true,
				get: () => {
					this.#abortSignalConsumed = true;
					return abortController.signal;
				}
			});
		};
		const fetchFn = () => {
			const queryFn = ensureQueryFn(this.options, fetchOptions);
			const createQueryFnContext = () => {
				const queryFnContext = {
					client: this.#client,
					queryKey: this.queryKey,
					meta: this.meta
				};
				addSignalProperty(queryFnContext);
				return queryFnContext;
			};
			const queryFnContext = createQueryFnContext();
			this.#abortSignalConsumed = false;
			if (this.options.persister) return this.options.persister(queryFn, queryFnContext, this);
			return queryFn(queryFnContext);
		};
		const createFetchContext = () => {
			const context = {
				fetchOptions,
				options: this.options,
				queryKey: this.queryKey,
				client: this.#client,
				state: this.state,
				fetchFn
			};
			addSignalProperty(context);
			return context;
		};
		const context = createFetchContext();
		(this.#queryType === "infinite" ? infiniteQueryBehavior(this.options.pages) : this.options.behavior)?.onFetch(context, this);
		this.#revertState = this.state;
		if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) this.#dispatch({
			type: "fetch",
			meta: context.fetchOptions?.meta
		});
		const retryer = this.#retryer = createRetryer({
			initialPromise: fetchOptions?.initialPromise,
			fn: context.fetchFn,
			onCancel: (error) => {
				if (error instanceof CancelledError && error.revert) this.setState({
					...this.#revertState,
					fetchStatus: "idle"
				});
				abortController.abort();
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue: () => {
				this.#dispatch({ type: "continue" });
			},
			retry: context.options.retry,
			retryDelay: context.options.retryDelay,
			networkMode: context.options.networkMode,
			canRun: () => true
		});
		try {
			const data = await retryer.start();
			if (data === void 0) throw new Error(`${this.queryHash} data is undefined`);
			this.setData(data);
			this.#cache.config.onSuccess?.(data, this);
			this.#cache.config.onSettled?.(data, this.state.error, this);
			return data;
		} catch (error) {
			if (error instanceof CancelledError) {
				if (error.silent) return this.#retryer.promise;
				else if (error.revert) {
					if (this.state.data === void 0) throw error;
					return this.state.data;
				}
			}
			this.#dispatch({
				type: "error",
				error
			});
			this.#cache.config.onError?.(error, this);
			this.#cache.config.onSettled?.(this.state.data, error, this);
			throw error;
		} finally {
			if (this.#retryer === retryer) this.#retryer = void 0;
			this.scheduleGc();
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					fetchFailureCount: action.failureCount,
					fetchFailureReason: action.error
				};
				case "pause": return {
					...state,
					fetchStatus: "paused"
				};
				case "continue": return {
					...state,
					fetchStatus: "fetching"
				};
				case "fetch": return {
					...state,
					...fetchState(state.data, this.options),
					fetchMeta: action.meta ?? null
				};
				case "success":
					const newState = {
						...state,
						...successState(action.data, action.dataUpdatedAt),
						dataUpdateCount: state.dataUpdateCount + 1,
						...!action.manual && {
							fetchStatus: "idle",
							fetchFailureCount: 0,
							fetchFailureReason: null
						}
					};
					this.#revertState = action.manual ? newState : void 0;
					return newState;
				case "error":
					const error = action.error;
					return {
						...state,
						error,
						errorUpdateCount: state.errorUpdateCount + 1,
						errorUpdatedAt: Date.now(),
						fetchFailureCount: state.fetchFailureCount + 1,
						fetchFailureReason: error,
						fetchStatus: "idle",
						status: "error",
						isInvalidated: true
					};
				case "invalidate": return {
					...state,
					isInvalidated: true
				};
				case "setState": return {
					...state,
					...action.state
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.observers.slice().forEach((observer) => {
				observer.onQueryUpdate();
			});
			this.#cache.notify({
				query: this,
				type: "updated",
				action
			});
		});
	}
};
function fetchState(data, options) {
	return {
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
		...data === void 0 && {
			error: null,
			status: "pending"
		}
	};
}
function successState(data, dataUpdatedAt) {
	return {
		data,
		dataUpdatedAt: dataUpdatedAt ?? Date.now(),
		error: null,
		isInvalidated: false,
		status: "success"
	};
}
function getDefaultState$1(options) {
	const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
	const hasData = data !== void 0;
	const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
	return {
		data,
		dataUpdateCount: 0,
		dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
		error: null,
		errorUpdateCount: 0,
		errorUpdatedAt: 0,
		fetchFailureCount: 0,
		fetchFailureReason: null,
		fetchMeta: null,
		isInvalidated: false,
		status: hasData ? "success" : "pending",
		fetchStatus: "idle"
	};
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/mutation.js
/**
* Represents a single mutation attempt. A `Mutation` holds the mutation's
* options, state (data/error/status), and the `MutationObserver`s currently
* subscribed to it.
*
* Instances are created and managed internally by `MutationCache`; application
* code typically interacts with mutations indirectly through `QueryClient` or
* a framework hook like `useMutation`. Direct access to a `Mutation` instance
* is possible via `mutationCache.find()`/`getAll()` for inspecting cache state.
*
* @example
* ```ts
* const mutationCache = queryClient.getMutationCache()
*
* const mutation = mutationCache.find({ mutationKey: ['addPost'] })
* ```
*/
var Mutation = class extends Removable {
	#client;
	#observers;
	#mutationCache;
	#retryer;
	constructor(config) {
		super();
		this.#client = config.client;
		this.mutationId = config.mutationId;
		this.#mutationCache = config.mutationCache;
		this.#observers = [];
		this.state = config.state || getDefaultState();
		this.setOptions(config.options);
		this.scheduleGc();
	}
	/** @internal */
	setOptions(options) {
		this.options = options;
		this.updateGcTime(this.options.gcTime);
	}
	/**
	* The `meta` object passed in the mutation's options, if any.
	*/
	get meta() {
		return this.options.meta;
	}
	/** @internal */
	addObserver(observer) {
		if (!this.#observers.includes(observer)) {
			this.#observers.push(observer);
			this.clearGcTimeout();
			this.#mutationCache.notify({
				type: "observerAdded",
				mutation: this,
				observer
			});
		}
	}
	/** @internal */
	removeObserver(observer) {
		this.#observers = this.#observers.filter((x) => x !== observer);
		this.scheduleGc();
		this.#mutationCache.notify({
			type: "observerRemoved",
			mutation: this,
			observer
		});
	}
	optionalRemove() {
		if (!this.#observers.length) if (this.state.status === "pending") this.scheduleGc();
		else this.#mutationCache.remove(this);
	}
	/**
	* Resumes a mutation that is currently paused or was restored from a
	* dehydrated, still-`pending` state.
	*
	* - If this mutation has an active retryer (it paused mid-attempt, e.g. due
	*   to the network mode or scope-based queuing), its retryer is resumed.
	* - Otherwise, if the mutation's status is still `pending` (e.g. it was
	*   dehydrated while an attempt was in flight and never got a retryer in
	*   this instance), `execute` is called again with the last known variables.
	* - Otherwise the mutation has already settled and this resolves immediately
	*   without running anything again.
	*
	* @example
	* ```ts
	* // typically driven by reconnect handling, e.g. queryClient.resumePausedMutations()
	* const mutation = mutationCache.find({ mutationKey: ['addPost'] })
	* await mutation?.continue()
	* ```
	*
	* @see {@link Mutation#execute}
	*/
	continue() {
		return this.#retryer?.continue() ?? (this.state.status === "pending" ? this.execute(this.state.variables) : Promise.resolve());
	}
	/**
	* Runs the mutation function for the given variables through a retryer, and
	* drives the mutation's state and lifecycle callbacks through to settlement.
	*
	* If this mutation's state is already `pending` when `execute` is called
	* (i.e. it was restored, still in-flight, from a dehydrated state), the
	* `onMutate` step is skipped and a `continue` action is dispatched to
	* unpause it; otherwise a `pending` action is dispatched first, then the
	* mutation cache's `onMutate` and the mutation's own `onMutate` option are
	* awaited in that order, and the resulting context is stored.
	*
	* The mutation function is then run (subject to `retry`/`retryDelay`/
	* `networkMode`, and to the mutation cache's scope-based serialization).
	* On success, the cache's `onSuccess`/`onSettled` callbacks run before the
	* mutation's own `onSuccess`/`onSettled` options, a `success` action is
	* dispatched, and the resolved data is returned. On failure, the same
	* cache-then-option ordering is used for `onError`/`onSettled`, but each of
	* those four callbacks is individually caught so that a throwing callback
	* cannot mask the original error; an `error` action is then dispatched and
	* the original error is re-thrown.
	*
	* @example
	* ```ts
	* // Called internally by `MutationObserver.mutate` and `Mutation.continue` —
	* // applications normally trigger mutations through those, not this method.
	* const data = await mutation.execute(variables)
	* ```
	*
	* @see {@link Mutation#continue}
	*/
	async execute(variables) {
		const onContinue = () => {
			this.#dispatch({ type: "continue" });
		};
		const mutationFnContext = {
			client: this.#client,
			meta: this.options.meta,
			mutationKey: this.options.mutationKey
		};
		const retryer = this.#retryer = createRetryer({
			fn: () => {
				if (!this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
				return this.options.mutationFn(variables, mutationFnContext);
			},
			onFail: (failureCount, error) => {
				this.#dispatch({
					type: "failed",
					failureCount,
					error
				});
			},
			onPause: () => {
				this.#dispatch({ type: "pause" });
			},
			onContinue,
			retry: this.options.retry ?? 0,
			retryDelay: this.options.retryDelay,
			networkMode: this.options.networkMode,
			canRun: () => this.#mutationCache.canRun(this)
		});
		const restored = this.state.status === "pending";
		const isPaused = !retryer.canStart();
		try {
			if (restored) onContinue();
			else {
				this.#dispatch({
					type: "pending",
					variables,
					isPaused
				});
				if (this.#mutationCache.config.onMutate) await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
				const context = await this.options.onMutate?.(variables, mutationFnContext);
				if (context !== this.state.context) this.#dispatch({
					type: "pending",
					context,
					variables,
					isPaused
				});
			}
			const data = await retryer.start();
			await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
			await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
			await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
			await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
			this.#dispatch({
				type: "success",
				data
			});
			return data;
		} catch (error) {
			try {
				await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			try {
				await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
			} catch (e) {
				Promise.reject(e);
			}
			this.#dispatch({
				type: "error",
				error
			});
			throw error;
		} finally {
			if (this.#retryer === retryer) this.#retryer = void 0;
			this.#mutationCache.runNext(this);
		}
	}
	#dispatch(action) {
		const reducer = (state) => {
			switch (action.type) {
				case "failed": return {
					...state,
					failureCount: action.failureCount,
					failureReason: action.error
				};
				case "pause": return {
					...state,
					isPaused: true
				};
				case "continue": return {
					...state,
					isPaused: false
				};
				case "pending": return {
					...state,
					context: action.context,
					data: void 0,
					failureCount: 0,
					failureReason: null,
					error: null,
					isPaused: action.isPaused,
					status: "pending",
					variables: action.variables,
					submittedAt: Date.now()
				};
				case "success": return {
					...state,
					data: action.data,
					failureCount: 0,
					failureReason: null,
					error: null,
					status: "success",
					isPaused: false
				};
				case "error": return {
					...state,
					data: void 0,
					error: action.error,
					failureCount: state.failureCount + 1,
					failureReason: action.error,
					isPaused: false,
					status: "error"
				};
			}
		};
		this.state = reducer(this.state);
		notifyManager.batch(() => {
			this.#observers.forEach((observer) => {
				observer.onMutationUpdate(action);
			});
			this.#mutationCache.notify({
				mutation: this,
				type: "updated",
				action
			});
		});
	}
};
function getDefaultState() {
	return {
		context: void 0,
		data: void 0,
		error: null,
		failureCount: 0,
		failureReason: null,
		isPaused: false,
		status: "idle",
		variables: void 0,
		submittedAt: 0
	};
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/mutationCache.js
/**
* The `MutationCache` is the storage for mutations.
*
* Normally, you will not interact with the `MutationCache` directly and instead use a
* `QueryClient`. You can subscribe to it (inherited from `Subscribable`) to be informed of
* safe/known updates to the cache, such as mutations being added, removed, or updated.
*
* @example
* ```ts
* const unsubscribe = mutationCache.subscribe((event) => {
*   console.log(event.type, event.mutation)
* })
* ```
*/
var MutationCache = class extends Subscribable {
	#mutations;
	#scopes;
	#mutationId;
	constructor(config = {}) {
		super();
		this.config = config;
		this.#mutations = /* @__PURE__ */ new Set();
		this.#scopes = /* @__PURE__ */ new Map();
		this.#mutationId = 0;
	}
	/** @internal */
	build(client, options, state) {
		const mutation = new Mutation({
			client,
			mutationCache: this,
			mutationId: ++this.#mutationId,
			options: client.defaultMutationOptions(options),
			state
		});
		this.add(mutation);
		return mutation;
	}
	/** @internal */
	add(mutation) {
		this.#mutations.add(mutation);
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const scopedMutations = this.#scopes.get(scope);
			if (scopedMutations) scopedMutations.push(mutation);
			else this.#scopes.set(scope, [mutation]);
		}
		this.notify({
			type: "added",
			mutation
		});
	}
	/** @internal */
	remove(mutation) {
		if (this.#mutations.delete(mutation)) {
			const scope = scopeFor(mutation);
			if (typeof scope === "string") {
				const scopedMutations = this.#scopes.get(scope);
				if (scopedMutations) {
					if (scopedMutations.length > 1) {
						const index = scopedMutations.indexOf(mutation);
						if (index !== -1) scopedMutations.splice(index, 1);
					} else if (scopedMutations[0] === mutation) this.#scopes.delete(scope);
				}
			}
		}
		this.notify({
			type: "removed",
			mutation
		});
	}
	/** @internal */
	canRun(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") {
			const firstPendingMutation = this.#scopes.get(scope)?.find((m) => m.state.status === "pending");
			return !firstPendingMutation || firstPendingMutation === mutation;
		} else return true;
	}
	/** @internal */
	runNext(mutation) {
		const scope = scopeFor(mutation);
		if (typeof scope === "string") return (this.#scopes.get(scope)?.find((m) => m !== mutation && m.state.isPaused))?.continue() ?? Promise.resolve();
		else return Promise.resolve();
	}
	/**
	* Removes all mutations from the cache.
	*
	* @example
	* ```ts
	* const mutationCache = queryClient.getMutationCache()
	*
	* mutationCache.clear()
	* ```
	*/
	clear() {
		notifyManager.batch(() => {
			this.#mutations.forEach((mutation) => {
				this.notify({
					type: "removed",
					mutation
				});
			});
			this.#mutations.clear();
			this.#scopes.clear();
		});
	}
	/**
	* Returns all mutations within the cache.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about a mutation in rare scenarios.
	*
	* @example
	* ```ts
	* const mutationCache = queryClient.getMutationCache()
	*
	* const mutations = mutationCache.getAll()
	* ```
	*/
	getAll() {
		return Array.from(this.#mutations);
	}
	/**
	* A slightly more advanced method that can be used to get an existing mutation instance from
	* the cache. If the mutation does not exist, `undefined` is returned.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about a mutation in rare scenarios.
	*
	* @see {@link MutationCache#findAll}
	* @example
	* ```ts
	* const mutationCache = queryClient.getMutationCache()
	*
	* const mutation = mutationCache.find({ mutationKey: ['addPost'] })
	* ```
	*/
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((mutation) => matchMutation(defaultedFilters, mutation));
	}
	/**
	* An even more advanced method that can be used to get existing mutation instances from the
	* cache that match the given filters. If no mutations match, an empty array is returned.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about mutations in rare scenarios.
	*
	* @see {@link MutationCache#find}
	* @example
	* ```ts
	* const mutationCache = queryClient.getMutationCache()
	*
	* const mutations = mutationCache.findAll({ mutationKey: ['addPost'] })
	* ```
	*/
	findAll(filters = {}) {
		return this.getAll().filter((mutation) => matchMutation(filters, mutation));
	}
	/** @internal */
	notify(event) {
		notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	/** @internal */
	resumePausedMutations() {
		const pausedMutations = this.getAll().filter((x) => x.state.isPaused);
		return notifyManager.batch(() => Promise.all(pausedMutations.map((mutation) => mutation.continue().catch(noop))));
	}
};
function scopeFor(mutation) {
	return mutation.options.scope?.id;
}
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryCache.js
/**
* The `QueryCache` is the storage mechanism for TanStack Query. It stores all the data, meta
* information, and state of the queries it contains.
*
* Normally, you will not interact with the `QueryCache` directly and instead use a `QueryClient`
* for a specific cache. You can subscribe to it (inherited from `Subscribable`) to be informed of
* safe/known updates to the cache, such as queries being added, removed, or updated — updates made
* outside of the cache's own tracked mechanisms (e.g. mutating a query's state object directly) do
* not notify subscribers.
*
* @example
* ```ts
* const unsubscribe = queryCache.subscribe((event) => {
*   console.log(event.type, event.query)
* })
* ```
*/
var QueryCache = class extends Subscribable {
	#queries;
	constructor(config = {}) {
		super();
		this.config = config;
		this.#queries = /* @__PURE__ */ new Map();
	}
	/**
	* Returns the existing `Query` instance for the given options' `queryKey`/`queryHash`, or
	* builds and adds a new one to the cache if none exists yet. Used by framework adapters and
	* plugins (e.g. broadcast/persistence) that need to get-or-create a `Query` directly, bypassing
	* the reactive `QueryObserver` machinery.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* const query = queryCache.build(queryClient, {
	*   queryKey: ['posts'],
	*   queryFn: fetchPosts,
	* })
	* ```
	*/
	build(client, options, state) {
		const queryKey = options.queryKey;
		const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
		let query = this.get(queryHash);
		if (!query) {
			query = new Query({
				client,
				queryKey,
				queryHash,
				options: client.defaultQueryOptions(options),
				state,
				defaultOptions: client.getQueryDefaults(queryKey)
			});
			this.add(query);
		}
		return query;
	}
	/** @internal */
	add(query) {
		if (!this.#queries.has(query.queryHash)) {
			this.#queries.set(query.queryHash, query);
			this.notify({
				type: "added",
				query
			});
		}
	}
	/**
	* Destroys the given `Query` and removes it from the cache, notifying subscribers with a
	* `'removed'` event. A no-op if the query is no longer the one currently stored under its hash
	* (e.g. it was already replaced). Used by plugins (e.g. the broadcast client) that mirror
	* removals across `QueryCache` instances.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	* const query = queryCache.find({ queryKey: ['posts'] })
	*
	* if (query) {
	*   queryCache.remove(query)
	* }
	* ```
	*/
	remove(query) {
		const queryInMap = this.#queries.get(query.queryHash);
		if (queryInMap) {
			query.destroy();
			if (queryInMap === query) this.#queries.delete(query.queryHash);
			this.notify({
				type: "removed",
				query
			});
		}
	}
	/**
	* Removes all queries from the cache.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* queryCache.clear()
	* ```
	*/
	clear() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				this.remove(query);
			});
		});
	}
	/**
	* Returns the `Query` instance stored under the given `queryHash`, or `undefined` if none
	* exists. Unlike {@link QueryCache#find}, this looks up by the already-computed hash rather
	* than by `QueryFilters`. Used by plugins (e.g. broadcast/hydration) that already have a hash
	* to look up directly.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	* const queryHash = hashKey(['posts'])
	*
	* const query = queryCache.get(queryHash)
	* ```
	*/
	get(queryHash) {
		return this.#queries.get(queryHash);
	}
	/**
	* Returns all queries within the cache.
	*
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* const queries = queryCache.getAll()
	* ```
	*/
	getAll() {
		return [...this.#queries.values()];
	}
	/**
	* A slightly more advanced method that can be used to get an existing query instance from the
	* cache. This instance not only contains all the state for the query, but all of the instances,
	* and underlying guts of the query as well. If the query does not exist, `undefined` is
	* returned.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about a query in rare scenarios (e.g. looking at `query.state.dataUpdatedAt` to
	* decide whether a query is fresh enough to be used as an initial value).
	*
	* @see {@link QueryCache#findAll}
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* const query = queryCache.find({ queryKey: ['posts'] })
	* ```
	*/
	find(filters) {
		const defaultedFilters = {
			exact: true,
			...filters
		};
		return this.getAll().find((query) => matchQuery(defaultedFilters, query));
	}
	/**
	* An even more advanced method that can be used to get existing query instances from the cache
	* that partially match a query key. If no queries match, an empty array is returned.
	*
	* This is not typically needed for most applications, but can come in handy when needing more
	* information about queries in rare scenarios.
	*
	* @see {@link QueryCache#find}
	* @example
	* ```ts
	* const queryCache = queryClient.getQueryCache()
	*
	* const queries = queryCache.findAll({ queryKey: ['posts'] })
	* ```
	*/
	findAll(filters = {}) {
		const queries = this.getAll();
		return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
	}
	/** @internal */
	notify(event) {
		notifyManager.batch(() => {
			this.listeners.forEach((listener) => {
				listener(event);
			});
		});
	}
	/** @internal */
	onFocus() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				query.onFocus();
			});
		});
	}
	/** @internal */
	onOnline() {
		notifyManager.batch(() => {
			this.getAll().forEach((query) => {
				query.onOnline();
			});
		});
	}
};
//#endregion
//#region node_modules/@tanstack/query-core/build/modern/queryClient.js
/**
* `QueryClient` is used to interact with a cache of queries and mutations. It owns a
* `QueryCache` and a `MutationCache` (creating default ones if none are passed in) and holds
* the default options that are applied to queries and mutations created through it.
*
* @example
* ```ts
* const queryClient = new QueryClient({
*   defaultOptions: {
*     queries: {
*       staleTime: Infinity,
*     },
*   },
* })
*
* await queryClient.query({ queryKey: ['posts'], queryFn: fetchPosts })
* ```
*/
var QueryClient = class {
	#queryCache;
	#mutationCache;
	#defaultOptions;
	#queryDefaults;
	#mutationDefaults;
	#mountCount;
	#unsubscribeFocus;
	#unsubscribeOnline;
	constructor(config = {}) {
		this.#queryCache = config.queryCache || new QueryCache();
		this.#mutationCache = config.mutationCache || new MutationCache();
		this.#defaultOptions = config.defaultOptions || {};
		this.#queryDefaults = /* @__PURE__ */ new Map();
		this.#mutationDefaults = /* @__PURE__ */ new Map();
		this.#mountCount = 0;
	}
	/**
	* Called by a framework adapter's `QueryClientProvider`-equivalent when it mounts, to start
	* listening for focus/online events and resume paused mutations. Ref-counted via an internal
	* mount count, so nested or multiple providers sharing the same `QueryClient` don't tear down
	* the shared listeners until the last one unmounts.
	*/
	mount() {
		this.#mountCount++;
		if (this.#mountCount !== 1) return;
		this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
			if (focused) {
				await this.resumePausedMutations();
				this.#queryCache.onFocus();
			}
		});
		this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
			if (online) {
				await this.resumePausedMutations();
				this.#queryCache.onOnline();
			}
		});
	}
	/**
	* The inverse of {@link QueryClient#mount} — called by a framework adapter's
	* `QueryClientProvider`-equivalent when it unmounts. Only tears down the focus/online
	* listeners once the mount count returns to `0`.
	*/
	unmount() {
		this.#mountCount--;
		if (this.#mountCount !== 0) return;
		this.#unsubscribeFocus?.();
		this.#unsubscribeFocus = void 0;
		this.#unsubscribeOnline?.();
		this.#unsubscribeOnline = void 0;
	}
	/**
	* Returns the number of queries in the cache that are currently fetching, optionally
	* matching a set of filters. This includes background-fetching, loading new pages, and
	* loading more infinite query results.
	*
	* @example
	* ```ts
	* if (queryClient.isFetching()) {
	*   console.log('At least one query is fetching!')
	* }
	* ```
	*/
	isFetching(filters) {
		return this.#queryCache.findAll({
			...filters,
			fetchStatus: "fetching"
		}).length;
	}
	/**
	* Returns the number of mutations in the cache that are currently pending, optionally
	* matching a set of filters.
	*
	* @example
	* ```ts
	* if (queryClient.isMutating()) {
	*   console.log('At least one mutation is pending!')
	* }
	* ```
	*/
	isMutating(filters) {
		return this.#mutationCache.findAll({
			...filters,
			status: "pending"
		}).length;
	}
	/**
	* Imperative (non-reactive) way to retrieve data for a QueryKey.
	* Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
	*
	* Hint: Do not use this function inside a component, because it won't receive updates.
	* Use `useQuery` to create a `QueryObserver` that subscribes to changes.
	*
	* @see {@link QueryClient#getQueriesData}
	*/
	getQueryData(queryKey) {
		const options = this.defaultQueryOptions({ queryKey });
		return this.#queryCache.get(options.queryHash)?.state.data;
	}
	/**
	* @deprecated Use queryClient.query({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
	*/
	ensureQueryData(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		const query = this.#queryCache.build(this, defaultedOptions);
		const cachedData = query.state.data;
		if (cachedData === void 0) return this.fetchQuery(options);
		if (options.revalidateIfStale && query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query))) this.prefetchQuery(defaultedOptions);
		return Promise.resolve(cachedData);
	}
	/**
	* Imperative (non-reactive) way to retrieve the cached data of multiple queries at once.
	* Only queries matching the given filters are returned; if none match, an empty array is
	* returned.
	*
	* Because the matched queries can hold data of different shapes (e.g. a broad filter can match
	* queries with unrelated data types), the `TQueryFnData` generic defaults to `unknown` rather
	* than being inferred. Passing a more specific type is a convenience for call sites that know
	* every matched query holds the same shape — it is not checked against the actual cache
	* contents.
	*
	* @see {@link QueryClient#getQueryData}
	* @example
	* ```ts
	* const data = queryClient.getQueriesData({ queryKey: ['posts'] })
	* ```
	*/
	getQueriesData(filters) {
		return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
			return [queryKey, state.data];
		});
	}
	/**
	* Synchronous way to immediately update a query's cached data. If the updater (or the value
	* passed) resolves to `undefined`, the cache is left untouched and no query is created;
	* otherwise, if the query does not exist yet, it will be created. To update multiple queries
	* at once by partially matching query keys, use {@link QueryClient#setQueriesData} instead.
	*
	* Updates must be performed immutably: do not mutate `oldData`, or data previously retrieved
	* via {@link QueryClient#getQueryData}, in place.
	*
	* @param queryKey - The query key to set data for.
	* @param updater - Either the new data, or a function that receives the current data (which
	* may be `undefined`) and returns the new data.
	*
	* @example
	* ```ts
	* queryClient.setQueryData(['posts'], newPosts)
	*
	* // Or, using an updater function that receives the current data:
	* queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost])
	* ```
	*/
	setQueryData(queryKey, updater, options) {
		const defaultedOptions = this.defaultQueryOptions({ queryKey });
		const prevData = this.#queryCache.get(defaultedOptions.queryHash)?.state.data;
		const data = functionalUpdate(updater, prevData);
		if (data === void 0) return;
		return this.#queryCache.build(this, defaultedOptions).setData(data, {
			...options,
			manual: true
		});
	}
	/**
	* Synchronous way to immediately update the cached data of multiple queries at once, using
	* filters or partial query key matching. Only queries that already exist and match the given
	* filters are updated; no new cache entries are created. Internally this calls
	* {@link QueryClient#setQueryData} for each matching query.
	*
	* @example
	* ```ts
	* queryClient.setQueriesData({ queryKey: ['posts'] }, (oldPosts) =>
	*   oldPosts ? oldPosts.filter((post) => post.id !== deletedId) : oldPosts,
	* )
	* ```
	*/
	setQueriesData(filters, updater, options) {
		return notifyManager.batch(() => this.#queryCache.findAll(filters).map(({ queryKey }) => [queryKey, this.setQueryData(queryKey, updater, options)]));
	}
	/**
	* Imperative (non-reactive) way to retrieve an existing query's state. If the query does not
	* exist, `undefined` is returned.
	*
	* @example
	* ```ts
	* const state = queryClient.getQueryState(['posts'])
	* console.log(state?.dataUpdatedAt)
	* ```
	*/
	getQueryState(queryKey) {
		const options = this.defaultQueryOptions({ queryKey });
		return this.#queryCache.get(options.queryHash)?.state;
	}
	/**
	* Removes queries from the cache that match the given filters. Unlike
	* {@link QueryClient#invalidateQueries} or {@link QueryClient#refetchQueries}, this removes
	* matching queries from the cache instead of refetching them. Without filters, every query in
	* the cache is removed.
	*
	* @example
	* ```ts
	* queryClient.removeQueries({ queryKey: ['posts'], exact: true })
	* ```
	*/
	removeQueries(filters) {
		const queryCache = this.#queryCache;
		notifyManager.batch(() => {
			queryCache.findAll(filters).forEach((query) => {
				queryCache.remove(query);
			});
		});
	}
	/**
	* Resets queries matching the given filters back to their initial state (e.g. any
	* `initialData`), notifying subscribers rather than removing them. Active queries among the
	* matched set are then refetched, and the returned promise resolves once that refetch settles.
	*
	* @example
	* ```ts
	* await queryClient.resetQueries({ queryKey: ['posts'], exact: true })
	* ```
	*/
	resetQueries(filters, options) {
		const queryCache = this.#queryCache;
		return notifyManager.batch(() => {
			const matched = queryCache.findAll(filters);
			const queriesToRefetch = new Set(matched);
			matched.forEach((query) => {
				query.reset();
			});
			return this.refetchQueries({
				type: "active",
				predicate: (query) => queriesToRefetch.has(query)
			}, options);
		});
	}
	/**
	* Cancels outgoing fetches for queries matching the given filters. Most useful when performing
	* optimistic updates, since any outgoing refetch that resolves afterwards would otherwise
	* overwrite the optimistic update. By default (`revert: true`), a cancelled query's data is
	* reverted to its state before the outgoing fetch started.
	*
	* The returned promise never rejects, even if individual cancellations fail.
	*
	* @example
	* ```ts
	* await queryClient.cancelQueries({ queryKey: ['posts'], exact: true })
	* ```
	*/
	cancelQueries(filters, cancelOptions = {}) {
		const defaultedCancelOptions = {
			revert: true,
			...cancelOptions
		};
		const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions)));
		return Promise.all(promises).then(noop).catch(noop);
	}
	/**
	* Marks queries matching the given filters as invalidated. Unlike
	* {@link QueryClient#removeQueries}, invalidated queries stay in the cache.
	*
	* Unless `filters.refetchType` is `'none'`, matching queries are then refetched via
	* {@link QueryClient#refetchQueries}, using `filters.refetchType` if set, otherwise
	* `filters.type`, otherwise `'active'`.
	*
	* @example
	* ```ts
	* await queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'active' })
	* ```
	*/
	invalidateQueries(filters, options = {}) {
		return notifyManager.batch(() => {
			this.#queryCache.findAll(filters).forEach((query) => {
				query.invalidate();
			});
			if (filters?.refetchType === "none") return Promise.resolve();
			return this.refetchQueries({
				...filters,
				type: filters?.refetchType ?? filters?.type ?? "active"
			}, options);
		});
	}
	/**
	* Refetches queries matching the given filters, regardless of whether they are stale. Without
	* filters, every query in the cache is refetched. Queries that are disabled, or static (only
	* have observers with a static `staleTime`), are never refetched.
	*
	* By default (`cancelRefetch: true`), a currently running fetch is cancelled before the new
	* one starts. The returned promise resolves once all matching queries have settled; it does
	* not reject on individual query failures unless `throwOnError` is set.
	*
	* @example
	* ```ts
	* // refetch all active queries partially matching a query key:
	* await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
	* ```
	*/
	refetchQueries(filters, options = {}) {
		const fetchOptions = {
			...options,
			cancelRefetch: options.cancelRefetch ?? true
		};
		const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
			let promise = query.fetch(void 0, fetchOptions);
			if (!fetchOptions.throwOnError) promise = promise.catch(noop);
			return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
		}));
		return Promise.all(promises).then(noop);
	}
	/**
	* Asynchronous method to fetch and cache a query, resolving with the data or throwing with
	* the error.
	*
	* If the query already exists in the cache and its data is not stale (per the given
	* `staleTime`), the cached data is returned without fetching. Otherwise, the query is fetched
	* and the promise resolves once the fetch settles. If a `select` function is provided, it is
	* applied to the data in both cases (cached or freshly fetched) before it is returned.
	*
	* Unlike a reactive observer, retries are disabled by default here (`retry: false`) unless
	* explicitly configured, since there is no component to catch a thrown error and retry through
	* re-render.
	*
	* The accepted options are `QueryObserverOptions` minus the fields that only make sense for a
	* reactive observer — `enabled`, `refetchInterval`, `refetchIntervalInBackground`,
	* `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchOnMount`, `retryOnMount`,
	* `notifyOnChangeProps`, `throwOnError`, `suspense`, and `placeholderData` are not part of this
	* method's options.
	*
	* This method replaces the deprecated `fetchQuery`, and — combined with
	* `{ staleTime: 'static' }` — the deprecated `ensureQueryData`.
	*
	* @example
	* ```ts
	* try {
	*   const data = await queryClient.query({ queryKey, queryFn, staleTime: 10000 })
	* } catch (error) {
	*   console.log(error)
	* }
	* ```
	*/
	async query(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
		const query = this.#queryCache.build(this, defaultedOptions);
		const queryData = query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query)) ? await query.fetch(defaultedOptions) : query.state.data;
		const select = defaultedOptions.select;
		if (select) return select(queryData);
		return queryData;
	}
	/**
	* @deprecated Use queryClient.query(options) instead. This method will be removed in the next major version.
	*/
	fetchQuery(options) {
		const defaultedOptions = this.defaultQueryOptions(options);
		if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
		const query = this.#queryCache.build(this, defaultedOptions);
		return query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
	}
	/**
	* @deprecated Use queryClient.query(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
	*/
	prefetchQuery(options) {
		return this.fetchQuery(options).then(noop).catch(noop);
	}
	/**
	* Asynchronous method to fetch and cache an infinite query, resolving with an
	* {@link InfiniteData} object or throwing with the error.
	*
	* Behaves like {@link QueryClient#query}, accepting the same options (minus
	* `initialPageParam`), plus the required `initialPageParam`, and an optional `pages` /
	* `getNextPageParam` pair used to refetch a fixed number of pages from the start.
	*
	* This method replaces the deprecated `fetchInfiniteQuery`, and — combined with
	* `{ staleTime: 'static' }` — the deprecated `ensureInfiniteQueryData`.
	*
	* @example
	* ```ts
	* try {
	*   const data = await queryClient.infiniteQuery({ queryKey, queryFn, initialPageParam: 0 })
	*   console.log(data.pages)
	* } catch (error) {
	*   console.log(error)
	* }
	* ```
	*/
	infiniteQuery(options) {
		options._type = "infinite";
		return this.query(options);
	}
	/**
	* @deprecated Use queryClient.infiniteQuery(options) instead. This method will be removed in the next major version.
	*/
	fetchInfiniteQuery(options) {
		options._type = "infinite";
		return this.fetchQuery(options);
	}
	/**
	* @deprecated Use queryClient.infiniteQuery(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
	*/
	prefetchInfiniteQuery(options) {
		return this.fetchInfiniteQuery(options).then(noop).catch(noop);
	}
	/**
	* @deprecated Use queryClient.infiniteQuery({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
	*/
	ensureInfiniteQueryData(options) {
		options._type = "infinite";
		return this.ensureQueryData(options);
	}
	/**
	* Resumes mutations that were paused because there was no network connection. Does nothing
	* (resolving immediately) if the client is currently offline.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* await queryClient.resumePausedMutations()
	* ```
	*/
	resumePausedMutations() {
		if (onlineManager.isOnline()) return this.#mutationCache.resumePausedMutations();
		return Promise.resolve();
	}
	/**
	* Returns the query cache this client is connected to.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* const queryCache = queryClient.getQueryCache()
	* const queries = queryCache.findAll({ queryKey: ['posts'] })
	* ```
	*/
	getQueryCache() {
		return this.#queryCache;
	}
	/**
	* Returns the mutation cache this client is connected to.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* const mutationCache = queryClient.getMutationCache()
	* const mutations = mutationCache.findAll({ status: 'pending' })
	* ```
	*/
	getMutationCache() {
		return this.#mutationCache;
	}
	/**
	* Returns the default options that were set when creating the client, or via
	* {@link QueryClient#setDefaultOptions}.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* const defaultOptions = queryClient.getDefaultOptions()
	* ```
	*/
	getDefaultOptions() {
		return this.#defaultOptions;
	}
	/**
	* Dynamically sets the default options for this client, overwriting any previously defined
	* default options.
	*
	* @see {@link QueryClient#getDefaultOptions}
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* queryClient.setDefaultOptions({
	*   queries: {
	*     staleTime: Infinity,
	*   },
	* })
	* ```
	*/
	setDefaultOptions(options) {
		this.#defaultOptions = options;
	}
	/**
	* Sets default options for queries whose query key partially matches the given `queryKey`.
	*
	* If several registered query defaults match a given query key, they are merged together in
	* registration order by {@link QueryClient#getQueryDefaults}, so register defaults from the
	* most generic key to the least generic one — more specific defaults should be registered
	* after more generic ones so they take precedence.
	*
	* @example
	* ```ts
	* queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })
	*
	* await queryClient.query({ queryKey: ['posts'] })
	* ```
	*/
	setQueryDefaults(queryKey, options) {
		this.#queryDefaults.set(hashKey(queryKey), {
			queryKey,
			defaultOptions: options
		});
	}
	/**
	* Returns the default options registered for queries whose query key partially matches the
	* given `queryKey`, via {@link QueryClient#setQueryDefaults}. If multiple registered defaults
	* match, they are merged together in registration order.
	*
	* @example
	* ```ts
	* const defaultOptions = queryClient.getQueryDefaults(['posts'])
	* ```
	*/
	getQueryDefaults(queryKey) {
		const defaults = [...this.#queryDefaults.values()];
		const result = {};
		defaults.forEach((queryDefault) => {
			if (partialMatchKey(queryKey, queryDefault.queryKey)) Object.assign(result, queryDefault.defaultOptions);
		});
		return result;
	}
	/**
	* Sets default options for mutations whose mutation key partially matches the given
	* `mutationKey`. As with {@link QueryClient#setQueryDefaults}, the order of registration
	* matters when several registered defaults match the same mutation key.
	*
	* @see {@link QueryClient#getMutationDefaults}
	* @example
	* ```ts
	* queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })
	* ```
	*/
	setMutationDefaults(mutationKey, options) {
		this.#mutationDefaults.set(hashKey(mutationKey), {
			mutationKey,
			defaultOptions: options
		});
	}
	/**
	* Returns the default options registered for mutations whose mutation key partially matches
	* the given `mutationKey`, via {@link QueryClient#setMutationDefaults}. If multiple registered
	* defaults match, they are merged together in registration order.
	*
	* @example
	* ```ts
	* const defaultOptions = queryClient.getMutationDefaults(['addPost'])
	* ```
	*/
	getMutationDefaults(mutationKey) {
		const defaults = [...this.#mutationDefaults.values()];
		const result = {};
		defaults.forEach((queryDefault) => {
			if (partialMatchKey(mutationKey, queryDefault.mutationKey)) Object.assign(result, queryDefault.defaultOptions);
		});
		return result;
	}
	/**
	* Called by framework adapters (e.g. inside `useQuery`) to resolve the options passed by the
	* caller into their final, defaulted form: merging `queryClient.setQueryDefaults` for the
	* given `queryKey`, then the client's own `defaultOptions.queries`, then the caller's options
	* on top. A no-op if the options are already defaulted (`_defaulted: true`).
	*/
	defaultQueryOptions(options) {
		if (options._defaulted) return options;
		const defaultedOptions = {
			...this.#defaultOptions.queries,
			...this.getQueryDefaults(options.queryKey),
			...options,
			_defaulted: true
		};
		if (!defaultedOptions.queryHash) defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
		if (defaultedOptions.refetchOnReconnect === void 0) defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
		if (defaultedOptions.throwOnError === void 0) defaultedOptions.throwOnError = !!defaultedOptions.suspense;
		if (!defaultedOptions.networkMode && defaultedOptions.persister) defaultedOptions.networkMode = "offlineFirst";
		if (defaultedOptions.queryFn === skipToken) defaultedOptions.enabled = false;
		return defaultedOptions;
	}
	/**
	* The mutation counterpart of {@link QueryClient#defaultQueryOptions}. Called by framework
	* adapters (e.g. inside `useMutation`) to merge `queryClient.setMutationDefaults` for the
	* given `mutationKey`, then the client's `defaultOptions.mutations`, then the caller's options
	* on top. A no-op if the options are already defaulted (`_defaulted: true`).
	*/
	defaultMutationOptions(options) {
		if (options?._defaulted) return options;
		return {
			...this.#defaultOptions.mutations,
			...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
			...options,
			_defaulted: true
		};
	}
	/**
	* Clears both the query cache and the mutation cache this client is connected to.
	*
	* @example
	* ```ts
	* import { QueryClient } from '@tanstack/query-core'
	*
	* const queryClient = new QueryClient()
	* queryClient.clear()
	* ```
	*/
	clear() {
		this.#queryCache.clear();
		this.#mutationCache.clear();
	}
};
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-CoRjZm2e.css";
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/lib/lovable-error-reporting.ts
/**
* Client-side error beacon. Replaces the generator's editor-only reporter.
* Keeps the original export name so no call site needs changing.
*
* Fire-and-forget and never throws: an error inside the error reporter
* must not surface to the visitor.
*/
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	const endpoint = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"TSS_DEV_SERVER": "false",
		"TSS_DEV_SSR_STYLES_BASEPATH": "/",
		"TSS_DEV_SSR_STYLES_ENABLED": "true",
		"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
		"TSS_INLINE_CSS_ENABLED": "false",
		"TSS_ROUTER_BASEPATH": "",
		"TSS_SERVER_FN_BASE": "/_serverFn/"
	}["VITE_ERROR_ENDPOINT"];
	if (!endpoint) return;
	const body = JSON.stringify({
		message: error instanceof Error ? error.message : String(error),
		stack: error instanceof Error ? error.stack : void 0,
		host: window.location.host,
		path: window.location.pathname,
		...context
	});
	try {
		if (navigator.sendBeacon) navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
		else fetch(endpoint, {
			method: "POST",
			body,
			keepalive: true
		});
	} catch {}
}
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$2 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Catpotle Mexican Grill" },
			{
				name: "description",
				content: "Build your Purrito at Catpotle Mexican Grill."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.png",
			type: "image/png"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$2.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {})]
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-BcCOfsGd.js");
var Route$1 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Build Your Purrito — Catpotle Mexican Grill" },
		{
			name: "description",
			content: "Build your Purrito at Catpotle: humanely caught, never caged kitten, fresh sides and drinks, ready for pickup."
		},
		{
			property: "og:title",
			content: "Build Your Purrito — Catpotle Mexican Grill"
		},
		{
			property: "og:description",
			content: "Pick your kitten, add a side of mouse, bird or gecko, and finish with pure water or organic milk."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routes/api/generate-purrito.ts
var Route = createFileRoute("/api/generate-purrito")({ server: { handlers: { POST: async ({ request }) => {
	const { prompt, stream = true } = await request.json();
	const key = process.env["OPENAI_API_KEY"];
	if (!key) return new Response("Missing OPENAI_API_KEY", { status: 500 });
	const upstream = await fetch("https://api.openai.com/v1/images/generations", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			model: "gpt-image-1",
			prompt,
			...stream ? {
				stream: true,
				partial_images: 2
			} : {}
		})
	});
	if (!upstream.ok || !upstream.body) return new Response(await upstream.text(), { status: upstream.status });
	if (!stream) return new Response(upstream.body, { headers: { "Content-Type": "application/json" } });
	return new Response(upstream.body, { headers: {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache"
	} });
} } } });
//#endregion
//#region src/routeTree.gen.ts
var rootRouteChildren = {
	IndexRoute: Route$1.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$2
	}),
	ApiGeneratePurritoRoute: Route.update({
		id: "/api/generate-purrito",
		path: "/api/generate-purrito",
		getParentRoute: () => Route$2
	}),
	OrderPickupRoute: Route$3.update({
		id: "/order/$pickup",
		path: "/order/$pickup",
		getParentRoute: () => Route$2
	})
};
var routeTree = Route$2._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
