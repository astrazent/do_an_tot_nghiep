import { useMutation, useQuery } from '@tanstack/react-query'
import {
    createTransaction,
    getTransactionsByUser,
    getTransactionByEmailAndSlug,
} from '~/services/user/transactionService'

export const useCreateTransaction = (options = {}) => {
    return useMutation({
        mutationFn: transactionData => createTransaction(transactionData),
        ...options,
    })
}

export const useTransactionsByUser = (user_id, options = {}) => {
    return useQuery({
        queryKey: ['transactions', user_id],
        queryFn: () => getTransactionsByUser(user_id),
        enabled: !!user_id,
        staleTime: 0,
        refetchOnMount: true,
        ...options,
    })
}

export const useTransactionByEmailAndSlug = (email, slug, options = {}) => {
    return useQuery({
        queryKey: ['transaction', email, slug],
        queryFn: () => getTransactionByEmailAndSlug(email, slug),
        enabled: !!email && !!slug,
        ...options,
    })
}
