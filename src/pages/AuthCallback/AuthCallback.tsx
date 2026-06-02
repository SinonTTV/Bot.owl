import { useEffect } from 'react'

export default function AuthCallback() {
  useEffect(() => {
    window.close()
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-primary)',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-muted)',
      fontSize: '0.875rem',
    }}>
      Authorization complete. Closing...
    </div>
  )
}
