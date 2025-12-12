import axios from 'axios'
const api = axios.create({
    baseURL: import.meta.env.VITE_API_CHATBOT || 'http://localhost:8000',
    withCredentials: true,
})

api.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config
        const backendRefreshURL = `${import.meta.env.VITE_API_BACKEND}/auth/refresh`

        if (original.url.includes('/auth/refresh')) return Promise.reject(err)

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true
            try {
                await axios.post(
                    backendRefreshURL,
                    {},
                    { withCredentials: true }
                )
                return api(original)
            } catch {
                console.log('refresh token từ backend thất bại')
            }
        }

        return Promise.reject(err)
    }
)

export default api
