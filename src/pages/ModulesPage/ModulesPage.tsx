import { useState } from 'react'
import './ModulesPage.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type Lang = 'en' | 'ua' | 'ru'

interface I18n { en: string; ua: string; ru: string }

interface SettingOption {
  value: string | number
  label: I18n
  description?: I18n
}

interface HttpDef {
  method: string
  endpoint: string
  body: Record<string, string>
}

interface Setting {
  id: string
  label: I18n
  description: I18n
  type: 'select' | 'number' | 'action'
  style?: 'dangerous'
  multiple?: boolean
  default: string | number | null
  required: boolean
  options: SettingOption[] | null
  step?: number
  min?: number
  max?: number
  http: HttpDef
}

interface ModuleData {
  module: { name: I18n }
  settings: Setting[]
}

// ─── Settings data (from JSON spec) ───────────────────────────────────────────

const settingsData: Record<string, ModuleData> = {
  'dynamic-category': {
    module: {
      name: { en: 'Dynamic Channels', ua: 'Динамічні категорії', ru: 'Динамические категории' },
    },
    settings: [
      {
        id: 'name',
        label: { en: 'Channel name type', ua: "Ім'я створюваного каналу", ru: 'Имя создаваемого канала' },
        description: {
          en: 'Name of the channel that will be created when a user joins',
          ua: 'Назва каналу, який буде створюватись при приєднанні користувача',
          ru: 'Название канала, который будет создаваться при подключении пользователя',
        },
        type: 'select',
        multiple: false,
        default: 'nickname',
        required: true,
        options: [
          {
            value: 'nickname',
            label: { en: 'By username', ua: "За ім'ям користувача", ru: 'По имени пользователя' },
            description: {
              en: 'Channel will get the name of the user who created it',
              ua: 'Канал отримає імʼя користувача, який його створив',
              ru: 'Канал получит имя пользователя, который его создал',
            },
          },
          {
            value: 'category',
            label: { en: 'By category name', ua: 'За назвою категорії', ru: 'По названию категории' },
            description: {
              en: 'Channel will get the name of the parent category',
              ua: 'Канал отримає назву батьківської категорії',
              ru: 'Канал получит название родительской категории',
            },
          },
        ],
        http: { method: 'PUT', endpoint: '/v3/settings/dynamic-category', body: { name: 'NAMING_TYPE', value: '{value}' } },
      },
      {
        id: 'bitrate',
        label: { en: 'Channel bitrate', ua: 'Бітрейт каналу', ru: 'Битрейт канала' },
        description: {
          en: 'Default audio quality for created voice channels',
          ua: 'Якість звуку у створюваних голосових каналах за замовчуванням',
          ru: 'Качество звука в создаваемых голосовых каналах по умолчанию',
        },
        type: 'select',
        multiple: false,
        default: 64000,
        required: true,
        options: [
          { value: 8000,  label: { en: '8 kbps',  ua: '8 кбіт/с',  ru: '8 кбит/с'  }, description: { en: 'Very low quality', ua: 'Дуже низька якість', ru: 'Очень низкое качество' } },
          { value: 16000, label: { en: '16 kbps', ua: '16 кбіт/с', ru: '16 кбит/с' }, description: { en: 'Very low quality', ua: 'Дуже низька якість', ru: 'Очень низкое качество' } },
          { value: 24000, label: { en: '24 kbps', ua: '24 кбіт/с', ru: '24 кбит/с' }, description: { en: 'Very low quality', ua: 'Дуже низька якість', ru: 'Очень низкое качество' } },
          { value: 32000, label: { en: '32 kbps', ua: '32 кбіт/с', ru: '32 кбит/с' }, description: { en: 'Low quality',      ua: 'Низька якість',      ru: 'Низкое качество'      } },
          { value: 48000, label: { en: '48 kbps', ua: '48 кбіт/с', ru: '48 кбит/с' }, description: { en: 'Normal quality',   ua: 'Звичайна якість',   ru: 'Обычное качество'    } },
          { value: 64000, label: { en: '64 kbps', ua: '64 кбіт/с', ru: '64 кбит/с' }, description: { en: 'Standard',        ua: 'Стандарт',          ru: 'Стандарт'            } },
          { value: 96000, label: { en: '96 kbps', ua: '96 кбіт/с', ru: '96 кбит/с' }, description: { en: 'Good quality',    ua: 'Добра якість',      ru: 'Хорошее качество'    } },
        ],
        http: { method: 'PUT', endpoint: '/v3/settings/dynamic-category', body: { name: 'BITRATE', value: '{value}' } },
      },
      {
        id: 'users-limit',
        label: { en: 'User limit', ua: 'Ліміт користувачів', ru: 'Лимит пользователей' },
        description: {
          en: 'Maximum number of users in the channel by default. 0 — no limit',
          ua: 'Максимальна кількість користувачів у каналі за замовчуванням. 0 — без ліміту',
          ru: 'Максимальное количество пользователей в канале по умолчанию. 0 — без лимита',
        },
        type: 'number',
        step: 1,
        min: 0,
        max: 99,
        default: 0,
        required: false,
        options: null,
        http: { method: 'PUT', endpoint: '/v3/settings/dynamic-category', body: { name: 'USERS_LIMIT', value: '{value}' } },
      },
    ],
  },
  experience: {
    module: { name: { en: 'Experience', ua: 'Досвід', ru: 'Опыт' } },
    settings: [
      {
        id: 'multiplier',
        label: { en: 'Experience multiplier', ua: 'Множник досвіду', ru: 'Множитель опыта' },
        description: {
          en: 'Multiplier applied to all experience gained on the server',
          ua: 'Множник, який застосовується до всього отримуваного досвіду на сервері',
          ru: 'Множитель, применяемый ко всему получаемому опыту на сервере',
        },
        type: 'number',
        step: 0.1,
        min: 0.1,
        max: 10.0,
        default: 1.0,
        required: true,
        options: null,
        http: { method: 'PUT', endpoint: '/v3/settings/experience', body: { name: 'EXPERIENCE_MULTIPLIER', value: '{value}' } },
      },
      {
        id: 'delete-user-experience',
        label: { en: 'Delete user experience', ua: 'Видалити досвід', ru: 'Удалить опыт' },
        description: {
          en: 'Completely removes the experience of the specified user on the server',
          ua: 'Повністю видаляє досвід вказаного користувача на сервері',
          ru: 'Полностью удаляет опыт указанного пользователя на сервере',
        },
        type: 'action',
        style: 'dangerous',
        required: false,
        default: null,
        options: null,
        http: { method: 'DELETE', endpoint: '/v3/settings/experience/user', body: { user_id: '{value}' } },
      },
    ],
  },
}

