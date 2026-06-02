import { useEffect, useRef } from 'react'
import './HomePage.css'

const leaderboardData = [
  { rank: 1, emoji: '🦊', name: 'SovyaHka',   score: '47,763', pct: 100 },
  { rank: 2, emoji: '🐺', name: 'Lyxov',       score: '45,219', pct: 95  },
  { rank: 3, emoji: '🦁', name: 'Vhora',       score: '42,502', pct: 89  },
  { rank: 4, emoji: '🐸', name: 'JwendTango',  score: '39,284', pct: 82  },
  { rank: 5, emoji: '🦅', name: 'NightSky',    score: '18,447', pct: 39  },
]

const logEntries = [
  { time: '04.05.2026 19:08', type: 'ban',  text: 'sovyahka — spam filter triggered (x4)' },
  { time: '04.05.2026 18:11', type: 'mute', text: 'darky — repeated NSFW content posting' },
  { time: '04.05.2026 18:16', type: 'mute', text: 'pixel_fury — toxic behavior toward members' },
  { time: '04.05.2026 19:23', type: 'kick', text: 'user_cat — mute duration expired' },
  { time: '09.07.2026 19:27', type: 'ban',  text: 'toxic_potato — ping spam detected' },
  { time: '09.07.2026 18:45', type: 'kick', text: 'gloryfield — alt account suspected by moderator' },
  { time: '09.07.2026 19:45', type: 'mute', text: 'phdzx — suspicious link detected' },
  { time: '09.07.2026 18:54', type: 'ban',  text: 'xuldy_byte — mass duplication detected (x99)' },
  { time: '09.05.2026 19:19', type: 'warn', text: 'slowyghost — AFK farming activity' },
  { time: '09.05.2026 19:08', type: 'kick', text: 'rouge_el — harassed in direct messages' },
]

const avatarColors = [
  'linear-gradient(135deg,#e03c3c,#ff8c69)',
  'linear-gradient(135deg,#5865f2,#9b5de5)',
  'linear-gradient(135deg,#39ff69,#00c9a7)',
  'linear-gradient(135deg,#f5c842,#ff6b35)',
  'linear-gradient(135deg,#9b5de5,#5865f2)',
]

