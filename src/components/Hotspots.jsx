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
  const { hoveredComponent, setHoveredComponent } = useShowroomStore()
  const isHovered = hoveredComponent === component.id
  const color = catColor[component.category] || '#00893D'

  return (
    <Html position={component.anchor} center occlude={false} zIndexRange={[10, 20]}>
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
  const { hoveredComponent } = useShowroomStore()

  // Only render the hotspot for the component selected in the sidebar.
  // When nothing is selected, hoveredComponent is null and nothing renders.
  const filtered = hoveredComponent
    ? components.filter(comp => comp.id === hoveredComponent)
    : []

  return (
    <>
      {filtered.map(comp => (
        <HotspotPin key={comp.id} component={comp} />
      ))}
    </>
  )
}
