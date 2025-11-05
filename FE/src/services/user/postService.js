import api from './api'

export const getPosts = async ({ limit = 10, offset = 0, sort = 'newest' } = {}) => {
    try {
        const response = await api.get('/post/list', {
            params: { limit, offset, sort },
        })
        console.log("a",response);
        return response.data.data || []
    } catch (error) {
        console.error('Lỗi khi tải danh sách bài viết:', error)
        throw error
    }
}

export const getPostsBySlug = async ({ slug = '', limit = 10, offset = 0, sort = 'newest' } = {}) => {
    try {
        const response = await api.get('/post/by_slug', {
            params: { slug, limit, offset, sort },
        })
        return response.data.data || []
    } catch (error) {
        console.error('Lỗi khi tải danh sách bài viết theo slug:', error)
        throw error
    }
}

export const getPostsByPostTypeSlug = async ({ slug = '', limit = 10, offset = 0, sort = 'newest' } = {}) => {
    try {
        const response = await api.get('/post/by_post_type_slug', {
            params: { slug, limit, offset, sort },
        })
        return response.data.data || []
    } catch (error) {
        console.error('Lỗi khi tải danh sách bài viết theo PostTypeSlug:', error)
        throw error
    }
}

export const getPostsByCategorySlug = async ({ slug = '', limit = 10, offset = 0, sort = 'newest' } = {}) => {
    try {
        const response = await api.get('/post/by_category_slug', {
            params: { slug, limit, offset, sort },
        })
        return response.data.data || []
    } catch (error) {
        console.error('Lỗi khi tải danh sách bài viết theo CategorySlug:', error)
        throw error
    }
}

export const getRelatedPostsBySlug = async ({ slug = '', limit = 5, offset = 0 } = {}) => {
    if (!slug) return { relatedByCategory: [], relatedByPostType: [] }

    try {
        const response = await api.get('/post/related_by_slug', {
            params: { slug, limit, offset },
        })

        // API trả về object { relatedByCategory, relatedByPostType }
        return response.data.data || { relatedByCategory: [], relatedByPostType: [] }
    } catch (error) {
        console.error('Lỗi khi tải bài viết liên quan theo slug:', error)
        throw error
    }
}