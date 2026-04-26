import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const catColor = {
  'Engine': '#00893D',
  'Engine Control Units': '#00893D',
  'Transmission': '#00893D',
  'Chassis': '#00893D',
  // 'Electrification': '#9900cc',  // hidden
}

// ── Accordion item ────────────────────────────────────────────────────────────
function AccordionSection({ label, color, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const bodyRef = useRef()

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return
    if (open) {
      el.style.maxHeight = el.scrollHeight + 'px'
      el.style.opacity = '1'
    } else {
      el.style.maxHeight = '0'
      el.style.opacity = '0'
    }
  }, [open])

  return (
    <div className="accordion-section anim-item">
      <button
        className="accordion-header"
        onClick={() => setOpen(o => !o)}
        style={{ '--acc-color': color }}
        aria-expanded={open}
      >
        <span className="accordion-label" style={{ color }}>{label}</span>
        <span className={`accordion-chevron ${open ? 'open' : ''}`} style={{ color }}>
          ‹
        </span>
      </button>
      <div
        ref={bodyRef}
        className="accordion-body"
        style={{ maxHeight: defaultOpen ? '1000px' : '0', opacity: defaultOpen ? '1' : '0' }}
      >
        <div className="accordion-body-inner">
          {children}
        </div>
      </div>
    </div>
  )
}

// ── InfoPanel ─────────────────────────────────────────────────────────────────
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

      {/* Key Highlights — always visible, no accordion */}
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

      {/* Features — accordion */}
      {component.features?.length > 0 && (
        <AccordionSection
          label="Features"
          color={color}
          defaultOpen={true}
        >
          <ul className="info-features-list">
            {component.features.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </AccordionSection>
      )}

      {/* Advantages — accordion */}
      {component.advantages?.length > 0 && (
        <AccordionSection
          label="Advantages"
          color={color}
          defaultOpen={!component.features?.length}
        >
          <ul className="info-features-list">
            {component.advantages.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </AccordionSection>
      )}

      {/* Technical Specifications — accordion */}
      {component.specs && Object.keys(component.specs).length > 0 && (
        <AccordionSection
          label="Technical Specifications"
          color={color}
          defaultOpen={!component.features?.length && !component.advantages?.length}
        >
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
        </AccordionSection>
      )}

      {/* Bottom padding */}
      <div style={{ height: '2rem' }} />
    </div>
  )
}
