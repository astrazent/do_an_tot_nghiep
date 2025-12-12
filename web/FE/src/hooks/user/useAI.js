import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postCommentAI } from '~/services/user/aiService'
import { useParams } from 'react-router-dom'

export const usePostCommentAI = slugParam => {
    const queryClient = useQueryClient()
    const { slug: slugFromParams } = useParams()
    const slug = slugParam || slugFromParams

    return useMutation({
        mutationFn: comments => postCommentAI(comments),

        onMutate: async comments => {
            const queryKey = ['ai-summary', slug]
            await queryClient.cancelQueries({ queryKey })

            const previousSummary = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, {
                status: 'processing',
                summary: null,
                sentComments: comments,
            })

            return { previousSummary }
        },

        onSuccess: data => {
            const queryKey = ['ai-summary', slug]
            queryClient.setQueryData(queryKey, {
                status: 'success',
                summary: data?.summary || data,
            })
        },

        onError: (error, variables, context) => {
            const queryKey = ['ai-summary', slug]
            if (context?.previousSummary) {
                queryClient.setQueryData(queryKey, context.previousSummary)
            }
            console.error('❌ Lỗi khi gọi AI summary:', error)
        },

        onSettled: () => {
            const queryKey = ['ai-summary', slug]
            queryClient.invalidateQueries({ queryKey })
        },
    })
}
