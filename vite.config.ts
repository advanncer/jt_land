import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        comboLeadMagnit: resolve(__dirname, "free-products/combo-lead-magnit/index.html"),
      },
    },
  },
});
