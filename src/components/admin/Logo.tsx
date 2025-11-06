import React from 'react'

export const Logo: React.FC = () => {
  const [imageError, setImageError] = React.useState(false)

  return (
    <div className="custom-logo" style={{
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '60px'
    }}>
      {!imageError ? (
        <img
          src="/assets/Funnel-synergy-logo-white.png"
          alt="Funnel Synergy"
          style={{
            height: '32px',
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block'
          }}
          onError={() => setImageError(true)}
        />
      ) : (
        <div style={{
          color: 'white',
          fontSize: '18px',
          fontWeight: 600,
          letterSpacing: '-0.5px'
        }}>
          Funnel Synergy
        </div>
      )}
    </div>
  )
}
