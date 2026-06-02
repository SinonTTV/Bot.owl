import './PrivacyPage.css'

const sections = [
  {
    num: '01',
    title: 'General Provisions',
    text: 'This Privacy Policy describes what data the OwlVision bot collects, how it is used, and how it is protected. By using the bot, you agree to the data processing practices described below.\n\nThis policy applies to all users interacting with the bot on any Discord server.',
  },
  {
    num: '02',
    title: 'What Data We Collect',
    text: 'We collect the minimum data necessary for the bot features to function:',
    list: [
      'Discord identifiers: user ID, server ID, and channel IDs — to link settings, statistics, and progress.',
      'Voice activity: times of joining and leaving voice channels, start/end of streams — for XP calculation. Audio is never recorded.',
      'Chat activity: the fact of sending a message (date and time) — for XP calculation. Message content is never read or stored.',
      'Game data: accumulated XP, virtual currency, shop purchase history.',
      'Minecraft: when using the whitelist — a link between Discord ID and in-game username. Passwords are never stored in plain text.',
      'Server settings: configuration of dynamic categories, shop, and other features set by administrators.',
    ],
  },
  {
    num: '03',
    title: 'How We Use Data',
    text: 'Collected data is used exclusively to provide the bot features:',
    list: [
      'Calculating and displaying level, XP, and statistics via /statistics.',
      'Operating the shop system: balance checks, purchases, item delivery.',
      'Managing dynamic voice channels and categories.',
      'Authentication on linked game servers (Minecraft).',
      'Executing moderation commands at the direction of server administrators.',
    ],
    footer: 'Data is not used for marketing purposes, is not sold, and is not shared with advertising networks.',
  },
  {
    num: '04',
    title: 'Data Storage',
    text: 'Data is stored on OwlVision servers (Redis database and API server). There is no set retention period as long as the user continues to interact with the bot on at least one server. Backups are performed at the discretion of the development team.',
  },
  {
    num: '05',
    title: 'Data Access and Security',
    text: 'Only the OwlVision developer has access to the database for maintenance purposes. We do not share your data with third parties except as required by the laws of Ukraine.\n\nWe take reasonable technical measures to protect data, but cannot guarantee absolute protection against unauthorized access.',
  },
  {
    num: '06',
    title: 'Data of Minors',
    text: 'OwlVision is not intended for users under the age of 13, in accordance with Discord Terms of Service. We do not intentionally collect data from children under this age.',
  },
  {
    num: '07',
    title: 'Your Rights',
    text: 'You may request deletion of your data from our system by contacting us through the official OwlVision Discord server. After deletion, all accumulated progress, XP, and game data will be permanently removed.',
  },
  {
    num: '08',
    title: 'Policy Updates',
    text: 'We may update this Privacy Policy. For significant changes, we will endeavor to notify users through official OwlVision channels. Continued use of the bot after the updated policy is published constitutes your agreement to the changes.',
  },
  {
    num: '09',
    title: 'Contact',
    text: 'For privacy questions and data deletion requests, please contact us through the official OwlVision Discord server.',
  },
]

export default function PrivacyPage() {
  return (
    <div className="doc-page">
      <div className="doc-hero">
        <div className="page-tag">// Documentation</div>
        <h1 className="doc-title">Privacy Policy</h1>
        <p className="doc-date">Updated: April 6, 2026</p>
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
