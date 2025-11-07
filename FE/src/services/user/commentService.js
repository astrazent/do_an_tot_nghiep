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
