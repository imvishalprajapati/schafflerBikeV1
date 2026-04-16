import { useRef, useEffect } from 'react'
import { useGLTF, ContactShadows } from '@react-three/drei'
import { useShowroomStore } from '../store/useShowroomStore.js'

export default function BikeViewer() {
  const { scene } = useGLTF('/models/Bike_draco.glb', '/draco/')
  const ref = useRef()

  // Track original emissive colors so we can revert when mouse leaves
  useEffect(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Clone the material if it is shared by multiple meshes
        // This ensures highlighting one bolt doesn't highlight ALL bolts globally
        child.material = child.material.clone()
        
        // Save its native emissive state
        child.userData.origEmissive = child.material.emissive.clone()
        child.userData.origEmissiveIntensity = child.material.emissiveIntensity || 0
      }
    })
  }, [scene])

  const handlePointerOver = (e) => {
    e.stopPropagation() // Vital: stops the raycaster from piercing through to back meshes

    const obj = e.object
    if (obj.isMesh && obj.material) {
      console.log(`[Raycaster] Hovered Component Name: "${obj.name}"`)
      
      // Highlight with Schaeffler Green
      obj.material.emissive.set('#00893D')
      obj.material.emissiveIntensity = 0.8
    }
  }

  const handlePointerOut = (e) => {
    const obj = e.object
    if (obj.isMesh && obj.material && obj.userData.origEmissive) {
      // Revert to native state
      obj.material.emissive.copy(obj.userData.origEmissive)
      obj.material.emissiveIntensity = obj.userData.origEmissiveIntensity
    }
  }

  return (
    <>
      <primitive 
        ref={ref} 
        object={scene} 
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />

      {/* High performance contact shadows instead of dynamic directional shadow grids */}
      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.8}
        scale={10}
        blur={2}
        far={2}
        resolution={512}
        color="#000000"
      />

      {/* Subtle floor reflection glow without blocking view */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color="#00893D" transparent opacity={0.03} />
      </mesh>
    </>
  )
}

useGLTF.preload('/models/Bike_draco.glb', '/draco/')


