import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()

  const minimize = () => window.electronAPI?.minimize()
  const maximize = () => window.electronAPI?.maximize()
  const close    = () => window.electronAPI?.close()

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src="./SchaefflerLogo.png" alt="Schaeffler" style={{ height: '24px', objectFit: 'contain' }} />
      </div>

      <div className="navbar-controls">
        <button className="window-btn minimize" onClick={minimize} title="Minimize">─</button>
        <button className="window-btn" onClick={maximize} title="Maximize">□</button>
        <button className="window-btn close" onClick={close} title="Close">✕</button>
      </div>
    </nav>
  )
}
