import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function AuthCallback() {
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const code  = searchParams.get('code')
    const state = searchParams.get('state')

    if (code && window.opener) {
      window.opener.postMessage({ type: 'AUTH_CALLBACK', code, state }, window.location.origin)
    }

    window.close()
  }, [searchParams])

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
