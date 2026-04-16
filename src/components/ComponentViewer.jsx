import { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Stage, Bounds, PerformanceMonitor } from '@react-three/drei'
import { ErrorBoundary } from './ErrorBoundary.jsx'
import LoadingScreen from './LoadingScreen.jsx'
import gsap from 'gsap'

function ComponentModel({ modelPath, scrollProgress = 0 }) {
  const { scene } = useGLTF(modelPath, '/draco/')
  const sceneRef = useRef()

  // Generic explode logic: simply scale out or translate child meshes based on scroll
  useEffect(() => {
    if (!sceneRef.current) return
    
    // When real GLBs arrive, this will animate individual named parts from components.json
    // For now, we apply a simple generic expansion of all direct children
    sceneRef.current.children.forEach((child, i) => {
      if (child.isMesh || child.isGroup) {
        // compute a pseudo-random direction based on index
        const dirX = Math.sin(i * 1.5) * 0.5
        const dirY = Math.cos(i * 1.5) * 0.5
        const dirZ = Math.sin(i * 0.8) * 0.5
        
        gsap.to(child.position, {
          x: child.userData.origX !== undefined ? child.userData.origX + dirX * scrollProgress * 2 : dirX * scrollProgress * 2,
          y: child.userData.origY !== undefined ? child.userData.origY + dirY * scrollProgress * 2 : dirY * scrollProgress * 2,
          z: child.userData.origZ !== undefined ? child.userData.origZ + dirZ * scrollProgress * 2 : dirZ * scrollProgress * 2,
          ease: 'power1.out',
          duration: 0.3
        })
      }
    })
  }, [scrollProgress])

  // Store original positions once
  useEffect(() => {
    if (!scene) return
    scene.children.forEach(child => {
      child.userData.origX = child.position.x
      child.userData.origY = child.position.y
      child.userData.origZ = child.position.z
    })
  }, [scene])

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
        <Bounds fit clip observe margin={1.5}>
          {!modelError ? (
            <ErrorBoundary fallback={<FallbackBox color={color} />} onError={() => setModelError(true)}>
              <Suspense fallback={<FallbackBox color={color} />}>
                <ComponentModel modelPath={modelPath} scrollProgress={scrollProgress} />
              </Suspense>
            </ErrorBoundary>
          ) : (
            <FallbackBox color={color} />
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
