export default function LoadingScreen({ progress = 0, message = 'Loading assets...' }) {
  return (
    <div className="loading-screen">
      <div className="loading-logo">
        <div className="loading-logo-mark" />
        <div>
          <div className="loading-title">
            <span>Schaeffler</span> 2W
          </div>
          <div className="loading-subtitle">Interactive Showroom</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
        <div className="loading-bar-wrap">
          <div className="loading-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="loading-percent">{Math.round(progress)}% — {message}</div>
      </div>
    </div>
  )
}
