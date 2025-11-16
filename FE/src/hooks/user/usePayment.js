import { useQuery } from '@tanstack/react-query'
import { getAllActivePayments } from '~/services/user/paymentService'

export const useAllActivePayments = () => {
    return useQuery({
        queryKey: ['payments', 'all'],
        queryFn: getAllActivePayments,
        staleTime: Infinity,
        cacheTime: Infinity,
        retry: 0,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}
