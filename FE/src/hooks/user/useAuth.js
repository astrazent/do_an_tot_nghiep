import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { updateUser, remoteUser } from '~/Redux/reducers/userReducer'
const API = import.meta.env.VITE_API_BACKEND
export const useAuth = () => {
    const dispatch = useDispatch()
    const userState = useSelector(state => state.user)

    useEffect(() => {
        const authAxios = axios.create({
            baseURL: `${API}`,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })

        authAxios
            .get('/user')
            .then(res => {
                console.log('User data:', res.data)
                dispatch(
                    updateUser({
                        full_name: res.data.fullName || res.data.full_name,
                        phone: res.data.phone,
                        email: res.data.email,
                        token: res.data.token || userState.token,
                    })
                )
            })
            .catch(error => {
                console.error(
                    'Auth check failed:',
                    error.response?.data || error.message
                )
                dispatch(remoteUser())
            })
    }, [dispatch, userState.token])

    return {
        user: {
            fullName: userState.fullName || '',
            phone: userState.phone || '',
            email: userState.email || '',
        },
        isAuthenticated: !!userState.token,
    }
}
