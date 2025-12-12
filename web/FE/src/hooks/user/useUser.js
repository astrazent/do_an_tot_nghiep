import { useMutation, useQuery } from '@tanstack/react-query'
import {
    loginUser,
    registerUser,
    updateUserById,
    checkPasswordAndUpdate,
} from '~/services/user/userService'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserById } from '~/services/user/userService'
import { loginGoogleApi } from '~/services/user/userService'
import { updateUser } from '~/Redux/reducers/userReducer'

export const useLoginUser = (options = {}) => {
    return useMutation({
        mutationFn: loginUser,
        ...options,
    })
}

export const useRegisterUser = (options = {}) => {
    return useMutation({
        mutationFn: registerUser,
        ...options,
    })
}

export const useLoginGoogle = ({ onSuccess, onError }) => {
    return useMutation({
        mutationFn: loginGoogleApi,
        onSuccess,
        onError,
    })
}

export const useCurrentUser = () => {
    const userState = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(true)

    const fetchUser = async () => {
        if (!userState.user_id) return setLoading(false)
        setLoading(true)
        try {
            const res = await getUserById(userState.user_id)
            dispatch(
                updateUser({
                    ...res.data,
                    expire_date: Date.now() + 5 * 60 * 1000,
                })
            )
        } catch (error) {
            console.error('Failed to fetch user:', error)
            dispatch(updateUser({}))
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const isExpired =
            !userState.expire_date || userState.expire_date < Date.now()
        if (!userState.user_id || isExpired) fetchUser()
        else setLoading(false)
    }, [userState, dispatch])

    return {
        user: userState,
        loading,
        isAuthenticated: !!userState.email,
        refetchUser: fetchUser,
    }
}

export const useUserById = (userId, options = {}) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
        ...options,
    })
}

export const useUpdateUserById = (options = {}) => {
    return useMutation({
        mutationFn: ({ userId, data }) => updateUserById(userId, data),
        ...options,
    })
}

export const useCheckPasswordAndUpdate = (options = {}) => {
    return useMutation({
        mutationFn: data => checkPasswordAndUpdate(data),
        ...options,
    })
}
