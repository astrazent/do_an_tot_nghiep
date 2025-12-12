import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import {
    createConversation,
    endConversation,
    getConversations,
    createMessage,
    deleteConversation,
} from '~/services/user/chatBotService'

export const useGetConversations = () => {
    return useQuery({
        queryKey: ['conversations'],
        queryFn: () => getConversations(),
        staleTime: 1000 * 60,
        onError: error => console.error('❌ Lỗi khi lấy conversation:', error),
    })
}

export const useCreateConversation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: title => createConversation(title),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
        },
        onError: error => console.error('❌ Lỗi khi tạo conversation:', error),
    })
}

export const useEndConversation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: conversationId => endConversation(conversationId),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
        },
        onError: error =>
            console.error('❌ Lỗi khi kết thúc conversation:', error),
    })
}

export const useCreateMessage = conversationId => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: content => createMessage(conversationId, content),
        onMutate: async content => {
            const queryKey = ['conversation-messages', conversationId]
            await queryClient.cancelQueries({ queryKey })
            const previousMessages = queryClient.getQueryData(queryKey)
            queryClient.setQueryData(queryKey, old => [
                ...(old || []),
                { content, status: 'pending' },
            ])
            return { previousMessages }
        },
        onSuccess: data => {
            const queryKey = ['conversation-messages', conversationId]
            queryClient.setQueryData(queryKey, old => [...(old || []), data])
        },
        onError: (error, variables, context) => {
            const queryKey = ['conversation-messages', conversationId]
            if (context?.previousMessages) {
                queryClient.setQueryData(queryKey, context.previousMessages)
            }
            console.error('❌ Lỗi khi tạo message:', error)
        },
        onSettled: () => {
            const queryKey = ['conversation-messages', conversationId]
            queryClient.invalidateQueries({ queryKey })
        },
    })
}

export const useDeleteConversation = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: conversationId => deleteConversation(conversationId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
        },
        onError: error => console.error('❌ Lỗi khi xóa conversation:', error),
    })
}
