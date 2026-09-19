# syntax=docker/dockerfile:1

# --- Build stage ----------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# @lovable.dev/vite-tanstack-config defaults nitro to the "cloudflare-module"
# preset. NITRO_PRESET overrides that at build time so the output is a
# plain self-contained Node HTTP server instead of a Cloudflare Worker
# bundle. See node_modules/nitro/dist/docs/2.config/0.index/index.md:
# "An explicit preset, the NITRO_PRESET environment variable, ... all take
# precedence over defaultPreset."
ENV NITRO_PRESET=node-server
RUN npm run build

# Nitro's node-server preset bundles the server (and serveStatic: true
# serves the client assets too), so nothing under node_modules is needed
# at runtime — only .output.
RUN test -f .output/server/index.mjs || (echo "build did not produce .output/server/index.mjs" >&2 && exit 1)

# --- Runtime stage ----------------------------------------------------------
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app/.output ./.output

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
