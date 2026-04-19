/**
 * Centralized GLTFLoader + DRACOLoader setup.
 *
 * Draco decoder files are served from /draco/ (local — works fully offline in Electron).
 * Import `gltfLoader` anywhere you need raw Three.js GLB loading outside of React Three Fiber.
 * For R3F components, useGLTF from @react-three/drei is preferred — its global decoder path
 * is set in main.jsx so all calls automatically use the local /draco/ decoder.
 */

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// ── DRACOLoader ───────────────────────────────────────────────
// Points to the local decoder files in /public/draco/
// Works without internet — critical for the Electron desktop build.
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('./draco/')
dracoLoader.preload() // Pre-warms the WASM decoder in the background

// ── GLTFLoader ────────────────────────────────────────────────
// A single shared loader instance — avoids creating multiple loaders per component.
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

export { gltfLoader, dracoLoader }
