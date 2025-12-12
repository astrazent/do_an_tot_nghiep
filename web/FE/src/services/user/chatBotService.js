import api from './apiChatBot'

export const createConversation = async title => {
    if (!title || typeof title !== 'string') {
        console.error('Tiêu đề conversation không hợp lệ!')
        throw new Error('Tiêu đề conversation không hợp lệ!')
    }

    try {
        const response = await api.post(
            '/conversations',
            { title },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi tạo conversation:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

export const endConversation = async conversationId => {
    if (!conversationId || typeof conversationId !== 'number') {
        console.error('conversationId không hợp lệ!')
        throw new Error('conversationId không hợp lệ!')
    }

    try {
        const response = await api.put(
            '/conversations/end',
            { conversation_id: conversationId },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi kết thúc conversation:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

export const getConversations = async () => {
    try {
        const response = await api.get('/conversations', {
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi lấy danh sách conversation:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

export const createMessage = async (conversationId, content) => {
    if (!conversationId || typeof conversationId !== 'number') {
        console.error('conversationId không hợp lệ!')
        throw new Error('conversationId không hợp lệ!')
    }

    if (!content || typeof content !== 'string') {
        console.error('Nội dung message không hợp lệ!')
        throw new Error('Nội dung message không hợp lệ!')
    }

    try {
        const response = await api.post(
            '/conversations/messages',
            {
                conversation_id: conversationId,
                content,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi tạo message:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

export const deleteConversation = async conversationId => {
    if (!conversationId || typeof conversationId !== 'number') {
        console.error('conversationId không hợp lệ!')
        throw new Error('conversationId không hợp lệ!')
    }

    try {
        const response = await api.delete('/conversations', {
            headers: {
                'Content-Type': 'application/json',
            },
            params: { conversation_id: conversationId },
        })
        return response.data
    } catch (error) {
        console.error(
            'Lỗi khi xóa conversation:',
            error.response ? error.response.data : error.message
        )
        throw error
    }
}
