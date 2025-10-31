import { useQuery } from '@tanstack/react-query'
import {
    getNewestProducts,
    getPoultryProducts,
    getSeafoodAndFishProducts,
    getPorkSpecialties,
    getProductBySlug,
    getCommentsByProductSlug,
    getAllProductCollections,
    getRelatedProducts,
    searchProductsByCategoryAndPrice,
} from '~/services/user/productService'

export const useNewestProducts = (limit = 8) => {
    return useQuery({
        queryKey: ['products', 'newest', limit],
        queryFn: () => getNewestProducts(limit),
        staleTime: 1000 * 60 * 5,
    })
}

export const usePoultryProducts = (limitPerCategory = 4) => {
    return useQuery({
        queryKey: ['products', 'poultry', limitPerCategory],
        queryFn: () => getPoultryProducts(limitPerCategory),
        staleTime: 1000 * 60 * 5,
    })
}

export const useSeafoodAndFishProducts = (limitPerCategory = 4) => {
    return useQuery({
        queryKey: ['products', 'seafood-fish', limitPerCategory],
        queryFn: () => getSeafoodAndFishProducts(limitPerCategory),
        staleTime: 1000 * 60 * 5,
    })
}

export const usePorkSpecialties = (limit = 6) => {
    return useQuery({
        queryKey: ['products', 'pork', limit],
        queryFn: () => getPorkSpecialties(limit),
        staleTime: 1000 * 60 * 5,
    })
}

export const useAllProductCollections = () => {
    return useQuery({
        queryKey: ['products', 'collections'],
        queryFn: getAllProductCollections,
        staleTime: 1000 * 60 * 10,
    })
}

export const useProductBySlug = slug => {
    return useQuery({
        queryKey: ['product', 'by-slug', slug],
        queryFn: () => getProductBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    })
}

export const useCommentsByProductSlug = slug => {
    return useQuery({
        queryKey: ['comments', 'by-slug', slug],
        queryFn: () => getCommentsByProductSlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 3,
    })
}

export const useRelatedProducts = (productId, limit = 8) => {
    return useQuery({
        queryKey: ['products', 'related', productId, limit],

        queryFn: () => getRelatedProducts(productId, limit),

        enabled: !!productId,
        staleTime: 1000 * 60 * 5,
    })
}

export const useSearchProductsByCategoryAndPrice = params => {
    console.log('HOOK CALLED WITH PARAMS:', params)

    return useQuery({
        queryKey: ['products', 'search', params],
        queryFn: async () => {
            console.log('FETCHING DATA...')
            const res = await searchProductsByCategoryAndPrice(params)
            console.log('API RESPONSE:', res)
            return res
        },
        enabled: !!params?.category,
        staleTime: 1000 * 60 * 5,
    })
}
