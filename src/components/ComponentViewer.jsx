import { useState, useMemo, useRef, Suspense } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, useGLTF, Bounds, PerformanceMonitor, Center } from '@react-three/drei'
import { ErrorBoundary } from './ErrorBoundary.jsx'

// ── Zoom thresholds ──────────────────────────────────────────────────────────
const EXPLODE_START = 5.0   // camera inside this distance → explosion begins
const EXPLODE_FULL = 1.2   // camera at this distance    → fully exploded
const MIN_DIST_ZOOM = 0.8   // must be ≤ EXPLODE_FULL so user can reach full explosion

// ── Helpers ──────────────────────────────────────────────────────────────────
function variance(values) {
  if (!values.length) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0)
}

/**
 * Build per-mesh explosion directions that produce a SYMMETRIC exploded view:
 *
 *  • Finds the primary symmetry axis (shaft axis) = axis with the LEAST spread
 *    of mesh centroids (for a bearing, rollers orbit this axis, so their
 *    centroid spread is maximum on the other two axes).
 *
 *  • Classifies every mesh as either:
 *    – "concentric"  : centroid lives on / near the symmetry axis (rings, cage shell)
 *    – "radial"      : centroid is offset from the axis (individual rollers / balls)
 *
 *  • Concentric meshes → sorted by bounding-box radius (outermost first).
 *    Outer ring gets  +primaryAxis, inner ring gets  −primaryAxis.
 *    Middle parts scale linearly between those extremes.
 *
 *  • Radial meshes → push straight outward from the symmetry axis.
 *    Because rollers are evenly distributed, this is inherently symmetric.
 *
 *  Returns collected[] with { mesh, origLocalPos, explodeDir, modelRadius }.
 */
function buildExplodeData(scene) {
  scene.updateWorldMatrix(true, true)

  const bbox = new THREE.Box3().setFromObject(scene)
  const sceneCenter = new THREE.Vector3()
  bbox.getCenter(sceneCenter)

  const sizeVec = new THREE.Vector3()
  bbox.getSize(sizeVec)
  const modelRadius = Math.max(sizeVec.x, sizeVec.y, sizeVec.z) * 0.5 || 1

  // ── 1. Collect raw mesh data ──────────────────────────────────────────────
  const collected = []
  scene.traverse(child => {
    if (!child.isMesh) return

    const mbox = new THREE.Box3().setFromObject(child)
    const mCenter = new THREE.Vector3(); mbox.getCenter(mCenter)
    const mSizeVec = new THREE.Vector3(); mbox.getSize(mSizeVec)
    const boundingRadius = Math.max(mSizeVec.x, mSizeVec.y, mSizeVec.z) * 0.5

    collected.push({
      mesh: child,
      origLocalPos: child.position.clone(),
      worldCentroid: mCenter,
      boundingRadius,
      modelRadius,
      explodeDir: new THREE.Vector3(0, 1, 0), // overwritten below
    })
  })

  if (collected.length === 0) return collected

  // ── 2. Find primary symmetry axis ─────────────────────────────────────────
  // Use the bounding-box THINNEST dimension as the bore/shaft axis.
  // This is robust even when all mesh nodes share the same translation
  // (geometry baked into vertex data), which makes centroid-variance → 0 on
  // all three axes and causes arbitrary axis selection.
  // For any cylindrical bearing/clutch the bore axis is always the thinnest
  // dimension of the overall bounding box.
  const worldAxes = [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, 0, 1),
  ]
  const sizeArr = [sizeVec.x, sizeVec.y, sizeVec.z]

  // Fallback to centroid-spread variance when the bounding box is nearly
  // square (non-bearing shapes), so general models still work correctly.
  const minSize = Math.min(...sizeArr)
  const maxSize = Math.max(...sizeArr)
  const isElongatedOrFlat = (maxSize / (minSize + 0.0001)) > 1.4

  let primaryAxis
  if (isElongatedOrFlat) {
    // Thinnest dimension = bore axis (reliable for bearings / clutches)
    primaryAxis = worldAxes[sizeArr.indexOf(minSize)]
  } else {
    // Nearly-cubic shape → fall back to centroid spread
    const spreads = worldAxes.map(ax =>
      variance(collected.map(d => d.worldCentroid.dot(ax)))
    )
    primaryAxis = worldAxes[spreads.indexOf(Math.min(...spreads))]
  }

  // ── 3. Classify meshes ────────────────────────────────────────────────────
  // Threshold: 15% of model radius. Parts closer to the axis are "concentric".
  const radialThreshold = modelRadius * 0.15

  const concentric = []
  const radial = []

  for (const d of collected) {
    // Vector from scene centre to this mesh's centroid
    const fromCenter = d.worldCentroid.clone().sub(sceneCenter)

    // Decompose into axial + radial components
    const axialScalar = fromCenter.dot(primaryAxis)
    const axialVec = primaryAxis.clone().multiplyScalar(axialScalar)
    const radialVec = fromCenter.clone().sub(axialVec)   // ⊥ to primary axis

    d._radialVec = radialVec   // saved for direction assignment

    if (radialVec.length() > radialThreshold) {
      radial.push(d)
    } else {
      concentric.push(d)
    }
  }

  // ── 4a. Radial meshes → push further away from the axis ──────────────────
  for (const d of radial) {
    const len = d._radialVec.length()
    d.explodeDir = len > 0.001
      ? d._radialVec.clone().normalize()
      : new THREE.Vector3(Math.random() - 0.5, 0, Math.random() - 0.5).normalize()
  }

  // ── 4b. Concentric meshes → spread along primary axis ────────────────────
  // Sort outermost → innermost by bounding radius.
  concentric.sort((a, b) => b.boundingRadius - a.boundingRadius)
  const nc = concentric.length

  concentric.forEach((d, i) => {
    if (nc === 1) {
      // Single concentric mesh: just push it along the axis
      d.explodeDir = primaryAxis.clone()
      return
    }
    // Map i: 0 (outermost) → factor +1, nc-1 (innermost) → factor -1
    // Middle parts get smaller factors and barely move → they look like the "pivot"
    const factor = 1 - (2 * i) / (nc - 1)  // linearly: +1 … 0 … -1
    // Store as a scaled vector so the movement code works uniformly
    d.explodeDir = primaryAxis.clone().multiplyScalar(factor)
  })

  return collected
}

