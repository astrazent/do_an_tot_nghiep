import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '~/services/user/api'
import { updateUser, removeUser } from '~/Redux/reducers/userReducer'

export const useAuth = () => {
    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)
    const [authLoading, setAuthLoading] = useState(true)
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get('/auth/verify')
                console.log('get: ', res.data)
            } catch {
                dispatch(removeUser())
            } finally {
                setAuthLoading(false)
            }
        }
        checkAuth()
    }, [dispatch])

    return {
        authLoading,
        user: userState,
        isAuthenticated: !!userState.email,
    }
}
