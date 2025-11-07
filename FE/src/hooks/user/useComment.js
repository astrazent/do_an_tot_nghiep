import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getCommentsByProductSlug,
    updateCommentById,
} from '~/services/user/commentService'
import { useParams } from 'react-router-dom'

export const useCommentsByProductSlug = slug => {
    return useQuery({
        queryKey: ['comments', 'by_slug', slug],
        queryFn: () => getCommentsByProductSlug(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 3,
    })
}

export const useUpdateComment = slugParam => {
    const queryClient = useQueryClient()
    const { slug: slugFromParams } = useParams()
    const slug = slugParam || slugFromParams
    return useMutation({
        mutationFn: ({ commentId, data }) => updateCommentById(commentId, data),

        onMutate: async ({ commentId, data }) => {
            const queryKey = ['comments', 'by_slug', slug]

            await queryClient.cancelQueries({ queryKey })

            const previousCommentsData = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, oldData => {
                if (!oldData) return oldData

                const updateLogic = comment =>
                    comment.id === commentId ? { ...comment, ...data } : comment

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
            if (context?.previousCommentsData) {
                const queryKey = ['comments', 'by_slug', slug]
                queryClient.setQueryData(queryKey, context.previousCommentsData)
            }
            console.error('Cập nhật comment thất bại:', err)
        },

        onSettled: () => {
            const queryKey = ['comments', 'by_slug', slug]
            queryClient.invalidateQueries({ queryKey })
        },
    })
}
