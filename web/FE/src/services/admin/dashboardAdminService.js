import axios from 'axios'

export const getTotalProductsSold = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/total_products_sold',
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

export const getTotalUsers = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/total_users',
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

export const getTotalInventory = async () => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/total_inventory'
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const getMonthlyRevenue = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/monthly_revenue',
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


export const getTopCustomers = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/top_customers',
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

export const getTopProduct = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/top_product',
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

export const getOrderCountByStatus = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/oder_count_by_status',
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

export const getNewUsersByMonths = async () => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/new_users_by_months'
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const getYearRevenue = async () => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/year_revenue'
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const getFinancialData = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/financial_data',
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

export const getReturningCustomerRate = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/returning_customer_rate',
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

export const getCustomerConversionRate = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/customer_conversion_rate',
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

export const getOrderConversionRate = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/order_conversion_rate',
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

export const getCancelRefundRate = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/cancel_refund_rate',
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

export const getRevenueByLocation = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/boards/revenue_by_location',
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
