import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Bounds, PerformanceMonitor, Bvh } from '@react-three/drei'
import { useState } from 'react'
import { useShowroomStore } from '../store/useShowroomStore.js'
import components from '../data/components.js'
import BikeViewer from '../components/BikeViewer.jsx'
import Hotspots from '../components/Hotspots.jsx'

export default function Home() {
  const { hoveredComponent, setHoveredComponent } = useShowroomStore()
  const [dpr, setDpr] = useState(1.5)

  const catColor = {
    'Engine': '#00893D',
    'Engine Control Units': '#00b050',
    'Transmission': '#0077cc',
    'Chassis': '#cc7700',
    'Electrification': '#9900cc',
  }

  return (
    <div className="home-page">
      {/* Main 3D view — bike + hotspots share one Canvas */}
      <div className="canvas-wrapper">
        <Canvas
          frameloop="demand"
          camera={{ position: [0, 1.2, 4.5], fov: 45 }}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          /* shadows removed for massive performance gain on huge GLBs */
          dpr={dpr}
          style={{ background: 'transparent' }}
        >
          <PerformanceMonitor onDecline={() => setDpr(1)} />
          <color attach="background" args={['#FFFFFF']} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            {/* Removed dynamic castShadow for performance */}
            <directionalLight position={[5, 8, 5]} intensity={1.5} />
            <directionalLight position={[-5, 4, -5]} intensity={0.4} color="#00893D" />
            <pointLight position={[0, 4, 0]} intensity={0.6} />

            {/* Bike model and Hotspots wrapped in Bounds to ensure it stays fully visible */}
            {/* 'observe' removed as it causes heavy recalculation drag when rotating */}
            {/* margin increased to further reduce the optical size of the bike on screen as per client request */}
            <Bounds fit clip margin={2.2}>
              <Bvh firstHitOnly>
                <group position={[0, -0.8, 0]} scale={0.5}>
                  <BikeViewer />
                  <Hotspots />
                </group>
              </Bvh>
            </Bounds>

            {/* The problematic opaque gray blocking box has been permanently removed */}

            <Environment preset="city" />

            <OrbitControls
              enablePan={false}
              enableZoom={true}
              minDistance={1.0}
              maxDistance={12}
              minPolarAngle={Math.PI / 12}
              maxPolarAngle={Math.PI / 1.8}
              enableDamping={true}
              dampingFactor={0.05}
              makeDefault
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Background gradient */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 80%, rgba(0,137,61,0.00) 0%, transparent 70%)',
        zIndex: 1
      }} />

      {/* Component sidebar */}
      <div className="component-sidebar" style={{ zIndex: 10 }}>
        <div className="sidebar-panel">
          <div className="sidebar-header">
            <div className="sidebar-header-accent" />
            <span>COMPONENTS</span>
            <div className="sidebar-header-count">{components.length}</div>
          </div>
          <div className="component-list">
            {Object.entries(
              components.reduce((acc, comp) => {
                if (!acc[comp.category]) acc[comp.category] = []
                acc[comp.category].push(comp)
                return acc
              }, {})
            ).map(([category, comps]) => (
              <div key={category} className="sidebar-category-group">
                <div
                  className="sidebar-category-label"
                  style={{ '--cat-color': catColor[category] || '#00893D' }}
                >
                  <span className="sidebar-cat-dot" style={{ background: catColor[category] || '#00893D' }} />
                  {category}
                </div>
                {comps.map(comp => (
                  <button
                    key={comp.id}
                    className={`component-btn ${hoveredComponent === comp.id ? 'active' : ''}`}
                    style={{ '--cat-color': catColor[comp.category] || '#00893D' }}
                    onClick={() => setHoveredComponent(comp.id === hoveredComponent ? null : comp.id)}
                  >
                    <span className="comp-btn-label">{comp.label}</span>
                    {hoveredComponent === comp.id && <span className="comp-btn-arrow">→</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Bottom hint */}
      <div className="hint-toast" style={{ zIndex: 10 }}>
        <div className="hint-dot" />
        Click a component pin to explore product details
      </div>

    </div>
  )
}

// End of Home.jsx

