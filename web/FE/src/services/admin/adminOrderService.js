import axios from 'axios'

export const getListTransaction = async data => {
    try {
        const response = await axios.get(
            'http://localhost:8023/v1/transaction/list',
            {
                params: { limit: data.limit, offset: data.offset },
            }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy danh sách transaction:', error)
        throw error
    }
}

export const updateTransaction = async (transactionId, data) => {
    try {
        const response = await axios.patch(
            `http://localhost:8023/v1/transaction/?transactionId=${transactionId}`,
            data
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy danh sách transaction:', error)
        throw error
    }
}

export const getDetailTransaction = async transactionId => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/transaction/?transactionId=${transactionId}`
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy transaction:', error)
        throw error
    }
}

export const getDetailStatusOfTransaction = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/transaction/order_status_admin`
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy transaction:', error)
        throw error
    }
}

export const getOrderStats = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/transaction/order_stats`
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu:', error)
        throw error
    }
}

export const getAverageProcessingTime = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/transaction/average_processing_time`
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu:', error)
        throw error
    }
}

export const getCancelRefundRate = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/transaction/cancel_refund_rate`
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu:', error)
        throw error
    }
}

export const getAverageProductRating = async () => {
    try {
        const response = await axios.get(
            `http://localhost:8023/v1/transaction/average_product_rating`
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu:', error)
        throw error
    }
}