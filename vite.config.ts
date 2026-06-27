import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  nitro: {
    preset: "cloudflare-pages",
  },
  tanstackStart: {
    server: {
      entry: "server",
    },
  },
});