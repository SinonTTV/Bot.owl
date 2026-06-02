import { useState } from 'react'
import './ModulesPage.css'

const modules = [
  { icon: '📊', name: 'Statistics',       status: 'active', category: 'Core' },
  { icon: '🔨', name: 'Moderation',       status: 'active', category: 'Core' },
  { icon: '🔊', name: 'Dynamic Channels', status: 'active', category: 'Core' },
  { icon: '💰', name: 'Economy',          status: 'active', category: 'Core' },
  { icon: '🎫', name: 'Tickets',          status: 'beta',   category: 'Community' },
  { icon: '🎭', name: 'Roles',            status: 'soon',   category: 'Community' },
  { icon: '🏆', name: 'Leaderboards',     status: 'active', category: 'Community' },
  { icon: '🎉', name: 'Welcome',          status: 'soon',   category: 'Community' },
  { icon: '📋', name: 'Logging',          status: 'active', category: 'Utilities' },
  { icon: '⏰', name: 'Reminders',        status: 'soon',   category: 'Utilities' },
  { icon: '🔗', name: 'Integrations',     status: 'soon',   category: 'Utilities' },
  { icon: '🎮', name: 'Games',            status: 'beta',   category: 'Utilities' },
]

const statusLabel: Record<string, string> = {
  active: '● Active',
  beta:   '◐ Beta',
  soon:   '○ Soon',
}

export default function ModulesPage() {
  const [active, setActive] = useState(modules[0].name)

  const current = modules.find(m => m.name === active)!

  return (
    <div className="modules-page">
      <aside className="modules-sidebar">
        <div className="sidebar-header">
          <div className="page-tag">// MODULES</div>
        </div>
        <nav className="sidebar-nav">
          {modules.map((m) => (
            <button
              key={m.name}
              className={`sidebar-item${active === m.name ? ' sidebar-item--active' : ''} sidebar-item--${m.status}`}
              onClick={() => setActive(m.name)}
            >
              <span className="sidebar-item-icon">{m.icon}</span>
              <span className="sidebar-item-name">{m.name}</span>
              {m.status === 'beta' && <span className="sidebar-badge sidebar-badge--beta">Beta</span>}
              {m.status === 'soon' && <span className="sidebar-badge sidebar-badge--soon">Soon</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="modules-content">
        <div className="module-detail">
          <div className="module-detail-header">
            <div className="module-detail-icon">{current.icon}</div>
            <div>
              <h1 className="module-detail-title">{current.name}</h1>
              <span className={`module-status module-status--${current.status}`}>
                {statusLabel[current.status]}
              </span>
            </div>
          </div>
          <div className="module-detail-body">
            <p className="module-detail-placeholder">
              Module content coming soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
