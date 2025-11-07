import api from './api'

export const updateCommentReaction = async reactionData => {
    if (
        !reactionData ||
        !reactionData.user_id ||
        !reactionData.product_id ||
        !reactionData.comment_id ||
        !reactionData.reaction
    ) {
        console.error('Dữ liệu reaction không hợp lệ')
        throw new Error('Dữ liệu reaction không hợp lệ')
    }

    try {
        const response = await api.post('/reactions/', reactionData)

        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi cập nhật reaction:',
            error.response ? error.response.data : error.message
        )

        throw error
    }
}

export const getCommentReactionsProduct = async ({ user_id, product_id }) => {
    if (!user_id || !product_id) {
        throw new Error('Thiếu thông tin cần thiết để lấy reaction')
    }

    try {
        const response = await api.get('/reactions/by_product', {
            params: { user_id, product_id },
        })
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi lấy chi tiết reaction:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}