function DiscordIcon() {
  return (
    <svg className="discord-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
    </svg>
  )
}

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('reveal-visible')
          el.classList.remove('reveal-hidden')
        } else {
          el.classList.remove('reveal-visible')
          el.classList.add('reveal-hidden')
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useScrollReveal()
  return (
    <div
      ref={ref}
      className={`reveal-block ${className}`}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid-lines" />
        <div className="container">
          <div className="hero-inner">
            <div className="hero-left">
              <h1 className="hero-title">
                Your server<br />
                under the <span className="accent">Owl's</span><br />
                protection
              </h1>
              <p className="hero-desc">
                Moderation, economy, and advanced statistics — all in
                one powerful Discord bot built for serious communities.
              </p>
              <div className="hero-actions">
                <a href="#discord-invite" className="btn btn-discord">
                  <DiscordIcon />
                  Add to discord
                </a>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">3</span>
                  <span className="stat-label">Servers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">123</span>
                  <span className="stat-label">Users tracked</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">2.3<span className="stat-k">K</span></span>
                  <span className="stat-label">Commands used times</span>
                </div>
              </div>
            </div>

            <div className="hero-image-wrap">
              <img src="/assets/statistics-image.png" alt="OwlBot preview" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <Reveal>
            <div className="section-tag">// FEATURES</div>
            <div className="section-header">
              <h2>Everything your<br />community needs</h2>
            </div>
          </Reveal>
          <div className="features-grid">
            {[
              { title: 'Statistics',       desc: 'Deep activity tracking across your entire server. Voice-time, message counts, streaming hours — every metric visualized beautifully.', tags: [['blue','leaderboards'],['','channels'],['','profiles']] },
              { title: 'Moderation',       desc: 'Powerful auto-mod with smart filters, case logging, temp-mutes, warning points, and detailed audit trails for your team.',              tags: [['red','automod'],['','case log'],['','banning']] },
              { title: 'Dynamic channels', desc: 'Create smart voice and text channels that automatically adapt to your community. Generate temporary rooms, private team spaces.',         tags: [['green','auto-join']] },
              { title: 'Economy',          desc: 'Full-server economy with custom currency, shops, gambling mini-games, daily rewards, and a leaderboard-driven tier system.',            tags: [['yellow','currency'],['blue','shop']] },
            ].map((card, i) => (
              <Reveal key={card.title} delay={i * 80}>
                <div className="feature-card">
                  <h3>{card.title}</h3>
                  <p>{card.desc}</p>
                  <div className="tags">
                    {card.tags.map(([color, label]) => (
                      <span key={label} className={`tag ${color}`}>{label}</span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="track-section">
        <div className="container">
          <div className="track-inner">
            <Reveal>
              <div className="track-content">
                <div className="section-tag">// STATISTICS</div>
                <h2>Track every move<br />on your server</h2>
                <p>OwlBot logs everything silently in the background. Get beautiful per-user profiles with voice, chat, and streaming data.</p>
                <ul className="track-bullets">
                  <li>Per-user activity card with XP progress bar</li>
                  <li>Voice channel time and streaming session tracking</li>
                  <li>Real-time leaderboards — daily, weekly, all-time</li>
                  <li>Compare stats across served side by side</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="leaderboard-card">
                <div className="leaderboard-header">
                  <div className="lb-dot" style={{ background: '#ff5f57' }} />
                  <div className="lb-dot" style={{ background: '#febc2e' }} />
                  <div className="lb-dot" style={{ background: '#28c840' }} />
                </div>
                <div className="lb-list">
                  {leaderboardData.map((u) => (
                    <div key={u.rank} className="lb-row">
                      <span className="lb-rank">#{u.rank}</span>
                      <div className="lb-avatar" style={{ background: avatarColors[u.rank - 1] }}>{u.emoji}</div>
                      <span className="lb-name">{u.name}</span>
                      <div className="lb-bar-wrap">
                        <div className="lb-bar-fill" style={{ width: `${u.pct}%` }} />
                      </div>
                      <span className="lb-score">{u.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mod-section">
        <div className="container">
          <div className="mod-inner">
            <Reveal delay={150}>
              <div className="mod-log-card">
                <div className="mod-log-header">
                  <div className="lb-dot" style={{ background: '#ff5f57' }} />
                  <div className="lb-dot" style={{ background: '#febc2e' }} />
                  <div className="lb-dot" style={{ background: '#28c840' }} />
                </div>
                <div className="mod-log-body">
                  {logEntries.map((entry, i) => (
                    <div key={i} className="log-row">
                      <div className="log-row-top">
                        <span className={`log-type ${entry.type}`}>{entry.type.toUpperCase()}</span>
                        <span className="log-text">{entry.text}</span>
                      </div>
                      <span className="log-time">{entry.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
            <Reveal>
              <div className="track-content">
                <div className="section-tag">// MODERATION</div>
                <h2>Keep your server<br />safe, effortlessly</h2>
                <p>Automod with smart spam detection. Full case management system. Every action is logged and auditable.</p>
                <ul className="track-bullets">
                  <li>Smart Automod — detect spam, links, slurs in real-time</li>
                  <li>Raid protection with configurable lockdown triggers</li>
                  <li>Warning point system with auto-escalating punishments</li>
                  <li>Full audit log with user IDs and Moderator history</li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <Reveal>
            <h2>Ready to level<br />up your<br />community?</h2>
            <div className="cta-actions">
              <a href="#discord-invite" className="btn btn-discord">
                <DiscordIcon />
                Add to discord
              </a>
              <a href="#commands" className="btn btn-outline">View Commands</a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
