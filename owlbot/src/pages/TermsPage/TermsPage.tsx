import './TermsPage.css'

const sections = [
  {
    num: '01',
    title: 'General Provisions',
    text: 'By using the OwlVision bot on any Discord server, you agree to these Terms of Use. If you disagree with any provision, please stop using the bot.\n\nWe reserve the right to update these terms without prior notice. The current version is always available on this page.',
  },
  {
    num: '02',
    title: 'Access and Use of the Bot',
    text: 'OwlVision provides XP systems, statistics, dynamic voice channels, a shop, moderation, game server integrations, and other services. Access is provided as-is without guarantees of uninterrupted operation.',
    listLabel: 'You are prohibited from:',
    list: [
      'Using the bot in ways that violate Discord Terms of Service.',
      'Intentionally exploiting bugs or vulnerabilities (XP farming, bypassing the shop system, etc.).',
      'Interfering with the normal operation of the bot on other servers.',
      'Using automated scripts or macros to simulate activity for in-game advantages.',
    ],
    footer: 'We reserve the right to block access to the bot without warning for violations.',
  },
  {
    num: '03',
    title: 'XP System and Game Mechanics',
    text: 'XP is earned through voice activity, sending messages, and streaming on Discord servers where the bot is installed. Accumulated XP and in-game currency are virtual and have no real monetary value.\n\nWe do not guarantee the preservation of accumulated data in the event of technical failures, server migrations, or force majeure circumstances.',
  },
  {
    num: '04',
    title: 'Shop',
    text: 'All items in the OwlVision shop are purchased with virtual in-game currency. Purchases are non-refundable unless otherwise specified by the administrator of a particular server.\n\nWe are not responsible for items (keys, roles, content) issued by server administrators through the shop system.',
  },
  {
    num: '05',
    title: 'Moderation and Server Responsibility',
    text: 'Moderation commands (/ban, /kick, /warn, and similar) are executed solely at the direction of administrators of a specific Discord server. The OwlVision developer is not responsible for moderation decisions made by administrators.',
  },
  {
    num: '06',
    title: 'Game Services',
    text: 'Access to game servers (Minecraft and others) is provided at the discretion of the OwlVision team. We reserve the right to restrict access to any user who violates community rules or is on the blacklist.\n\nThe stability of game servers depends on hosting providers and is not guaranteed.',
  },
  {
    num: '07',
    title: 'Limitation of Liability',
    text: 'OwlVision is provided free of charge. We are not liable for any direct or indirect damages arising from the use or inability to use the bot, including loss of virtual data, XP, in-game currency, or content.\n\nThe bot may be temporarily unavailable during maintenance or updates.',
  },
  {
    num: '08',
    title: 'Governing Law',
    text: 'These terms are governed by the laws of Ukraine. Disputes that cannot be resolved through pre-trial proceedings are handled in accordance with applicable law.',
  },
  {
    num: '09',
    title: 'Contact',
    text: 'For all questions related to the terms of use, please contact us through the official OwlVision Discord server.',
  },
]

export default function TermsPage() {
  return (
    <div className="doc-page">
      <div className="doc-hero">
        <div className="page-tag">// Documentation</div>
        <h1 className="doc-title">Terms of Use</h1>
        <p className="doc-date">Effective April 6, 2026</p>
      </div>
      <div className="doc-sections">
        {sections.map((s) => (
          <div key={s.num} className="doc-section">
            <div className="doc-num">{s.num}</div>
            <div className="doc-content">
              <h2 className="doc-section-title">{s.title}</h2>
              {s.text.split('\n\n').map((p, i) => (
                <p key={i} className="doc-text">{p}</p>
              ))}
              {s.listLabel && <p className="doc-list-label">{s.listLabel}</p>}
              {s.list && (
                <ul className="doc-list">
                  {s.list.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              )}
              {s.footer && <p className="doc-text doc-text-muted">{s.footer}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
