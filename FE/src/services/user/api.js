import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BACKEND || 'http://localhost:2003/v1',
    withCredentials: true, // để HttpOnly cookie tự gửi
})

api.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config

        if (original.url.includes('/auth/refresh')) return Promise.reject(err)

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true
            try {
                await api.post('/auth/refresh')
                return api(original)
            } catch {
                console.log("lấy refresh token thất bại");
            }
        }

        return Promise.reject(err)
    }
)

export default api
