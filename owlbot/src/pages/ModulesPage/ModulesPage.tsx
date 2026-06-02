import { useState } from 'react'
import './ModulesPage.css'

// ─── Types ────────────────────────────────────────────────────────────────────

type SelectOption = {
  value: string | number
  label:       { en: string }
  description: { en: string }
}

type SettingBase = {
  id: string
  label:       { en: string }
  description: { en: string }
  required: boolean
  http: { method: string; endpoint: string; body: Record<string, string> }
}

type SelectSetting = SettingBase & {
  type: 'select'
  multiple: boolean
  default: string | number
  options: SelectOption[]
}

type NumberSetting = SettingBase & {
  type: 'number'
  step: number
  min: number
  max: number
  default: number
  options: null
}

type ActionSetting = SettingBase & {
  type: 'action'
  style: 'dangerous' | 'default'
  default: null
  options: null
}

type Setting = SelectSetting | NumberSetting | ActionSetting

type Module = {
  icon: string
  key: string
  name: string
  status: 'active' | 'beta' | 'soon'
  settings: Setting[]
}

// ─── Data from JSON ───────────────────────────────────────────────────────────

const modules: Module[] = [
  {
    icon: '🔊',
    key: 'dynamic-category',
    name: 'Dynamic Categories',
    status: 'active',
    settings: [
      {
        id: 'name',
        label:       { en: 'Channel name type' },
        description: { en: 'Name of the channel that will be created when a user joins' },
        type: 'select',
        multiple: false,
        default: 'nickname',
        required: true,
        options: [
          { value: 'nickname', label: { en: 'By username' },      description: { en: 'Channel will get the name of the user who created it' } },
          { value: 'category', label: { en: 'By category name' }, description: { en: 'Channel will get the name of the parent category' } },
        ],
        http: { method: 'PUT', endpoint: '/v3/settings/dynamic-category', body: { name: 'NAMING_TYPE', value: '{value}' } },
      },
      {
        id: 'bitrate',
        label:       { en: 'Channel bitrate' },
        description: { en: 'Default audio quality for created voice channels' },
        type: 'select',
        multiple: false,
        default: 64000,
        required: true,
        options: [
          { value: 8000,  label: { en: '8 kbps'  }, description: { en: 'Very low quality' } },
          { value: 16000, label: { en: '16 kbps' }, description: { en: 'Very low quality' } },
          { value: 24000, label: { en: '24 kbps' }, description: { en: 'Very low quality' } },
          { value: 32000, label: { en: '32 kbps' }, description: { en: 'Low quality' } },
          { value: 48000, label: { en: '48 kbps' }, description: { en: 'Normal quality' } },
          { value: 64000, label: { en: '64 kbps' }, description: { en: 'Standard' } },
          { value: 96000, label: { en: '96 kbps' }, description: { en: 'Good quality' } },
        ],
        http: { method: 'PUT', endpoint: '/v3/settings/dynamic-category', body: { name: 'BITRATE', value: '{value}' } },
      },
      {
        id: 'users-limit',
        label:       { en: 'User limit' },
        description: { en: 'Maximum number of users in the channel by default. 0 — no limit' },
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
  {
    icon: '⭐',
    key: 'experience',
    name: 'Experience',
    status: 'active',
    settings: [
      {
        id: 'multiplier',
        label:       { en: 'Experience multiplier' },
        description: { en: 'Multiplier applied to all experience gained on the server' },
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
        label:       { en: 'Delete user experience' },
        description: { en: 'Completely removes the experience of the specified user on the server' },
        type: 'action',
        style: 'dangerous',
        required: false,
        default: null,
        options: null,
        http: { method: 'DELETE', endpoint: '/v3/settings/experience/user', body: { user_id: '{value}' } },
      },
    ],
  },
]

// ─── Setting controls ─────────────────────────────────────────────────────────

function SelectControl({ setting }: { setting: SelectSetting }) {
  const [value, setValue] = useState<string | number>(setting.default)
  const [saved, setSaved]   = useState(false)

  const current = setting.options.find(o => o.value === value)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="setting-control">
      <div className="setting-select-row">
        <div className="setting-custom-select">
          {setting.options.map(opt => (
            <button
              key={opt.value}
              className={`setting-select-option${value === opt.value ? ' selected' : ''}`}
              onClick={() => setValue(opt.value)}
            >
              <span className="option-label">{opt.label.en}</span>
              {value === opt.value && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          ))}
        </div>
        <button
          className={`setting-save-btn${saved ? ' saved' : ''}`}
          onClick={handleSave}
        >
          {saved ? '✓ Saved' : 'Save'}
        </button>
      </div>
      {current && (
        <p className="setting-hint">{current.description.en}</p>
      )}
    </div>
  )
}

function NumberControl({ setting }: { setting: NumberSetting }) {
  const [value, setValue] = useState(setting.default)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="setting-control setting-number-row">
      <div className="setting-number-input-wrap">
        <button
          className="setting-number-btn"
          onClick={() => setValue(v => Math.max(setting.min, parseFloat((v - setting.step).toFixed(10))))}
          disabled={value <= setting.min}
        >−</button>
        <input
          className="setting-number-input"
          type="number"
          value={value}
          step={setting.step}
          min={setting.min}
          max={setting.max}
          onChange={e => {
            const v = parseFloat(e.target.value)
            if (!isNaN(v)) setValue(Math.min(setting.max, Math.max(setting.min, v)))
          }}
        />
        <button
          className="setting-number-btn"
          onClick={() => setValue(v => Math.min(setting.max, parseFloat((v + setting.step).toFixed(10))))}
          disabled={value >= setting.max}
        >+</button>
      </div>
      <button
        className={`setting-save-btn${saved ? ' saved' : ''}`}
        onClick={handleSave}
      >
        {saved ? '✓ Saved' : 'Save'}
      </button>
    </div>
  )
}

function ActionControl({ setting }: { setting: ActionSetting }) {
  const [inputValue, setInputValue] = useState('')
  const [confirm, setConfirm]       = useState(false)

  function handleClick() {
    if (!confirm) { setConfirm(true); return }
    setConfirm(false)
    setInputValue('')
  }

  return (
    <div className="setting-control setting-action-row">
      <input
        className="setting-action-input"
        type="text"
        placeholder="User ID"
        value={inputValue}
        onChange={e => { setInputValue(e.target.value); setConfirm(false) }}
      />
      <button
        className={`setting-action-btn${setting.style === 'dangerous' ? ' dangerous' : ''}${confirm ? ' confirm' : ''}`}
        onClick={handleClick}
        disabled={!inputValue.trim()}
      >
        {confirm ? '⚠ Confirm' : 'Execute'}
      </button>
    </div>
  )
}

function SettingRow({ setting }: { setting: Setting }) {
  return (
    <div className="setting-row">
      <div className="setting-meta">
        <div className="setting-label">
          {setting.label.en}
          {setting.required && <span className="setting-required">*</span>}
        </div>
        <div className="setting-description">{setting.description.en}</div>
        <div className="setting-endpoint">
          <span className={`http-method http-method--${setting.http.method.toLowerCase()}`}>
            {setting.http.method}
          </span>
          <span className="http-path">{setting.http.endpoint}</span>
        </div>
      </div>
      <div className="setting-input">
        {setting.type === 'select'  && <SelectControl setting={setting} />}
        {setting.type === 'number'  && <NumberControl setting={setting} />}
        {setting.type === 'action'  && <ActionControl setting={setting} />}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const statusLabel: Record<string, string> = {
  active: '● Active',
  beta:   '◐ Beta',
  soon:   '○ Soon',
}

export default function ModulesPage() {
  const [activeKey, setActiveKey] = useState(modules[0].key)
  const current = modules.find(m => m.key === activeKey)!

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
              className={`sidebar-item${activeKey === m.key ? ' sidebar-item--active' : ''} sidebar-item--${m.status}`}
              onClick={() => setActiveKey(m.key)}
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

          <div className="module-settings">
            <div className="settings-section-title">// SETTINGS</div>
            {current.settings.map(s => (
              <SettingRow key={s.id} setting={s} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
