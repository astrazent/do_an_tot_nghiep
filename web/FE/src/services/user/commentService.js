import api from './api'

export const getCommentsByProductSlug = async slug => {
    if (!slug) return []

    try {
        const response = await api.get(`/comments/by_product_slug?slug=${slug}`)
        return response.data.data || []
    } catch (error) {
        console.error('Lỗi khi tải bình luận cho sản phẩm:', error)
        throw error
    }
}

export const updateCommentById = async (commentId, data) => {
    if (!commentId) throw new Error('commentId không được để trống')

    try {
        const response = await api.patch(
            `/comments/?commentId=${commentId}`,
            data
        )
        return response.data
    } catch (error) {
        console.error(`Lỗi khi cập nhật comment ${commentId}:`, error)
        throw error
    }
}

export const createComment = async data => {
    if (!data) throw new Error('Dữ liệu bình luận không được để trống')

    try {
        const response = await api.post('/comments/', data)
        return response.data
    } catch (error) {
        console.error('Lỗi khi tạo bình luận:', error)
        throw error
    }
}

export const createCommentByProductSlug = async data => {
    if (!data) throw new Error('Dữ liệu bình luận không được để trống')

    try {
        const response = await api.post('/comments/by_product_slug', data)
        return response.data
    } catch (error) {
        console.error('Lỗi khi tạo bình luận theo product slug:', error)
        throw error
    }
}

export const getCommentByUserIdAndSlug = async (user_id, slug) => {
    if (!user_id || !slug)
        throw new Error('user_id và slug không được để trống')

    try {
        const response = await api.get(
            `/comments/by_user_slug?user_id=${user_id}&slug=${slug}`
        )
        return response.data.data || null
    } catch (error) {
        console.error('Lỗi khi tải comment theo user_id và slug:', error)
        throw error
    }
}

export const updateCommentByProductSlug = async (slug, data) => {
    if (!slug) throw new Error('slug không được để trống')
    if (!data) throw new Error('Dữ liệu cập nhật không được để trống')

    try {
        const response = await api.patch(
            `/comments/by_product_slug?slug=${slug}`,
            data
        )
        return response.data
    } catch (error) {
        console.error(
            `Lỗi khi cập nhật comment cho product slug "${slug}":`,
            error
        )
        throw error
    }
}
