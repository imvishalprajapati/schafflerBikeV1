import { Html } from '@react-three/drei'
import { useNavigate } from 'react-router-dom'
import { useShowroomStore } from '../store/useShowroomStore.js'
import components from '../data/components.js'

// Category colors
const catColor = {
  'Engine': '#00893D',
  'Engine Control Units': '#00b050',
  'Transmission': '#0077cc',
  'Chassis': '#cc7700',
  'Electrification': '#9900cc',
}

function HotspotPin({ component }) {
  const navigate = useNavigate()
  const { hoveredComponent, hoveredMeshId, selectedComponent, setHoveredComponent, dynamicAnchors } = useShowroomStore()
  // Pin is active if selected via sidebar, 3D mesh hover, OR if it's the currently selected component
  const isHovered = hoveredComponent === component.id || hoveredMeshId === component.id || selectedComponent === component.id
  const color = catColor[component.category] || '#00893D'
  
  // 1. Use dynamic anchor (calculated from meshes) if available
  // 2. Otherwise, for safety, DO NOT fall back to bad hardcoded anchors 
  //    if they would float in the air. We only show the pin if high-fidelity 
  //    positioning is available.
  const dynPos = dynamicAnchors[component.id];
  if (!dynPos) return null; // Hide pin if not mapped to a mesh

  const pinPosition = dynPos;

  return (
    <Html position={pinPosition} center zIndexRange={[10, 20]}>
      <div
        className={`hotspot-pin ${isHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setHoveredComponent(component.id)}
        onMouseLeave={() => setHoveredComponent(null)}
        onPointerDown={(e) => {
          e.stopPropagation()
          navigate(`/component/${component.id}`)
        }}
        style={{ '--pin-color': color }}
      >
        <div className="hotspot-label">
          {component.label}
          <span className="hotspot-category">{component.category}</span>
        </div>
        <div className="hotspot-ring" style={{ borderColor: color }}>
          <div className="hotspot-dot" style={{ background: color }} />
        </div>
      </div>
    </Html>
  )
}

export default function Hotspots() {
  const { hoveredComponent, hoveredMeshId, selectedComponent } = useShowroomStore()

  // Show the hotspot pin for whichever component is active (sidebar or 3D hover or selected)
  const activeId = hoveredComponent || hoveredMeshId || selectedComponent

  const filtered = activeId
    ? components.filter(comp => comp.id === activeId)
    : []

  return (
    <>
      {filtered.map(comp => (
        <HotspotPin key={comp.id} component={comp} />
      ))}
    </>
  )
}
