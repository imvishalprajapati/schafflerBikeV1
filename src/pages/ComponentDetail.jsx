import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { componentMap } from '../data/components.js'
import ComponentViewer from '../components/ComponentViewer.jsx'
import InfoPanel from '../components/InfoPanel.jsx'

const catColor = {
  'Engine': '#00893D',
  'Engine Control Units': '#00b050',
  'Transmission': '#0077cc',
  'Chassis': '#cc7700',
  'Electrification': '#9900cc',
}

export default function ComponentDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pageRef = useRef()
  const [scrollProgress, setScrollProgress] = useState(0)
  const component = componentMap[id]

  useEffect(() => {
    if (!pageRef.current) return
    gsap.fromTo(pageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    )
  }, [id])

  // Scroll-based explode progress (on the info pane)
  const handleScroll = (e) => {
    const el = e.currentTarget
    const progress = el.scrollTop / (el.scrollHeight - el.clientHeight)
    setScrollProgress(Math.min(Math.max(progress, 0), 1))
  }

  if (!component) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ fontSize: '3rem' }}>⚠</div>
        <div style={{ color: 'var(--text-secondary)' }}>Component not found</div>
        <button className="back-button" style={{ position: 'static' }} onClick={() => navigate('/')}>← Back to Showroom</button>
      </div>
    )
  }

  const color = catColor[component.category] || '#00893D'

  return (
    <div className="detail-page page-enter" ref={pageRef}>
      {/* Back button */}
      <button className="back-button" onClick={() => navigate('/')}>
        <span className="back-arrow">←</span>
        Back to Showroom
      </button>

      {/* Left: 3D Viewer */}
      <div className="detail-viewer-pane">
        <ComponentViewer
          componentId={component.id}
          modelFile={component.model}
          color={color}
          scrollProgress={component.hasExplodedView && component.explodeTrigger !== 'zoom' ? scrollProgress : 0}
          explodeTrigger={component.explodeTrigger}
        />

        {/* Component label */}
        <div className="viewer-label-overlay">
          <div className="viewer-component-name">{component.id.replace(/_/g, ' ')}</div>
          <div className="viewer-orbit-hint">Drag to rotate · {component.explodeTrigger === 'zoom' ? 'Zoom to explode' : 'Scroll to zoom'}</div>
        </div>

        {/* Scroll-driven explode progress bar (Only if supported by the component class) */}
        {component.hasExplodedView && (
          <div className="explode-progress">
            <div className="explode-label">Explode</div>
            <div className="explode-track">
              <div className="explode-fill" style={{ height: `${scrollProgress * 100}%`, background: `linear-gradient(180deg, ${color}, ${color}88)` }} />
            </div>
          </div>
        )}

        {/* Scroll hint */}
        {scrollProgress < 0.05 && component.hasExplodedView && (
          <div className="scroll-hint">
            <div className="scroll-hint-wheel" style={{ borderColor: color }} />
            <div className="scroll-hint-text" style={{ color }}>{component.explodeTrigger === 'zoom' ? 'Zoom to explode' : 'Scroll to explode'}</div>
          </div>
        )}
      </div>

      {/* Right: Info Panel */}
      <div className="detail-info-pane" onScroll={handleScroll} style={{ overflowY: 'auto' }}>
        <InfoPanel component={component} scrollProgress={scrollProgress} />
      </div>
    </div>
  )
}
