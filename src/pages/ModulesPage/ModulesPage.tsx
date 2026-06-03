import { useState, useEffect } from 'react'
import { AUTH, API_BASE, openAuthPopup } from '../../utils/auth'
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

interface DiscordGuild {
  id: string
  name: string
  icon: string | null
  owner: boolean
  permissions: string
}

interface DiscordUser {
  id: string
  username: string
  email: string
  globalName: string
  avatar: string
}

// ─── Settings data (from JSON spec) ───────────────────────────────────────────

const settingsData: Record<string, ModuleData> = {
  'dynamic-category': {
    module: {
      name: {
        en: 'Dynamic Categories',
        ua: 'Динамічні категорії',
        ru: 'Динамические категории'
      }
    },
    settings: [
      {
        id: 'name',
        label: {
          en: 'Channel name type',
          ua: "Ім'я створюваного каналу",
          ru: 'Имя создаваемого канала'
        },
        description: {
          en: 'Name of the channel that will be created when a user joins',
          ua: 'Назва каналу, який буде створюватись при приєднанні користувача',
          ru: 'Название канала, который будет создаваться при подключении пользователя'
        },
        type: 'select',
        multiple: false,
        default: 'nickname',
        required: true,
        options: [
          {
            value: 'nickname',
            label: {
              en: 'By username',
              ua: 'За ім\'ям користувача',
              ru: 'По имени пользователя'
            },
            description: {
              en: 'Channel will get the name of the user who created it',
              ua: 'Канал отримає ім\'я користувача, який його створив',
              ru: 'Канал получит имя пользователя, который его создал'
            }
          },
          {
            value: 'category',
            label: {
              en: 'By category name',
              ua: 'За назвою категорії',
              ru: 'По названию категории'
            },
            description: {
              en: 'Channel will get the name of the parent category',
              ua: 'Канал отримає назву батьківської категорії',
              ru: 'Канал получит название родительской категории'
            }
          }
        ],
        http: {
          method: 'PUT',
          endpoint: '/v3/settings',
          body: { name: 'NAMING_TYPE', value: '{value}' }
        }
      },
      {
        id: 'bitrate',
        label: {
          en: 'Channel bitrate',
          ua: 'Бітрейт каналу',
          ru: 'Битрейт канала'
        },
        description: {
          en: 'Default audio quality for created voice channels',
          ua: 'Якість звуку у створюваних голосових каналах за замовчуванням',
          ru: 'Качество звука в создаваемых голосовых каналах по умолчанию'
        },
        type: 'select',
        multiple: false,
        default: 64000,
        required: true,
        options: [
          {
            value: 8000,
            label: { en: '8 kbps', ua: '8 кбіт/с', ru: '8 кбит/с' },
            description: { en: 'Very low quality', ua: 'Дуже низька якість', ru: 'Очень низкое качество' }
          },
          {
            value: 16000,
            label: { en: '16 kbps', ua: '16 кбіт/с', ru: '16 кбит/с' },
            description: { en: 'Very low quality', ua: 'Дуже низька якість', ru: 'Очень низкое качество' }
          },
          {
            value: 24000,
            label: { en: '24 kbps', ua: '24 кбіт/с', ru: '24 кбит/с' },
            description: { en: 'Very low quality', ua: 'Дуже низька якість', ru: 'Очень низкое качество' }
          },
          {
            value: 32000,
            label: { en: '32 kbps', ua: '32 кбіт/с', ru: '32 кбит/с' },
            description: { en: 'Low quality', ua: 'Низька якість', ru: 'Низкое качество' }
          },
          {
            value: 48000,
            label: { en: '48 kbps', ua: '48 кбіт/с', ru: '48 кбит/с' },
            description: { en: 'Normal quality', ua: 'Звичайна якість', ru: 'Обычное качество' }
          },
          {
            value: 64000,
            label: { en: '64 kbps', ua: '64 кбіт/с', ru: '64 кбит/с' },
            description: { en: 'Standard', ua: 'Стандарт', ru: 'Стандарт' }
          },
          {
            value: 96000,
            label: { en: '96 kbps', ua: '96 кбіт/с', ru: '96 кбит/с' },
            description: { en: 'Good quality', ua: 'Добра якість', ru: 'Хорошее качество' }
          }
        ],
        http: {
          method: 'PUT',
          endpoint: '/v3/settings',
          body: { name: 'BITRATE', value: '{value}' }
        }
      },
      {
        id: 'users-limit',
        label: {
          en: 'User limit',
          ua: 'Ліміт користувачів',
          ru: 'Лимит пользователей'
        },
        description: {
          en: 'Maximum number of users in the channel by default. 0 — no limit',
          ua: 'Максимальна кількість користувачів у каналі за замовчуванням. 0 — без ліміту',
          ru: 'Максимальное количество пользователей в канале по умолчанию. 0 — без лимита'
        },
        type: 'number',
        step: 1,
        min: 0,
        max: 99,
        default: 0,
        required: false,
        options: null,
        http: {
          method: 'PUT',
          endpoint: '/v3/settings',
          body: { name: 'USERS_LIMIT', value: '{value}' }
        }
      }
    ]
  },
  'experience': {
    module: {
      name: {
        en: 'Experience',
        ua: 'Досвід',
        ru: 'Опыт'
      }
    },
    settings: [
      {
        id: 'multiplier',
        label: {
          en: 'Experience multiplier',
          ua: 'Множник досвіду',
          ru: 'Множитель опыта'
        },
        description: {
          en: 'Multiplier applied to all experience gained on the server',
          ua: 'Множник, який застосовується до всього отримуваного досвіду на сервері',
          ru: 'Множитель, применяемый ко всему получаемому опыту на сервере'
        },
        type: 'number',
        step: 0.1,
        min: 0.1,
        max: 10.0,
        default: 1.0,
        required: true,
        options: null,
        http: {
          method: 'PUT',
          endpoint: '/v3/settings',
          body: { name: 'EXPERIENCE_MULTIPLIER', value: '{value}' }
        }
      },
      {
        id: 'delete-user-experience',
        label: {
          en: 'Delete user experience',
          ua: 'Видалити досвід',
          ru: 'Удалить опыт'
        },
        description: {
          en: 'Completely removes the experience of the specified user on the server',
          ua: 'Повністю видаляє досвід вказаного користувача на сервері',
          ru: 'Полностью удаляет опыт указанного пользователя на сервере'
        },
        type: 'action',
        style: 'dangerous',
        required: false,
        default: null,
        options: null,
        http: {
          method: 'DELETE',
          endpoint: '/v3/settings/experience/user',
          body: { user_id: '{value}' }
        }
      }
    ]
  }
}

