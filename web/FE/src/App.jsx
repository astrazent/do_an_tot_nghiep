import { useRoutes } from 'react-router-dom'
import { routes } from './routes'
import { useAuth } from '~/hooks/user/useAuth'
import GlobalSSEHandler from '~/components/shared/GlobalSSEHandler'

function App() {
    const { authLoading } = useAuth()

    const route = useRoutes(routes)

    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        )
    }

    return (
        <>
            <GlobalSSEHandler />
            {route}
        </>
    )
}

export default App
