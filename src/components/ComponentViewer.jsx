import { useState, useEffect, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Stage, Bounds, PerformanceMonitor, Center } from '@react-three/drei'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import gsap from 'gsap'

function ComponentModel({ modelPath, scrollProgress = 0 }) {
  const { scene } = useGLTF(modelPath, '/draco/')
  const sceneRef = useRef()
  const localExplode = useRef(0)

  // Pre-calculate realistic explode directions
  useEffect(() => {
    if (!scene) return

    // Calculate bounding box of the entire component scene
    const bbox = new THREE.Box3().setFromObject(scene)
    const center = new THREE.Vector3()
    bbox.getCenter(center)

    // Store original positions and compute directions for each mesh
    scene.traverse(child => {
      if (child.isMesh) {
        // Only save origPos once
        if (child.userData.origX === undefined) {
          child.userData.origPos = child.position.clone()
          child.userData.origX = child.position.x // Keep for compatibility if needed
        }

        const mbox = new THREE.Box3().setFromObject(child)
        const mCenter = new THREE.Vector3()
        mbox.getCenter(mCenter)

        const dir = mCenter.clone().sub(center)
        const len = dir.length()
        child.userData.explodeDir = len > 0.001 ? dir.normalize() : new THREE.Vector3(0, 1, 0)
      }
    })
  }, [scene])

  // Sync scrollProgress to 3D positions in the mesh render loop
  useFrame(() => {
    if (!scene) return
    
    // Smoothly lerp towards the target scroll progress
    localExplode.current += (scrollProgress - localExplode.current) * 0.1
    const t = localExplode.current
    
    // How far parts travel (increased for visibility)
    const EXPLODE_SCALE = 2.0

    scene.traverse(child => {
      if (child.isMesh && child.userData.origPos && child.userData.explodeDir) {
        const { origPos, explodeDir } = child.userData
        
        child.position.set(
          origPos.x + explodeDir.x * t * EXPLODE_SCALE,
          origPos.y + explodeDir.y * t * EXPLODE_SCALE,
          origPos.z + explodeDir.z * t * EXPLODE_SCALE
        )
      }
    })
  })

  return <primitive ref={sceneRef} object={scene} scale={1.2} position={[0, 0, 0]} />
}

function FallbackBox({ color = '#00893D' }) {
  return (
    <mesh castShadow>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshStandardMaterial
        color={color}
        metalness={0.8}
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.1}
      />
    </mesh>
  )
}

export default function ComponentViewer({ componentId, modelFile, color = '#00893D', scrollProgress = 0 }) {
  const [modelError, setModelError] = useState(false)
  const [dpr, setDpr] = useState(1.5)
  const modelPath = `/models/${modelFile}`

  return (
    <Canvas
      camera={{ position: [0, 0, 3], fov: 40 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows
      dpr={dpr}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Suspense fallback={null}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-3, 3, -3]} intensity={0.5} color={color} />
        <pointLight position={[0, 4, 2]} intensity={0.8} color={color} />

        {/* Model or fallback with Bounds to ensure fit */}
        <Bounds fit clip observe margin={1.2}>
          {!modelError ? (
            <ErrorBoundary fallback={<Center><FallbackBox color={color} /></Center>} onError={() => setModelError(true)}>
              <Suspense fallback={<Center><FallbackBox color={color} /></Center>}>
                <Center>
                  <ComponentModel modelPath={modelPath} scrollProgress={scrollProgress} />
                </Center>
              </Suspense>
            </ErrorBoundary>
          ) : (
            <Center><FallbackBox color={color} /></Center>
          )}
        </Bounds>

        {/* Environment */}
        <Environment preset="warehouse" />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={6}
          autoRotate={scrollProgress < 0.05} // Pause rotation when scrolling
          autoRotateSpeed={0.8}
          makeDefault
        />
      </Suspense>
    </Canvas>
  )
}

// Fallback removed, handled gracefully by ErrorBoundary
