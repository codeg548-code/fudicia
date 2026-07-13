import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // target: 'http://127.0.0.1:8000',
        target: 'https://fudicia-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
});
