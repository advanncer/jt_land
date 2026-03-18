import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        engAdultLp1: resolve(__dirname, "eng-adult/lp1/index.html"),
        engAdultLp1Tg: resolve(__dirname, "eng-adult/lp1-tg/index.html"),
        comboLeadMagnit: resolve(__dirname, "free-products/combo-lead-magnit/index.html"),
      },
    },
  },
});
