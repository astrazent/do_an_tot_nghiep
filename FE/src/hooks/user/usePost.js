import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { getPosts, getPostsByPostTypeSlug, getPostsByCategorySlug, getRelatedPostsBySlug, getPostsBySlug } from '~/services/user/postService'
import api from '~/services/user/api'
export const usePosts = ({ type = 'all', slug = '', limit = 10, offset = 0, sort = 'newest' } = {}) => {
    const queryKey = ['posts', { type, slug, limit, offset, sort }]

    const queryFn = async () => {
        if (type === 'postType') return getPostsByPostTypeSlug({ slug, limit, offset, sort })
        if (type === 'category') return getPostsByCategorySlug({ slug, limit, offset, sort })
        return getPosts({ limit, offset, sort })
    }

    return useQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000,
        keepPreviousData: true,
    })
}

export const useInfinitePosts = ({ sort = 'post_type_limited', limit = 10 } = {}) => {
    return useInfiniteQuery({
        queryKey: ['posts', sort],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await api.get('/post/list', {
                params: { sort, limit, offset: pageParam * limit },
            })
            return response.data.data || []
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === limit ? allPages.length : undefined
        },
    })
}

export const usePostBySlug = (slug, options = {}) => {
    return useQuery({
        queryKey: ['posts', 'by_slug', slug],
        queryFn: () => getPostsBySlug({ slug }),
        enabled: !!slug,
        staleTime: 1000 * 60 * 3, // 3 phút
        ...options,
    })
}

export const useRelatedPostsBySlug = (slug, options = {}) => {
    return useQuery({
        queryKey: ['posts', 'related_by_slug', slug],
        queryFn: () => getRelatedPostsBySlug({ slug }),
        enabled: !!slug,
        staleTime: 1000 * 60 * 3, // 3 phút
        ...options,
    })
}