// ── ComponentModel ────────────────────────────────────────────────────────────
function ComponentModel({ modelPath, scrollProgress = 0, explodeTrigger = 'scroll' }) {
  // Clone the raw cached scene so shared state across renders is avoided.
  const { scene: rawScene } = useGLTF(modelPath, '/draco/')
  const scene = useMemo(() => rawScene.clone(true), [rawScene])

  const meshDataRef = useRef([])
  const explodeT = useRef(0)
  const initialized = useRef(false)
  const { controls } = useThree()

  useFrame(state => {
    // ── First frame: build explosion data ───────────────────────────────────
    // Deferred to first frame so <Center> / <Bounds> have set world matrices.
    if (!initialized.current && scene) {
      meshDataRef.current = buildExplodeData(scene)
      initialized.current = true
      return
    }

    const items = meshDataRef.current
    if (!items.length) return

    // ── Target explosion value [0, 1] ────────────────────────────────────────
    let target = 0

    if (explodeTrigger === 'zoom') {
      const orbitTarget = controls?.target ?? new THREE.Vector3()
      const dist = state.camera.position.distanceTo(orbitTarget)
      if (dist < EXPLODE_START) {
        target = (EXPLODE_START - dist) / (EXPLODE_START - EXPLODE_FULL)
        target = Math.max(0, Math.min(1, target))
      }
    } else {
      target = scrollProgress
    }

    // Smooth lerp
    explodeT.current += (target - explodeT.current) * 0.06
    const t = explodeT.current

    // Explosion scale is proportional to model size so every GLB looks right.
    const modelRadius = items[0]?.modelRadius ?? 1
    const explodeScale = modelRadius * 2.2

    // ── Move each mesh ───────────────────────────────────────────────────────
    const tempW = new THREE.Vector3()
    const tempL = new THREE.Vector3()

    for (const { mesh, origLocalPos, explodeDir } of items) {
      if (!mesh.parent) {
        mesh.position.set(
          origLocalPos.x + explodeDir.x * t * explodeScale,
          origLocalPos.y + explodeDir.y * t * explodeScale,
          origLocalPos.z + explodeDir.z * t * explodeScale,
        )
        continue
      }

      // Convert original local → world, add world-space offset, convert back
      tempW.copy(origLocalPos)
      mesh.parent.localToWorld(tempW)
      tempW.addScaledVector(explodeDir, t * explodeScale)
      mesh.parent.worldToLocal(tempL.copy(tempW))
      mesh.position.copy(tempL)
    }
  })

  return <primitive object={scene} scale={1.2} />
}

// ── Fallback ──────────────────────────────────────────────────────────────────
function FallbackBox({ color = '#00893D' }) {
  return (
    <mesh>
      <torusKnotGeometry args={[0.6, 0.2, 128, 32]} />
      <meshStandardMaterial
        color={color} metalness={0.8} roughness={0.1}
        emissive={color} emissiveIntensity={0.1}
      />
    </mesh>
  )
}

// ── ComponentViewer ───────────────────────────────────────────────────────────
export default function ComponentViewer({
  componentId,
  modelFile,
  color = '#00893D',
  scrollProgress = 0,
  explodeTrigger = 'scroll',
}) {
  const [modelError, setModelError] = useState(false)
  const [dpr, setDpr] = useState(1.5)
  const modelPath = `/models/${modelFile}`
  const isZoomTrigger = explodeTrigger === 'zoom'

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      shadows
      dpr={dpr}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <PerformanceMonitor onDecline={() => setDpr(1)} />
      <Suspense fallback={null}>
        {/* Lighting — neutral studio setup */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-3, 3, -3]} intensity={0.5} color="#ffffff" />
        <pointLight position={[0, 4, 2]} intensity={0.8} color="#ffffff" />

        {/*
          observe=false for zoom-trigger: prevents Bounds from re-fitting the
          camera as parts explode outward (it would fight the zoom).
        */}
        <Bounds fit clip observe={!isZoomTrigger} margin={1.2}>
          {!modelError ? (
            <ErrorBoundary
              fallback={<Center><FallbackBox color={color} /></Center>}
              onError={() => setModelError(true)}
            >
              <Suspense fallback={<Center><FallbackBox color={color} /></Center>}>
                <Center>
                  <ComponentModel
                    modelPath={modelPath}
                    scrollProgress={scrollProgress}
                    explodeTrigger={explodeTrigger}
                  />
                </Center>
              </Suspense>
            </ErrorBoundary>
          ) : (
            <Center><FallbackBox color={color} /></Center>
          )}
        </Bounds>

        <Environment preset="warehouse" />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={isZoomTrigger ? MIN_DIST_ZOOM : 1.8}
          maxDistance={9}
          autoRotate={!isZoomTrigger && scrollProgress < 0.05}
          autoRotateSpeed={0.8}
          makeDefault
        />
      </Suspense>
    </Canvas>
  )
}
