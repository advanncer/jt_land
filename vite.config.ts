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
        engAdultLpPains: resolve(__dirname, "eng-adult/lp_pains/index.html"),
        comboLeadMagnit: resolve(__dirname, "free-products/combo-lead-magnit/index.html"),
        astroEnglish: resolve(__dirname, "free-products/astro-english/index.html"),
        bloggerLp1: resolve(__dirname, "blogger/lp1/index.html"),
        engAdultLpGoogle: resolve(__dirname, "eng-adult/lp_google/index.html"),
      },
    },
  },
});
// Trigger deploy
// Force redeploy Wed Apr 15 21:50:33 +04 2026
