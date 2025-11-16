import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getCartItemsByUser,
    updateCartItem,
    addCartItem,
    deleteCartItem,
} from '~/services/user/cartItemService'

export const useCartItemsByUser = userId => {
    return useQuery({
        queryKey: ['cart', userId],
        queryFn: () => getCartItemsByUser(userId),
        enabled: !!userId,
        staleTime: Infinity,
        cacheTime: Infinity,
    })
}

export const useAddCartItem = userId => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ productId, quantity }) =>
            addCartItem(userId, productId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart', userId])
        },
    })
}

export const useUpdateCartItem = userId => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ productId, quantity, priceTotal }) =>
            updateCartItem(userId, productId, quantity, priceTotal),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart', userId])
        },
    })
}

export const useDeleteCartItem = userId => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: cartItemId => deleteCartItem(cartItemId),
        onSuccess: () => {
            queryClient.invalidateQueries(['cart', userId])
        },
    })
}