// ─── Module sidebar list ───────────────────────────────────────────────────────

const modules = [
  { icon: '🔊', key: 'dynamic-category', name: 'Dynamic Categories', status: 'active', category: 'Core' },
  { icon: '🌟', key: 'experience',       name: 'Experience',         status: 'active', category: 'Utilities' },
]

const statusLabel: Record<string, string> = {
  active: '● Active',
  beta:   '◐ Beta',
  soon:   '○ Soon',
}

const LANG: Lang = 'en'

// ─── Setting controls ──────────────────────────────────────────────────────────

function SelectSetting({
                         setting,
                         initialValue,
                         selectedGuildId,
                         onSaveSuccess,
                       }: {
  setting: Setting
  initialValue: string | number
  selectedGuildId: string
  onSaveSuccess: (id: string, val: string | number) => void
}) {
  const [value, setValue] = useState<string | number>(initialValue)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const selected = setting.options!.find(o => o.value === value)

  const handleSave = async () => {
    setSaving(true)
    try {
      const fieldMap: Record<string, string> = {
        'name': 'NAMING_TYPE',
        'bitrate': 'BITRATE'
      }
      const field = fieldMap[setting.id] || setting.id.toUpperCase()

      const res = await fetch(`${API_BASE}/v3/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: selectedGuildId,
          field: field,
          value: String(value)
        }),
        credentials: 'include'
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 1800)
        onSaveSuccess(setting.id, value)
      } else {
        alert('Failed to save settings')
      }
    } catch (e) {
      console.error(e)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
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
              disabled={saving}
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
              disabled={saving || String(value) === String(initialValue)}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>
  )
}

function NumberSetting({
                         setting,
                         initialValue,
                         selectedGuildId,
                         onSaveSuccess,
                       }: {
  setting: Setting
  initialValue: number
  selectedGuildId: string
  onSaveSuccess: (id: string, val: number) => void
}) {
  const [value, setValue] = useState<number>(initialValue)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  const handleSave = async () => {
    setSaving(true)
    try {
      const fieldMap: Record<string, string> = {
        'users-limit': 'USERS_LIMIT',
        'multiplier': 'EXPERIENCE_MULTIPLIER'
      }
      const field = fieldMap[setting.id] || setting.id.toUpperCase()

      const res = await fetch(`${API_BASE}/v3/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guildId: selectedGuildId,
          field: field,
          value: String(value)
        }),
        credentials: 'include'
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 1800)
        onSaveSuccess(setting.id, value)
      } else {
        alert('Failed to save settings')
      }
    } catch (e) {
      console.error(e)
      alert('Error saving settings')
    } finally {
      setSaving(false)
    }
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
                disabled={saving}
            />
            <input
                type="number"
                className="setting-number-input"
                min={setting.min}
                max={setting.max}
                step={setting.step}
                value={value}
                onChange={e => { setValue(Number(e.target.value)); setSaved(false) }}
                disabled={saving}
            />
          </div>
          <button
              className={`setting-save-btn${saved ? ' setting-save-btn--saved' : ''}`}
              onClick={handleSave}
              disabled={saving || value === initialValue}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save'}
          </button>
        </div>
      </div>
  )
}