// ─── Module sidebar list ───────────────────────────────────────────────────────

const modules = [
  { icon: '📊', key: 'statistics',       name: 'Statistics',       status: 'active', category: 'Core'      },
  { icon: '🔨', key: 'moderation',       name: 'Moderation',       status: 'active', category: 'Core'      },
  { icon: '🔊', key: 'dynamic-category', name: 'Dynamic Channels', status: 'active', category: 'Core'      },
  { icon: '💰', key: 'economy',          name: 'Economy',          status: 'active', category: 'Core'      },
  { icon: '🎫', key: 'tickets',          name: 'Tickets',          status: 'beta',   category: 'Community' },
  { icon: '🎭', key: 'roles',            name: 'Roles',            status: 'soon',   category: 'Community' },
  { icon: '🏆', key: 'leaderboards',     name: 'Leaderboards',     status: 'active', category: 'Community' },
  { icon: '🎉', key: 'welcome',          name: 'Welcome',          status: 'soon',   category: 'Community' },
  { icon: '📋', key: 'logging',          name: 'Logging',          status: 'active', category: 'Utilities' },
  { icon: '⏰', key: 'reminders',        name: 'Reminders',        status: 'soon',   category: 'Utilities' },
  { icon: '🔗', key: 'integrations',     name: 'Integrations',     status: 'soon',   category: 'Utilities' },
  { icon: '🌟', key: 'experience',       name: 'Experience',       status: 'active', category: 'Utilities' },
]

const statusLabel: Record<string, string> = {
  active: '● Active',
  beta:   '◐ Beta',
  soon:   '○ Soon',
}

const LANG: Lang = 'en'

// ─── Setting controls ──────────────────────────────────────────────────────────

