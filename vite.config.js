import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // Proxy pour les requêtes commençant par /api
        target: 'https://api.warframe.market', // URL de base de l'API
        changeOrigin: true, // Change l'origine de la requête pour éviter les problèmes CORS
        rewrite: (path) => path.replace(/^\/api/, ''), // Supprime "/api" du chemin
      },
    },
  },
});
