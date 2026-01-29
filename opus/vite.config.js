import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/kopis": {
        target: "https://kopis.or.kr",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/kopis/, ""),
      },
    },
  },
});
