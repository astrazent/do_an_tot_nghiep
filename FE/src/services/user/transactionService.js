import api from './api'

export const createTransaction = async transactionData => {
    try {
        const response = await api.post('/transaction', transactionData)
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi tạo transaction:', error)
        throw error
    }
}

export const getTransactionsByUser = async user_id => {
    try {
        const response = await api.get('/transaction/by_user', {
            params: { user_id },
        })
        return response.data.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy transactions của user:', error)
        throw error
    }
}

export const getTransactionByEmailAndSlug = async (email, slug) => {
    try {
        const response = await api.get('/transaction/by_email_slug', {
            params: { email, slug },
        })
        return response.data.data
    } catch (error) {
        console.error(
            'Đã xảy ra lỗi khi lấy transaction theo email và slug:',
            error
        )
        throw error
    }
}

export const deleteTransactionByUserAndTrackingNumber = async (
    user_id,
    tracking_number
) => {
    try {
        const response = await api.delete(
            '/transaction/by_user_tracking_number',
            {
                params: { user_id, tracking_number },
            }
        )
        return response.data.data
    } catch (error) {
        console.error(
            'Đã xảy ra lỗi khi lấy transaction theo user và tracking number:',
            error
        )
        throw error
    }
}
