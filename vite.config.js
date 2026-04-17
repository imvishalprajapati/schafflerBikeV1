import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use './' only for production Electron builds (assets must be relative to index.html).
  // In the dev server, always use '/' — relative base causes React to load from
  // different module URLs, creating duplicate React instances and breaking hooks.
  base: command === 'build' ? './' : '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,  // never inline models/textures
  },
  optimizeDeps: {
    include: ['gsap', 'react-router-dom', '@react-three/fiber', '@react-three/drei', 'three']
  },
  server: {
    port: 5173,
    headers: {
      // Cache GLBs and other static assets for 7 days in dev
      'Cache-Control': 'public, max-age=604800',
    },
  },
}))
