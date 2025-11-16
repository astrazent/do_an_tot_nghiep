import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postAIFeedbackByProductSlug } from '~/services/user/aiFeedbackService'

export const usePostAIFeedbackByProductSlug = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: postAIFeedbackByProductSlug,
        onSuccess: (data, variables) => {
            console.log('Feedback mới tạo hoặc cập nhật:', data)
            queryClient.invalidateQueries([
                'ai_feedback',
                'by_product_slug',
                variables.slug,
            ])
        },
        onError: error => {
            console.error('Lỗi khi gửi AI Feedback:', error)
        },
    })
}
