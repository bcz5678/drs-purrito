import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Vite 8 resolves tsconfig "paths" natively — supplies the "@/..." alias
  // without the vite-tsconfig-paths plugin.
  resolve: { tsconfigPaths: true },

  // Inline every dependency into the SSR bundle. Without this the server
  // build externalizes react and the container dies on boot with
  // "Cannot find package 'react'".
  ssr: { noExternal: true },

  plugins: [
    tailwindcss(),
    tanstackStart({
      // Keep Lovable's SSR error wrapper at src/server.ts.
      server: { entry: "server" },
      // Start's own prerenderer. Nitro is not used at all — output lands
      // in dist/client (static) and dist/server (SSR handler).
      prerender: { enabled: true },
      pages: [{ path: "/", prerender: { enabled: true, crawlLinks: true } }],
    }),
    viteReact(), // must come AFTER tanstackStart
  ],
});