function SelectSetting({ setting }: { setting: Setting }) {
  const [value, setValue] = useState<string | number>(setting.default as string | number)
  const [saved, setSaved] = useState(false)

  const selected = setting.options!.find(o => o.value === value)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="setting-row">
      <div className="setting-info">
        <div className="setting-label">{setting.label[LANG]}</div>
        <div className="setting-desc">{setting.description[LANG]}</div>
        {selected?.description && (
          <div className="setting-hint">↳ {selected.description[LANG]}</div>
        )}
      </div>
      <div className="setting-control">
        <select
          className="setting-select"
          value={String(value)}
          onChange={e => {
            const opt = setting.options!.find(o => String(o.value) === e.target.value)
            setValue(opt ? opt.value : e.target.value)
            setSaved(false)
          }}
        >
          {setting.options!.map(opt => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label[LANG]}
            </option>
          ))}
        </select>
        <button
          className={`setting-save-btn${saved ? ' setting-save-btn--saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function NumberSetting({ setting }: { setting: Setting }) {
  const [value, setValue] = useState<number>(setting.default as number)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="setting-row">
      <div className="setting-info">
        <div className="setting-label">{setting.label[LANG]}</div>
        <div className="setting-desc">{setting.description[LANG]}</div>
      </div>
      <div className="setting-control setting-control--number">
        <div className="setting-number-wrap">
          <input
            type="range"
            className="setting-range"
            min={setting.min}
            max={setting.max}
            step={setting.step}
            value={value}
            onChange={e => { setValue(Number(e.target.value)); setSaved(false) }}
          />
          <input
            type="number"
            className="setting-number-input"
            min={setting.min}
            max={setting.max}
            step={setting.step}
            value={value}
            onChange={e => { setValue(Number(e.target.value)); setSaved(false) }}
          />
        </div>
        <button
          className={`setting-save-btn${saved ? ' setting-save-btn--saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
    </div>
  )
}

function ActionSetting({ setting }: { setting: Setting }) {
  const [userId, setUserId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [done, setDone] = useState(false)

  const isDangerous = setting.style === 'dangerous'

  const handleClick = () => {
    if (!confirm) { setConfirm(true); return }
    setConfirm(false)
    setDone(true)
    setTimeout(() => setDone(false), 2000)
    setUserId('')
  }

  return (
    <div className={`setting-row setting-row--action${isDangerous ? ' setting-row--dangerous' : ''}`}>
      <div className="setting-info">
        <div className="setting-label">
          {isDangerous && <span className="setting-danger-icon">⚠</span>}
          {setting.label[LANG]}
        </div>
        <div className="setting-desc">{setting.description[LANG]}</div>
      </div>
      <div className="setting-control setting-control--action">
        <input
          type="text"
          className="setting-text-input"
          placeholder="User ID"
          value={userId}
          onChange={e => { setUserId(e.target.value); setConfirm(false) }}
        />
        <button
          className={`setting-action-btn${isDangerous ? ' setting-action-btn--dangerous' : ''}${done ? ' setting-action-btn--done' : ''}`}
          onClick={handleClick}
          disabled={!userId.trim()}
        >
          {done ? '✓ Done' : confirm ? 'Confirm?' : setting.label[LANG]}
        </button>
      </div>
    </div>
  )
}

function SettingControl({ setting }: { setting: Setting }) {
  if (setting.type === 'select') return <SelectSetting setting={setting} />
  if (setting.type === 'number') return <NumberSetting setting={setting} />
  if (setting.type === 'action') return <ActionSetting setting={setting} />
  return null
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ModulesPage() {
  const [active, setActive] = useState(modules[0].key)

  const current = modules.find(m => m.key === active)!
  const data = settingsData[current.key]

  return (
    <div className="modules-page">
      <aside className="modules-sidebar">
        <div className="sidebar-header">
          <div className="page-tag">// MODULES</div>
        </div>
        <nav className="sidebar-nav">
          {modules.map((m) => (
            <button
              key={m.key}
              className={`sidebar-item${active === m.key ? ' sidebar-item--active' : ''} sidebar-item--${m.status}`}
              onClick={() => setActive(m.key)}
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
            {data ? (
              <div className="settings-list">
                {data.settings.map(setting => (
                  <SettingControl key={setting.id} setting={setting} />
                ))}
              </div>
            ) : (
              <p className="module-detail-placeholder">Module content coming soon.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
