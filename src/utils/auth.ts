export const API_BASE = import.meta.env.PROD
    ? 'https://api.owlvision.app'
    : ''

export const AUTH = {
  loginUrl: `${API_BASE}/v3/discord/login/url`,
  refresh:  `${API_BASE}/v3/auth/refresh`,
  me:       `${API_BASE}/v3/discord/@me`,
  guilds:   `${API_BASE}/v3/discord/@me/guilds`,
  settings: `${API_BASE}/v3/settings`,
}

let isRefreshing = false
let refreshQueue: Array<(success: boolean) => void> = []

async function tryRefresh(): Promise<boolean> {
  if (isRefreshing) {
    return new Promise(resolve => {
      refreshQueue.push(resolve)
    })
  }

  isRefreshing = true

  try {
    const res = await fetch(AUTH.refresh, {
      method: 'POST',
      credentials: 'include',
    })
    const ok = res.ok
    refreshQueue.forEach(fn => fn(ok))
    refreshQueue = []
    isRefreshing = false
    return ok
  } catch {
    refreshQueue.forEach(fn => fn(false))
    refreshQueue = []
    isRefreshing = false
    return false
  }
}

export async function apiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const opts: RequestInit = { ...options, credentials: 'include' }

  const res = await fetch(url, opts)

  if (res.status === 401) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      return fetch(url, opts)
    }
  }

  return res
}

export async function openAuthPopup(onSuccess: () => void) {
  try {
    const res = await fetch(AUTH.loginUrl)
    const data = await res.json()

    if (!data.url) {
      console.error('No login URL returned from backend')
      return
    }

    const width = 500
    const height = 700
    const left = window.screenX + (window.innerWidth - width) / 2
    const top = window.screenY + (window.innerHeight - height) / 2

    const popup = window.open(
        data.url,
        'discord_auth',
        `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    )

    if (!popup) return

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data === 'AUTH_SUCCESS') {
        window.removeEventListener('message', handleMessage)
        clearInterval(pollTimer)
        onSuccess()
      }
    }
    window.addEventListener('message', handleMessage)

    const pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer)
        window.removeEventListener('message', handleMessage)
        onSuccess()
      }
    }, 500)

  } catch (error) {
    console.error('Failed to initiate login:', error)
  }
}
