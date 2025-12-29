import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllDiscount, createDiscount, deleteDiscount } from '~/services/admin/discountService'

export const useAllDiscounts = () => {
    return useQuery({
        queryKey: ['discounts', 'all'],
        queryFn: getAllDiscount,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 5,
    })
}

export const useCreateDiscount = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createDiscount,
        onSuccess: () => {
            queryClient.invalidateQueries(['discounts', 'all'])
        },
    })
}

export const useDeleteDiscount = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteDiscount,
        onSuccess: () => {
            queryClient.invalidateQueries(['discounts', 'all'])
        },
    })
}
