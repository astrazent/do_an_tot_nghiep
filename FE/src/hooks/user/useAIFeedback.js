import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postAIFeedbackByProductSlug } from '~/services/user/aiFeedbackService'

/**
 * Hook gửi hoặc cập nhật AI Feedback dựa trên product slug
 * @returns {Object} - { mutate, isLoading, isError, data, error }
 */
export const usePostAIFeedbackByProductSlug = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postAIFeedbackByProductSlug,
        onSuccess: (data, variables) => {
            // variables là body mà bạn gửi: { vote, voter_id, id, slug }
            console.log('Feedback mới tạo hoặc cập nhật:', data)
            queryClient.invalidateQueries(['ai_feedback', 'by_product_slug', variables.slug])
        },
        onError: (error) => {
            console.error('Lỗi khi gửi AI Feedback:', error)
        },
    })
}