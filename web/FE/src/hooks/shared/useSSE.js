import { useEffect } from 'react'

export const useSSE = callback => {
    useEffect(() => {
        let baseUrl = import.meta.env.VITE_API_BACKEND

        baseUrl = baseUrl.replace(/\/v1$/, '')

        const es = new EventSource(`${baseUrl}/sse`)

        es.onmessage = e => {
            try {
                const data = JSON.parse(e.data)
                callback(data)
            } catch {
                console.warn('SSE parse error:', e.data)
            }
        }

        return () => es.close()
    }, [])
}
