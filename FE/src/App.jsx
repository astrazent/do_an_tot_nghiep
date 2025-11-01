import { useRoutes } from 'react-router-dom'
import { routes } from './routes'
import { useAuth } from '~/hooks/user/useAuth'

function App() {
    const { authLoading } = useAuth()

    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        )
    }

    return useRoutes(routes)
}

export default App
