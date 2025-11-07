import { useMutation, useQuery } from '@tanstack/react-query'
import { loginUser, registerUser } from '~/services/user/userService'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export const useLoginUser = (options = {}) => {
    return useMutation({
        mutationFn: loginUser,
        ...options,
    })
}

export const useRegisterUser = (options = {}) => {
    return useMutation({
        mutationFn: registerUser,
        ...options
    })
}

export const useCurrentUser = () => {
    const userState = useSelector(state => state.user)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (userState && userState.id) setLoading(false)
    }, [userState])

    return {
        user: userState,
        loading,
        isAuthenticated: !!userState.email,
    }
}

export const useUserById = (userId, options = {}) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId, // chỉ chạy query khi có userId
        ...options,
    })
}

// Hook cập nhật thông tin user theo userId
export const useUpdateUserById = (options = {}) => {
    return useMutation({
        mutationFn: ({ userId, data }) => updateUserById(userId, data),
        ...options,
    })
}