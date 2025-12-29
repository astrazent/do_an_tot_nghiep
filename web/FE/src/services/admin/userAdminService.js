import axios from 'axios'

export const getDashboardSummary = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/user/dashboard_summary',
            {
                params: { startDate: data.startDate, endDate: data.endDate },
            }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const getListUser = async data => {
    try {
        const response = await axios.get('http://localhost:2082/v1/user/list', {
            params: { limit: data.limit, offset: data.offset },
        })
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const getListCustomerByType = async (data) => {
    try {
        const response = await axios.get('http://localhost:2082/v1/user/customer_type', {
            params: { minSpending: data.minSpending },
        })
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const getByIdUser = async data => {
    try {
        const response = await axios.get('http://localhost:2082/v1/user', {
            params: { userId: data.userId },
        })
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const deleteUser = async data => {
    try {
        const response = await axios.delete('http://localhost:2082/v1/user', {
            params: { userId: data.userId },
        })
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}
