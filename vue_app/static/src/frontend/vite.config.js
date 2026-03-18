import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.js"),
      name: "VueApp",
      fileName: "vue_app_bundle",
      formats: ["iife"],
    },
    outDir: "../js/dist",
    emptyOutDir: true,
    rollupOptions: {
      // Keep Vue external to load from Odoo assets instead of bundling
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  define: {
    "process.env": {},
  },
});
