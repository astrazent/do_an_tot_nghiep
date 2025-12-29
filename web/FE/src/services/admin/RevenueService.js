import axios from 'axios'

export const getRevenueAnalysisKPIs = async data => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/revenue/revenue_analysis_KPIs',
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

export const getYearRevenueAndOrders = async (data) => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/revenue/year_revenue_and_orders',
            {
                params: { year: data.year },
            }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const getNewVsReturningRevenue = async (data) => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/revenue/customer_new_vs_returning_revenue',
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

export const getRevenueByCategory = async (data) => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/revenue/revenue_by_category',
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

export const getProductRevenueList = async (data) => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/revenue/product_revenue_list',
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

export const getRevenueByPaymentMethod = async (data) => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/revenue/revenue_by_payment_method',
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

export const getRevenueByShipmentMethod = async (data) => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/revenue/revenue_by_shipment_method',
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