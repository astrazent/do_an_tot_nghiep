import { Outlet } from 'react-router-dom'
import { useAuth } from '~/hooks/user/useAuth'
import GAListener from '~/components/shared/GAListener'

const UserLayout = () => {
    const { authLoading } = useAuth()

    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Đang tải...</div>
            </div>
        )
    }

    return (
        <>
            <GAListener />
            <Outlet />
        </>
    )
}

export default UserLayout