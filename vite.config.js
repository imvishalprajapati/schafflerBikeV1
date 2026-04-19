import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // Use './' only for production Electron builds (assets must be relative to index.html).
  // In the dev server, always use '/' — relative base causes React to load from
  // different module URLs, creating duplicate React instances and breaking hooks.
  base: command === 'build' ? './' : '/',
  resolve: {
    dedupe: ['react', 'react-dom', 'three', 'gsap'],
    alias: {
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'three': path.resolve(__dirname, 'node_modules/three'),
      'gsap': path.resolve(__dirname, 'node_modules/gsap'),
      '@gsap/react': path.resolve(__dirname, 'node_modules/@gsap/react'),
    },
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,  // never inline models/textures
  },
  optimizeDeps: {
    include: ['react-router-dom', '@react-three/fiber', '@react-three/drei'],
    exclude: ['three', 'gsap'] // Force these to resolve via alias/dedupe only
  },
  server: {
    port: 5173,
    strictPort: true, // Prevents port mismatch by failing if 5173 is taken
    headers: {
      // Cache GLBs and other static assets for 7 days in dev
      'Cache-Control': 'public, max-age=604800',
    },
  },
}))
