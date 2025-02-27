import { defineConfig } from "vite";
import f7c from "f7r/plugin/vite";

export default defineConfig((_env) => {
  return {
    server: {
      port: 28900,
    },
    preview: {
      port: 28900,
      host: "0.0.0.0",
    },
    build: {
      target: "chrome92",
      cssTarget: "chrome92",
      cssCodeSplit: true,
      cssMinify: false,
      rollupOptions: {
        input: "./index.html",
      },
    },
    plugins: [f7c()],
  };
});
