import React from 'react'
import ReactDOM from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
import { HashRouter } from 'react-router-dom';
import { useGLTF } from '@react-three/drei'
import App from './App.jsx'
import './index.css'

// ── Global Draco decoder path ─────────────────────────────────
// Points to local /public/draco/ files — works fully offline in Electron.
// This must be set before any useGLTF() call is made anywhere in the app.
useGLTF.setDecoderPath('./draco/')

// ── Preload the main bike model as early as possible ──────────
// Runs at module import time — before React mounts — so the browser
// fetches Bike_optimized.glb in parallel with React bootstrapping.
useGLTF.preload('./models/Bike_optimized.glb')

ReactDOM.createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
)
