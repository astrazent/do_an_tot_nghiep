import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
    getAllDiscountProducts, 
    createDiscountProduct, 
    deleteDiscountProduct 
} from '~/services/admin/discountProductService'

export const useAllDiscountProducts = () => {
    return useQuery({
        queryKey: ['discountProducts', 'all'],
        queryFn: getAllDiscountProducts,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 5,
    })
}

export const useCreateDiscountProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createDiscountProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['discountProducts', 'all'])
        },
    })
}

export const useDeleteDiscountProduct = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteDiscountProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(['discountProducts', 'all'])
        },
    })
}
