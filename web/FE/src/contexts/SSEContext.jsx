import { createContext, useEffect, useState } from 'react'

export const SSEContext = createContext(null)

export function SSEProvider({ children }) {
    const [message, setMessage] = useState(null)

    useEffect(() => {
        let baseUrl = import.meta.env.VITE_API_BACKEND
        baseUrl = baseUrl.replace(/\/v1$/, '')

        const es = new EventSource(`${baseUrl}/sse`)

        es.onmessage = e => {
            try {
                setMessage(JSON.parse(e.data))
            } catch {
                console.warn('SSE parse error:', e.data)
            }
        }

        es.onerror = err => {
            console.warn('SSE error:', err)
        }

        return () => es.close()
    }, [])

    return <SSEContext.Provider value={message}>{children}</SSEContext.Provider>
}
