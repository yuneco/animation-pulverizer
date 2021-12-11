import { defineConfig } from "vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    outDir: 'docs'
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
