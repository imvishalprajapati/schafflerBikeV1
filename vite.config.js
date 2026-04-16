import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',   // critical for Electron — assets load relative to index.html
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,  // never inline models/textures
  },
  server: {
    port: 5173,
    headers: {
      // Cache GLBs and other static assets for 7 days in dev
      // After the first download, subsequent visits are instant from browser disk cache
      'Cache-Control': 'public, max-age=604800',
    },
  },
})
