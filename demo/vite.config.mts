import { defineConfig } from "vite";
import { materialSymbolGeneratorPlugin } from "../src/vite-plugin/mod.ts";

export default defineConfig((_env) => {
  return {
    server: {
      port: 28900,
    },
    build: {
      rollupOptions: {
        input: "./index.html",
      },
    },
    plugins: [materialSymbolGeneratorPlugin()],
  };
});
