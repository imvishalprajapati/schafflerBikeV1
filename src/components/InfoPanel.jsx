import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

const catColor = {
  'Engine': '#00893D',
  'Engine Control Units': '#00b050',
  'Transmission': '#0077cc',
  'Chassis': '#cc7700',
  'Electrification': '#9900cc',
}

export default function InfoPanel({ component }) {
  const panelRef = useRef()

  useEffect(() => {
    if (!panelRef.current) return
    const els = panelRef.current.querySelectorAll('.anim-item')
    gsap.fromTo(els,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.2 }
    )
  }, [component.id])

  const color = catColor[component.category] || '#00893D'

  return (
    <div className="info-panel" ref={panelRef}>
      {/* Badge */}
      <div className="info-category-badge anim-item" style={{ borderColor: `${color}66`, color }}>
        <div className="info-badge-dot" style={{ background: color }} />
        {component.category}
      </div>

      {/* Title */}
      <div className="anim-item">
        <h1 className="info-title">{component.label}</h1>
      </div>

      {/* Tagline */}
      <div className="info-tagline anim-item" style={{ borderLeftColor: color }}>
        {component.tagline}
      </div>

      {/* Highlights */}
      {component.highlights?.length > 0 && (
        <div className="anim-item">
          <div className="info-section-label" style={{ color }}>Key Highlights</div>
          <div className="info-highlights">
            {component.highlights.map((h, i) => (
              <div key={i} className="info-highlight">
                <div className="info-highlight-icon" style={{ background: color }}>✓</div>
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {component.features?.length > 0 && (
        <div className="anim-item">
          <div className="info-section-label" style={{ color }}>Features</div>
          <ul className="info-features-list">
            {component.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Advantages */}
      {component.advantages?.length > 0 && (
        <div className="anim-item">
          <div className="info-section-label" style={{ color }}>Advantages</div>
          <ul className="info-features-list">
            {component.advantages.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tech Specs */}
      {component.specs && Object.keys(component.specs).length > 0 && (
        <div className="anim-item">
          <div className="info-section-label" style={{ color }}>Technical Specifications</div>
          <table className="specs-table">
            <tbody>
              {Object.entries(component.specs).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom padding */}
      <div style={{ height: '2rem' }} />
    </div>
  )
}
