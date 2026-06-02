import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.PROD
    ? 'https://api.owlvision.app'
    : ''

export default function AuthCallback() {
    const [status, setStatus] = useState('Authorization in progress...')

    useEffect(() => {
        // Получаем параметры из URL
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')
        const state = params.get('state')

        if (!code || !state) {
            setStatus('Invalid authorization parameters. Closing...')
            setTimeout(() => window.close(), 1500)
            return
        }

        // Отправляем POST запрос с кодом и стейтом на бэкенд
        fetch(`${API_BASE}/v3/discord/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state }),
            credentials: 'include', // Обязательно, чтобы бэкенд поставил куки сессии
        })
            .then((res) => {
                if (!res.ok) throw new Error('Backend authorization failed')

                setStatus('Authorization complete. Closing...')

                // Сообщаем главному окну, что всё прошло успешно
                if (window.opener) {
                    window.opener.postMessage('AUTH_SUCCESS', window.location.origin)
                }

                // Закрываем popup с небольшой задержкой для визуала
                setTimeout(() => window.close(), 500)
            })
            .catch((err) => {
                console.error('Login error:', err)
                setStatus('Authorization failed. Closing...')
                setTimeout(() => window.close(), 2000)
            })
    }, [])

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
            {status}
        </div>
    )
}