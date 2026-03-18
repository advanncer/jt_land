import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        engAdult: resolve(__dirname, "eng-adult/index.html"),
        comboLeadMagnit: resolve(__dirname, "free-products/combo-lead-magnit/index.html"),
      },
    },
  },
});
