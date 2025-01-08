import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // Toutes les requêtes commençant par /api seront proxyfiées
        target: "https://api.warframe.market", // L'URL de votre API
        changeOrigin: true, // Change l'origine pour éviter les problèmes CORS
        rewrite: (path) => path.replace(/^\/api/, ""), // Enlève le préfixe /api dans l'URL
      },
    },
  },
});
