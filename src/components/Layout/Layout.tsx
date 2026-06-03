import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useLocation } from 'react-router-dom'
import HomePage    from '../../pages/HomePage/HomePage'
import ModulesPage from '../../pages/ModulesPage/ModulesPage'
import TermsPage   from '../../pages/TermsPage/TermsPage'
import PrivacyPage from '../../pages/PrivacyPage/PrivacyPage'
import ScrollToTop from './ScrollToTop'
import AuthCallback from '../../pages/AuthCallback/AuthCallback'
import { AUTH, openAuthPopup } from '../../utils/auth'
import './Layout.css'


type DiscordUser = {
  id: string
  username: string
  email: string
  globalName: string
  avatar: string
}

function fetchUser(setUser: (u: DiscordUser | null) => void) {
  fetch(AUTH.me, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => setUser(data))
      .catch(() => setUser(null))
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<DiscordUser | null>(null)
  const close = () => setOpen(false)
  const location = useLocation()

  useEffect(() => {
    fetchUser(setUser)
  }, [location.pathname])

  const avatarUrl = user
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64`
      : null

  return (
      <nav className="nav">
        <NavLink to="/" className="nav-logo" onClick={close}>
          <img src="/logo.svg" alt="OwlBot" className="nav-logo-img" />
        </NavLink>

        <button className="nav-burger" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span style={{ transform: open ? 'rotate(45deg) translate(0.25rem, 0.375rem)' : 'none' }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? 'rotate(-45deg) translate(0.25rem, -0.375rem)' : 'none' }} />
        </button>

        <ul className={`nav-links${open ? ' open' : ''}`}>
          <li><NavLink to="/"       end onClick={close} className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/modules"    onClick={close} className={({isActive}) => isActive ? 'active' : ''}>Modules</NavLink></li>
          <li>
            {user ? (
                <div className="nav-user">
                  {avatarUrl && <img src={avatarUrl} alt={user.username} className="nav-avatar" />}
                  <span className="nav-username">{user.globalName || user.username}</span>
                </div>
            ) : (
                <button
                    className="btn-signin"
                    onClick={() => openAuthPopup(() => fetchUser(setUser))}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink:0}}>
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                  </svg>
                  Sign in
                </button>
            )}
          </li>
        </ul>
      </nav>
  )
}

function Footer() {
  return (
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <NavLink to="/" className="footer-logo-link">
              <img src="/logo.svg" alt="OwlBot" className="footer-logo-img" />
            </NavLink>
            <span className="footer-copy">© 2026 OwlVision. All rights reserved.</span>
          </div>
          <nav className="footer-links">
            <NavLink to="/terms"   className="footer-link">Terms of Use</NavLink>
            <span className="footer-divider">·</span>
            <NavLink to="/privacy" className="footer-link">Privacy Policy</NavLink>
          </nav>
        </div>
      </footer>
  )
}

export default function Layout() {
  return (
      <div className="app">
        <ScrollToTop />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/"        element={<HomePage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/terms"   element={<TermsPage />} />
            <Route path="/privacy"       element={<PrivacyPage />} />
            <Route path="/callback" element={<AuthCallback />} />
          </Routes>
        </main>
        <Footer />
      </div>
  )
}