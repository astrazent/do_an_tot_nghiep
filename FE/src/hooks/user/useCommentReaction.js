import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    updateCommentReaction,
    getCommentReactionsProduct,
} from '~/services/user/commentReactionService'
import { useParams } from 'react-router-dom'

export const useUpdateCommentReaction = (slugParam, options = {}) => {
    const queryClient = useQueryClient()
    const { slug: slugFromParams } = useParams()
    const slug = slugParam || slugFromParams

    return useMutation({
        mutationFn: reactionData => updateCommentReaction(reactionData),

        onMutate: async reactionData => {
            const queryKey = ['comments', 'by_slug', slug]

            await queryClient.cancelQueries({ queryKey })
            const previousCommentsData = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, oldData => {
                if (!oldData) return oldData

                const updateLogic = comment => {
                    if (comment.id === reactionData.comment_id) {
                        const newComment = { ...comment }
                        const oldReaction = newComment.current_user_reaction
                        const newReaction = reactionData.reaction

                        newComment.current_user_reaction = newReaction

                        if (oldReaction === 'like') newComment.like_count--
                        if (oldReaction === 'dislike')
                            newComment.dislike_count--

                        if (newReaction === 'like') newComment.like_count++
                        if (newReaction === 'dislike')
                            newComment.dislike_count++

                        return newComment
                    }
                    return comment
                }

                if (Array.isArray(oldData?.data)) {
                    return { ...oldData, data: oldData.data.map(updateLogic) }
                }
                if (Array.isArray(oldData)) {
                    return oldData.map(updateLogic)
                }
                return oldData
            })

            return { previousCommentsData }
        },

        onError: (err, variables, context) => {
            const queryKey = ['comments', 'by_slug', slug]
            if (context?.previousCommentsData) {
                queryClient.setQueryData(queryKey, context.previousCommentsData)
            }
            console.error('Cập nhật reaction thất bại:', err)

            options.onError?.(err, variables, context)
        },

        onSettled: (data, error, variables, context) => {
            const queryKey = ['comments', 'by_slug', slug]
            queryClient.invalidateQueries({ queryKey })

            options.onSettled?.(data, error, variables, context)
        },

        onSuccess: (data, variables, context) => {
            console.log('✅ Mutation success trong hook', data)

            options.onSuccess?.(data, variables, context)
        },
    })
}

export const useCommentReactions = ({ user_id, product_id }, options = {}) => {
    const queryKey = ['comment-reactions', user_id, product_id]

    return useQuery({
        queryKey,
        queryFn: () => getCommentReactionsProduct({ user_id, product_id }),
        staleTime: 1000 * 60 * 2,
        ...options,
    })
}
