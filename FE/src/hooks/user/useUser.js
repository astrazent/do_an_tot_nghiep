import { useMutation, useQuery } from '@tanstack/react-query'
import { loginUser, registerUser } from '~/services/user/userService'

export const useLoginUser = () => {
    return useMutation({
        mutationFn: loginUser,
    })
}

export const useRegisterUser = () => {
    return useMutation({
        mutationFn: registerUser,
    })
}
