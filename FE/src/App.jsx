import { useEffect } from 'react'
import { useNavigate, useRoutes } from 'react-router-dom'
import { routes } from './routes'

function App() {
    const navigate = useNavigate()
    const tokenAdmin = document.cookie.includes('token')

    useEffect(() => {
        const isAdminRoute = window.location.pathname.startsWith('/admin')
        if (
            isAdminRoute &&
            !tokenAdmin &&
            window.location.pathname !== '/admin/login'
        ) {
            navigate('/admin/login')
        }
    }, [tokenAdmin, navigate])

    return useRoutes(routes)
}

export default App
