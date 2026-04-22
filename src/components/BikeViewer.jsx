import { useRef, useEffect } from 'react'
import { useGLTF, ContactShadows } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useNavigate } from 'react-router-dom'
import * as THREE from 'three'
import { useShowroomStore } from '../store/useShowroomStore.js'
import components from '../data/components.js'
import { isMeshMatch } from '../utils/meshMapping.js'

// ── Anchor table (group-local space, same as Hotspot positions) ───────────
const ANCHOR_ENTRIES = components
  .filter(c => c.anchor)
  .map(c => ({ id: c.id, label: c.label, vec: new THREE.Vector3(...c.anchor) }))

// Max distance (group-local) a mesh can be from an anchor to be assigned.
// Set large so every mesh always gets the nearest component (Voronoi partition).
const COMPONENT_RADIUS = 100

// How far parts travel at full explosion
const EXPLODE_SCALE = 2.0

// ── DEV: Anchor calibration mode ─────────────────────────────────────────
// Ctrl+Click any mesh → logs its group-local X,Y,Z to console.
// Copy those values into components.js anchor:[] to recalibrate.
const DEV_PICK_MODE = import.meta.env.DEV

// ── BikeViewer ───────────────────────────────────────────────────────────
export default function BikeViewer({ groupRef }) {
  const { scene } = useGLTF('/models/Grops_Bikes1.glb')
  const { invalidate } = useThree()
  const navigate = useNavigate()

  const setHoveredMeshId = useShowroomStore(s => s.setHoveredMeshId)

  // Smooth explode lerp (read/write via ref to avoid React re-renders)
  const localExplode = useRef(0)

  // componentId → Mesh[] — built once at load time
  const compGroupsRef = useRef({})
  // Set of currently highlighted meshes (for O(1) batch clear)
  const highlightedRef = useRef(new Set())
  // Currently active component zone (from 3D hover)
  const activeCompRef = useRef(null)
  // Last Object3D whose onPointerOver fired
  const lastEnteredMeshRef = useRef(null)

  // Subscribe to Side Panel hover so 3D highlights
  const hoveredUiMeshId = useShowroomStore(s => s.hoveredMeshId)

  // ── 1. Scene setup: compute explode dirs + build component groups ────────
  useEffect(() => {
    if (!scene || !groupRef?.current) return

    // Bike bounding-box center in scene-local space (for explode directions)
    const bbox = new THREE.Box3().setFromObject(scene)
    const bikeCenter = new THREE.Vector3()
    bbox.getCenter(bikeCenter)

    scene.traverse(child => {
      if (!child.isMesh) return;

      // Temporary log to see exactly how Three.js formats the Fuel Injector string
      // if (child.name.includes("049")) {
      //   console.log("TRUE THREE.JS NAME FOR 049 IS:", child.name);
      // }
      // ...
    })

    // ── DEV: Print the bike's bounding box IN GROUP-LOCAL space ───────────
    // Since the group has only uniform scale + translation (no rotation),
    // we can worldToLocal the two AABB corners to get the anchor coordinate range.
    if (import.meta.env.DEV && groupRef.current) {
      const minW = bbox.min.clone()
      const maxW = bbox.max.clone()
      // Transform scene-local → world (scene has no transform as <primitive>)
      // scene-local = world here because scene sits at the group's child level
      // and <primitive object={scene}> has no position offset by default.
      // So we just need groupRef.worldToLocal:
      const minL = groupRef.current.worldToLocal(minW)
      const maxL = groupRef.current.worldToLocal(maxW)
      // Note: worldToLocal inverts scale so min/max may swap axes — take true min/max
      const trueMin = new THREE.Vector3(Math.min(minL.x, maxL.x), Math.min(minL.y, maxL.y), Math.min(minL.z, maxL.z))
      const trueMax = new THREE.Vector3(Math.max(minL.x, maxL.x), Math.max(minL.y, maxL.y), Math.max(minL.z, maxL.z))
      const trueCenter = trueMin.clone().add(trueMax).multiplyScalar(0.5)
      const trueSize = trueMax.clone().sub(trueMin)
      // console.log('%c[BikeViewer] GROUP-LOCAL bounding box (= anchor coordinate space):',
      //   'color:#ff8c00;font-weight:bold')
      // console.log(`  min:    [${trueMin.x.toFixed(3)}, ${trueMin.y.toFixed(3)}, ${trueMin.z.toFixed(3)}]`)
      // console.log(`  max:    [${trueMax.x.toFixed(3)}, ${trueMax.y.toFixed(3)}, ${trueMax.z.toFixed(3)}]`)
      // console.log(`  center: [${trueCenter.x.toFixed(3)}, ${trueCenter.y.toFixed(3)}, ${trueCenter.z.toFixed(3)}]`)
      // console.log(`  size:   ${trueSize.x.toFixed(3)} × ${trueSize.y.toFixed(3)} × ${trueSize.z.toFixed(3)}`)
      // console.log('  Anchors should use values within this range!')
    }

    // Pre-init groups
    const groups = {}
    ANCHOR_ENTRIES.forEach(({ id }) => { groups[id] = [] })

    let totalMeshes = 0
    let assignedMeshes = 0

    scene.traverse(child => {
      if (!child.isMesh) return
      totalMeshes++

      // ─ Explode setup ───────────────────────────────────────────────
      child.userData.origPos = child.position.clone()

      const mbox = new THREE.Box3().setFromObject(child)
      const mCenter = new THREE.Vector3()
      mbox.getCenter(mCenter)

      const dir = mCenter.clone().sub(bikeCenter)
      const len = dir.length()
      child.userData.explodeDir = len > 0.001 ? dir.normalize() : new THREE.Vector3(0, 1, 0)
      // ─ Component-group assignment ──────────────────────────────────
      // Clear any prior assignments
      child.userData.componentId = null
    })

    // Pre-map the components that have explicitly assigned targetMeshes
    assignedMeshes = 0

    // DEV: Automatically calculate exact anchor positions and print them to console
    if (import.meta.env.DEV) {
      // console.groupCollapsed('%c[BikeViewer] AUTO-CALCULATED ANCHORS', 'color:#00ff00;font-weight:bold');
      // console.log('Copy these exact values into components.js replacing the [0,0,0] anchors:');
    }

    const setDynamicAnchors = useShowroomStore.getState().setDynamicAnchors
    const calculatedAnchors = {}
    const unmappedIds = []

    const filteredComponents = components.filter(c => c.category !== 'Electrification')

    filteredComponents.forEach(comp => {
      let compBBox = new THREE.Box3();
      let hasMeshes = false;

      scene.traverse(child => {
        if (!child.isMesh) return

        let isMatch = isMeshMatch(child.name, comp.targetMeshes, comp.id);

        // Check if any parent group matches the component name
        if (!isMatch) {
          let parent = child.parent;
          while (parent && (parent.isGroup || parent.isObject3D)) {
            if (isMeshMatch(parent.name, comp.targetMeshes, comp.id)) {
              isMatch = true;
              break;
            }
            parent = parent.parent;
          }
        }

        if (isMatch) {
          child.userData.componentId = comp.id
          assignedMeshes++

          let mbox = new THREE.Box3().setFromObject(child);
          compBBox.expandByPoint(mbox.min);
          compBBox.expandByPoint(mbox.max);
          hasMeshes = true;
        }
      })

      // Store calculated anchor
      if (hasMeshes && groupRef.current) {
        let centerWorld = new THREE.Vector3();
        compBBox.getCenter(centerWorld);
        let centerLocal = groupRef.current.worldToLocal(centerWorld);
        calculatedAnchors[comp.id] = [centerLocal.x, centerLocal.y, centerLocal.z];
      } else {
        unmappedIds.push(comp.id)
      }
    })

    // Push all calculated anchors to store at once
    setDynamicAnchors(calculatedAnchors)

    if (import.meta.env.DEV) {
      // console.groupCollapsed('%c[BikeViewer] MAPPING REPORT', 'color:#00893D;font-weight:bold');
      // console.log(`Total Meshes: ${totalMeshes}`);
      // console.log(`Successfully mapped: ${components.length - unmappedIds.length} components`);
      // if (unmappedIds.length > 0) {
      //   console.warn(`Failed to map ${unmappedIds.length} components:`, unmappedIds);
      //   console.log('Suggestions: Update components.js targetMeshes with substrings of actual mesh names.');
      // }
      // console.groupEnd();
    }
  }, [scene, groupRef])

  // ── 2. Per-frame explode animation ──────────────────────────────────────
  useFrame(() => {
    /* EXPLODE FEATURE COMMENTED OUT FOR NOW
    const target = useShowroomStore.getState().explodeProgress
    const prev = localExplode.current

    if (Math.abs(prev - target) > 0.001) {
      localExplode.current += (target - prev) * 0.09
      const t = localExplode.current

      scene?.traverse(child => {
        if (!child.isMesh || !child.userData.origPos) return
        const { origPos, explodeDir, explodeMag = 1 } = child.userData
        child.position.set(
          origPos.x + explodeDir.x * explodeMag * EXPLODE_SCALE * t,
          origPos.y + explodeDir.y * explodeMag * EXPLODE_SCALE * t,
          origPos.z + explodeDir.z * explodeMag * EXPLODE_SCALE * t,
        )
      })

      invalidate()
    }
    */
  })

  // ── 3. Highlight helpers ─────────────────────────────────────────────────
  // Lazy material clone: only clone when a mesh is first highlighted
  function ensureOwnMaterial(mesh) {
    if (mesh.userData.isMaterialCloned) return
    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(m => m.clone())
    } else {
      mesh.material = mesh.material.clone()
    }
    mesh.userData.isMaterialCloned = true
  }

  function applyEmissive(mesh, hexColor, intensity) {
    if (!mesh) return
    ensureOwnMaterial(mesh)

    const set = mat => {
      // Not all materials (e.g. MeshBasicMaterial) have an emissive property
      if (mat.emissive) {
        mat.emissive.set(hexColor);
        mat.emissiveIntensity = intensity;
      }
      // Backup for materials that ignore emissive: artificially store and change their base color
      if (mat.color && !mat.userData.origColorSaved) {
        mat.userData.origColor = mat.color.getHex()
        mat.userData.origColorSaved = true
      }
      if (mat.color) {
        mat.color.set(hexColor)
      }
    }

    if (Array.isArray(mesh.material)) mesh.material.forEach(set)
    else set(mesh.material)
    highlightedRef.current.add(mesh)
  }

  function clearAllHighlights() {
    for (const mesh of highlightedRef.current) {
      const clear = mat => {
        if (mat.emissive) {
          mat.emissive.set(0, 0, 0);
          mat.emissiveIntensity = 0;
        }
        if (mat.color && mat.userData.origColorSaved) {
          mat.color.setHex(mat.userData.origColor)
        }
      }
      if (Array.isArray(mesh.material)) mesh.material.forEach(clear)
      else clear(mesh.material)
    }
    highlightedRef.current.clear()
  }

  // Pull selected state to keep it highlighted
  const selectedComponentId = useShowroomStore(s => s.selectedComponent)

  // Monitor side panel hover state (hoveredUiMeshId) and highlight all meshes belonging to that component
  useEffect(() => {
    // If no hover, but we have a selection, keep selection highlighted
    clearAllHighlights()
    const targetCompId = hoveredUiMeshId || selectedComponentId

    if (targetCompId && scene) {
      scene.traverse(child => {
        if (child.isMesh && child.userData.componentId === targetCompId) {
          applyEmissive(child, '#00893D', 1.1)
        }
      })
      invalidate()
    } else {
      invalidate()
    }
  }, [hoveredUiMeshId, selectedComponentId, scene, invalidate])


  // ── 4. Pointer handlers ──────────────────────────────────────────────────
  const handlePointerOver = (e) => {
    e.stopPropagation()
    const obj = e.object
    if (!obj.isMesh) return

    lastEnteredMeshRef.current = obj

    // We update the transient hover state. The useEffect above will handle highlighting!
    const compId = obj.userData.componentId

    if (compId !== activeCompRef.current) {
      activeCompRef.current = compId || null
      setHoveredMeshId(compId || null)
    }

    if (import.meta.env.DEV && compId) {
      const entry = ANCHOR_ENTRIES.find(a => a.id === compId)
      // console.log(`[Hover] mesh: "${obj.name}" → comp: "${entry?.label ?? compId}"`)
    }
  }

  const handlePointerOut = (e) => {
    // Only clear when the pointer leaves the scene entirely.
    if (lastEnteredMeshRef.current !== e.object) return

    if (activeCompRef.current !== null) {
      activeCompRef.current = null
      setHoveredMeshId(null)
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()
    const obj = e.object

    // ── DEV: Ctrl+Click = log this mesh's exact name ────────
    if (DEV_PICK_MODE && e.nativeEvent?.ctrlKey) {
      // console.log(`%c[PICK] Exact mesh name: "${obj.name}"`, 'color:#00893D;font-weight:bold;font-size:16px')
      // console.log(`  To map this, add to components.js:`)
      // console.log(`  targetMeshes: ["${obj.name}"],`)
      return
    }

    // Normal click → Select component (don't navigate yet)
    const compId = obj?.userData?.componentId
    if (compId) useShowroomStore.getState().setSelectedComponent(compId)
  }

  // ── 5. JSX ───────────────────────────────────────────────────────────────
  return (
    <>
      <primitive
        object={scene}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.7}
        scale={10}
        blur={2.5}
        far={2}
        resolution={512}
        color="#000000"
      />

      {/* Floor glow ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <circleGeometry args={[2.5, 64]} />
        <meshBasicMaterial color="#00893D" transparent opacity={0.03} />
      </mesh>

      {/*
      DEV: Red spheres at each anchor — shows where current anchors are placed.
      {DEV_PICK_MODE && ANCHOR_ENTRIES.map(({ id, vec }) => (
        <mesh key={id} position={vec.toArray()}>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color="red" />
        </mesh>
      ))}
      */}
    </>
  )
}
