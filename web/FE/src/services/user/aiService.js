import api from './api'

export const postCommentAI = async comments => {
    if (!Array.isArray(comments) || comments.length === 0) {
        console.error('Danh sách bình luận không hợp lệ!')
        throw new Error('Danh sách bình luận không hợp lệ!')
    }

    try {
        const response = await api.post('/ai/summary_comment', comments, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi gọi API tóm tắt AI:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}