function ActionSetting({
                         setting,
                         selectedGuildId,
                       }: {
  setting: Setting
  selectedGuildId: string
}) {
  const [userId, setUserId] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const isDangerous = setting.style === 'dangerous'

  const handleClick = async () => {
    if (!confirm) { setConfirm(true); return }
    setConfirm(false)
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE}${setting.http.endpoint}`, {
        method: setting.http.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          guildId: selectedGuildId
        }),
        credentials: 'include'
      })

      if (res.ok) {
        setDone(true)
        setTimeout(() => setDone(false), 2000)
        setUserId('')
      } else {
        alert('Action failed')
      }
    } catch (e) {
      console.error(e)
      alert('Error executing action')
    } finally {
      setLoading(false)
    }
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
              disabled={loading}
          />
          <button
              className={`setting-action-btn${isDangerous ? ' setting-action-btn--dangerous' : ''}${done ? ' setting-action-btn--done' : ''}`}
              onClick={handleClick}
              disabled={!userId.trim() || loading}
          >
            {loading ? 'Processing...' : done ? '✓ Done' : confirm ? 'Confirm?' : setting.label[LANG]}
          </button>
        </div>
      </div>
  )
}

function SettingControl({
                          setting,
                          initialValue,
                          selectedGuildId,
                          onSaveSuccess,
                        }: {
  setting: Setting
  initialValue: any
  selectedGuildId: string
  onSaveSuccess: (id: string, val: any) => void
}) {
  if (setting.type === 'select') {
    return (
        <SelectSetting
            setting={setting}
            initialValue={initialValue}
            selectedGuildId={selectedGuildId}
            onSaveSuccess={onSaveSuccess}
        />
    )
  }
  if (setting.type === 'number') {
    return (
        <NumberSetting
            setting={setting}
            initialValue={Number(initialValue)}
            selectedGuildId={selectedGuildId}
            onSaveSuccess={onSaveSuccess}
        />
    )
  }
  if (setting.type === 'action') {
    return (
        <ActionSetting
            setting={setting}
            selectedGuildId={selectedGuildId}
        />
    )
  }
  return null
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ModulesPage() {
  const [active, setActive] = useState(modules[0].key)
  const [user, setUser] = useState<DiscordUser | null>(null)
  const [guilds, setGuilds] = useState<DiscordGuild[]>([])
  const [selectedGuild, setSelectedGuild] = useState<DiscordGuild | null>(null)
  const [settings, setSettings] = useState<Record<string, any> | null>(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const current = modules.find(m => m.key === active)!
  const data = settingsData[current.key]

  // 1. Fetch User and Guilds on Mount
  useEffect(() => {
    setLoading(true)
    fetch(AUTH.me, { credentials: 'include' })
        .then(r => r.ok ? r.json() : null)
        .then(userData => {
          setUser(userData)
          if (userData) {
            fetch(AUTH.guilds, { credentials: 'include' })
                .then(r => r.ok ? r.json() : [])
                .then(guildsData => {
                  setGuilds(guildsData)

                  // Filter manageable guilds
                  const manageable = guildsData.filter((g: DiscordGuild) => {
                    if (g.owner) return true
                    try {
                      const perm = BigInt(g.permissions)
                      return (perm & 0x8n) === 0x8n || (perm & 0x20n) === 0x20n
                    } catch {
                      return false
                    }
                  })

                  if (manageable.length > 0) {
                    const savedId = localStorage.getItem('owlbot_guild_id')
                    const saved = manageable.find((g: DiscordGuild) => g.id === savedId)
                    setSelectedGuild(saved ?? manageable[0])
                  } else {
                    setLoading(false)
                  }
                })
                .catch(() => {
                  setGuilds([])
                  setLoading(false)
                })
          } else {
            setLoading(false)
          }
        })
        .catch(() => {
          setUser(null)
          setLoading(false)
        })
  }, [])

  // 2. Fetch or Init Guild Settings when Selected Guild changes
  useEffect(() => {
    if (!selectedGuild) {
      setSettings(null)
      return
    }

    setLoading(true)
    fetch(`${AUTH.settings}?guildId=${selectedGuild.id}`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw new Error('Need init')
          return res.json()
        })
        .then(data => {
          setSettings(data)
          setLoading(false)
        })
        .catch(() => {
          // Initialize settings with defaults
          fetch(AUTH.settings, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              guildId: selectedGuild.id,
              namingType: 'nickname',
              bitrate: 64000,
              usersLimit: 0,
              experienceMultiplier: 1.0
            }),
            credentials: 'include'
          })
              .then(res => res.ok ? res.json() : null)
              .then(data => {
                if (data) {
                  setSettings(data)
                }
                setLoading(false)
              })
              .catch(err => {
                console.error('Failed to init settings:', err)
                setLoading(false)
              })
        })
  }, [selectedGuild])

  const handleLogin = () => {
    openAuthPopup(() => {
      window.location.reload()
    })
  }

  // Manageable guilds filter
  const manageableGuilds = guilds.filter(g => {
    if (g.owner) return true
    try {
      const perm = BigInt(g.permissions)
      return (perm & 0x8n) === 0x8n || (perm & 0x20n) === 0x20n
    } catch {
      return false
    }
  })

  // Map setting ID to local settings state property
  const getSettingValue = (id: string, def: any) => {
    if (!settings) return def
    switch (id) {
      case 'name':
        return settings.namingType ?? def
      case 'bitrate':
        return settings.bitrate ?? def
      case 'users-limit':
        return settings.usersLimit ?? def
      case 'multiplier':
        return settings.experienceMultiplier ?? def
      default:
        return def
    }
  }

  const handleSettingUpdate = (id: string, val: any) => {
    if (!settings) return
    const keyMap: Record<string, string> = {
      'name': 'namingType',
      'bitrate': 'bitrate',
      'users-limit': 'usersLimit',
      'multiplier': 'experienceMultiplier'
    }
    const prop = keyMap[id]
    if (prop) {
      setSettings(prev => prev ? { ...prev, [prop]: val } : null)
    }
  }

  // 3. Render Login CTA if not Authenticated
  if (!user && !loading) {
    return (
        <div className="modules-page modules-page--center">
          <div className="unauth-container">
            <div className="unauth-icon">🔒</div>
            <h1 className="unauth-title">Authentication Required</h1>
            <p className="unauth-desc">Please sign in with Discord to access and configure your server's module settings.</p>
            <button className="btn btn-discord btn-unauth-login" onClick={handleLogin}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
              </svg>
              Sign in with Discord
            </button>
          </div>
        </div>
    )
  }

  return (
      <div className="modules-page">
        <aside className="modules-sidebar">
          <div className="sidebar-header">
            <div className="page-tag">// MODULES</div>
          </div>

          {/* Guild Selection Dropdown */}
          {user && manageableGuilds.length > 0 && (
              <div className="guild-selector">
                <button className="guild-selector-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {selectedGuild ? (
                      <>
                        {selectedGuild.icon ? (
                            <img
                                src={`https://cdn.discordapp.com/icons/${selectedGuild.id}/${selectedGuild.icon}.png?size=64`}
                                alt={selectedGuild.name}
                                className="guild-icon"
                            />
                        ) : (
                            <div className="guild-icon-placeholder">
                              {selectedGuild.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                        )}
                        <span className="guild-name">{selectedGuild.name}</span>
                      </>
                  ) : (
                      <span className="guild-placeholder">Select Server</span>
                  )}
                  <span className="guild-chevron" style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>▼</span>
                </button>
                {dropdownOpen && (
                    <div className="guild-dropdown">
                      {manageableGuilds.map(g => (
                          <button
                              key={g.id}
                              className={`guild-dropdown-item${selectedGuild?.id === g.id ? ' guild-dropdown-item--active' : ''}`}
                              onClick={() => {
                                setSelectedGuild(g)
                                localStorage.setItem('owlbot_guild_id', g.id)
                                setDropdownOpen(false)
                              }}
                          >
                            {g.icon ? (
                                <img
                                    src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png?size=64`}
                                    alt={g.name}
                                    className="guild-icon"
                                />
                            ) : (
                                <div className="guild-icon-placeholder">
                                  {g.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                                </div>
                            )}
                            <span className="guild-dropdown-name">{g.name}</span>
                          </button>
                      ))}
                    </div>
                )}
              </div>
          )}

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
          {loading ? (
              <div className="loading-placeholder">
                <div className="spinner" />
                <p>Loading settings...</p>
              </div>
          ) : user && manageableGuilds.length === 0 ? (
              <div className="unauth-container">
                <div className="unauth-icon">🤖</div>
                <h1 className="unauth-title">No Servers Found</h1>
                <p className="unauth-desc">You do not have administrative permissions on any servers, or the bot has not been added to them yet.</p>
                <a href={`https://discord.com/oauth2/authorize?client_id=1234567890&permissions=8&scope=bot`} target="_blank" rel="noopener noreferrer" className="btn btn-discord btn-unauth-login">
                  Invite Bot to Server
                </a>
              </div>
          ) : (
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
                  {data && selectedGuild ? (
                      <div className="settings-list">
                        {data.settings.map(setting => (
                            <SettingControl
                                key={setting.id}
                                setting={setting}
                                initialValue={getSettingValue(setting.id, setting.default)}
                                selectedGuildId={selectedGuild.id}
                                onSaveSuccess={handleSettingUpdate}
                            />
                        ))}
                      </div>
                  ) : (
                      <p className="module-detail-placeholder">Select a server to configure module settings.</p>
                  )}
                </div>
              </div>
          )}
        </main>
      </div>
  )
}
