import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
    getNewestProducts,
    getPoultryProducts,
    getSeafoodAndFishProducts,
    getPorkSpecialties,
    getProductBySlug,
    getCommentsByProductSlug,
    getAllProductCollections,
    getRelatedProducts,
    searchProductsByCategory,
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

export const useInfiniteProductCollections = ({ limit = 10 } = {}) => {
    return useInfiniteQuery({
        queryKey: ['products', 'collections', limit],

        queryFn: async ({ pageParam = 0 }) => {
            const response = await getAllProductCollections({
                limit,
                offset: pageParam,
            })

            return response
        },

        staleTime: 1000 * 60 * 10,

        getNextPageParam: (lastPage, allPages) => {
            const fetchedItemsCount = lastPage?.data?.length || 0

            if (fetchedItemsCount < limit) {
                return undefined
            }

            return allPages.reduce(
                (acc, page) => acc + (page?.data?.length || 0),
                0
            )
        },
    })
}

export const useProductBySlug = slug => {
    return useQuery({
        queryKey: ['product', 'by_slug', slug],
        queryFn: () => getProductBySlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    })
}

export const useCommentsByProductSlug = slug => {
    return useQuery({
        queryKey: ['comments', 'by_slug', slug],
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

export const useSearchProductsByCategory = (params, options = {}) => {
    return useQuery({
        queryKey: ['products', 'search', params],
        queryFn: async () => {
            const res = await searchProductsByCategory(params)
            return res
        },
        enabled: !!params?.slug,
        staleTime: 1000 * 60 * 5,
        ...options,
    })
}
