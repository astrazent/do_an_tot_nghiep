import api from './api'

/**
 * Gửi hoặc cập nhật AI Feedback dựa trên product slug
 * @param {Object} feedback - Dữ liệu feedback
 * @param {number} feedback.vote - 0 hoặc 1
 * @param {number|null} feedback.voter_id - ID người vote hoặc null
 * @param {number|null} feedback.id - ID feedback nếu update, null nếu tạo mới
 * @param {string} feedback.slug - slug sản phẩm
 */
export const postAIFeedbackByProductSlug = async feedback => {
    const { vote, voter_id, slug, id } = feedback

    // 1️⃣ Validate dữ liệu
    if (typeof vote !== 'number') {
        throw new Error('Vote không hợp lệ! Phải là number.')
    }

    if (voter_id !== null && typeof voter_id !== 'number') {
        throw new Error('Voter ID không hợp lệ! Phải là number hoặc null.')
    }

    if (id !== null && typeof id !== 'number') {
        throw new Error('ID không hợp lệ! Phải là number hoặc null.')
    }

    if (typeof slug !== 'string' || !slug.trim()) {
        throw new Error('Slug không hợp lệ hoặc để trống!')
    }

    try {
        // 2️⃣ Gọi API create_or_update
        const response = await api.post(
            '/ai_feedback/create_or_update',
            feedback,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        console.log(response);
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi gửi AI Feedback:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}
