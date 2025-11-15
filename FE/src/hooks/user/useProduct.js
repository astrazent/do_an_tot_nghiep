import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import {
    getNewestProducts,
    getPoultryProducts,
    getSeafoodAndFishProducts,
    getPorkSpecialties,
    getProductBySlug,
    getCommentsByProductSlug,
    getListProductCollections,
    getListPromotionProducts,
    searchProducts,
    searchProductsByCategory,
    getHotProducts,
    getRelatedProducts,
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

export const useInfiniteProductCollections = ({
    slug = 'all',
    limit = 10,
    sort = 'newest',
    minPrice = null,
    maxPrice = null,
} = {}) => {
    return useInfiniteQuery({
        queryKey: [
            'products',
            'collections',
            slug,
            limit,
            sort,
            minPrice,
            maxPrice,
        ],

        queryFn: async ({ pageParam = 0 }) => {
            const response = await getListProductCollections({
                slug: slug !== 'all' ? slug : undefined,
                limit,
                offset: pageParam,
                sort,
                minPrice,
                maxPrice,
            })
            return response
        },

        staleTime: 1000 * 60 * 10,

        getNextPageParam: (lastPage, allPages) => {
            const fetchedItemsCount = lastPage?.data?.length || 0
            if (fetchedItemsCount < limit) return undefined

            return allPages.reduce(
                (acc, page) => acc + (page?.data?.length || 0),
                0
            )
        },
    })
}

export const useInfinitePromotionProducts = ({
    limit = 10,
    sort = 'newest',
    minPrice = null,
    maxPrice = null,
} = {}) => {
    return useInfiniteQuery({
        queryKey: ['products', 'promotion', limit, sort, minPrice, maxPrice],

        queryFn: async ({ pageParam = 0 }) => {
            const response = await getListPromotionProducts({
                limit,
                offset: pageParam,
                sort,
                minPrice,
                maxPrice,
            })
            return response
        },

        staleTime: 1000 * 60 * 10,

        getNextPageParam: (lastPage, allPages) => {
            const fetchedItemsCount = lastPage?.data?.length || 0
            if (fetchedItemsCount < limit) return undefined

            return allPages.reduce(
                (acc, page) => acc + (page?.data?.length || 0),
                0
            )
        },
    })
}

export const useInfiniteSearchProductsByCategory = ({
    slug,
    keyword = '',
    limit = 10,
} = {}) => {
    return useInfiniteQuery({
        queryKey: ['products', 'searchByCategory', slug, keyword, limit],

        queryFn: async ({ pageParam = 0 }) => {
            const response = await searchProductsByCategory(
                slug,
                keyword,
                limit,
                pageParam
            )
            return response
        },

        staleTime: 1000 * 60 * 10,

        getNextPageParam: (lastPage, allPages) => {
            const fetchedItemsCount = lastPage?.length || 0
            if (fetchedItemsCount < limit) return undefined

            return allPages.reduce((acc, page) => acc + (page?.length || 0), 0)
        },

        enabled: !!slug,
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

export const useHotProducts = (limit = 6) => {
    return useQuery({
        queryKey: ['products', 'hot', limit],
        queryFn: () => getHotProducts(limit),
        staleTime: Infinity,
        cacheTime: Infinity,
    })
}

export const useSearchProducts = (slug, limit = 10) => {
    return useQuery({
        queryKey: ['products', 'search', slug, limit],
        queryFn: () => searchProducts(slug, limit),
        enabled: !!slug,
        staleTime: Infinity,
        cacheTime: Infinity,
    })
}

export const usePromotionProducts = (limit = 3) => {
    return useQuery({
        queryKey: ['products', 'promotion', limit],
        queryFn: () =>
            getListProductCollections({
                limit,
                slug: 'all',
                sort: 'promotion',
            }),
        staleTime: Infinity,
        cacheTime: Infinity,
    })
}
