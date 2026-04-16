import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { useGLTF } from '@react-three/drei'
import App from './App.jsx'
import './index.css'

// ── Global Draco decoder path ─────────────────────────────────
// Points to local /public/draco/ files — works fully offline in Electron.
// This must be set before any useGLTF() call is made anywhere in the app.
useGLTF.setDecoderPath('/draco/')

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
