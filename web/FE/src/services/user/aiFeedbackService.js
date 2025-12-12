import api from './api'

export const postAIFeedbackByProductSlug = async feedback => {
    const { vote, voter_id, slug, id } = feedback

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
        const response = await api.post(
            '/ai_feedback/create_or_update',
            feedback,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi gửi AI Feedback:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}
