import { RevenueModel } from '~/models/revenueModel'

const getRevenueAnalysisKPIs = async date => {
    const result = await RevenueModel.getRevenueAnalysisKPIs(date)
    return result
}

const getYearRevenueAndOrders = async date => {
    const result = await RevenueModel.getYearRevenueAndOrders(date)
    return result
}

const getNewVsReturningRevenue = async date => {
    const result = await RevenueModel.getNewVsReturningRevenue(date)
    const newRev = Number(result.new_customer_revenue)
    const oldRev = Number(result.returning_customer_revenue)
    const total = newRev + oldRev

    const data = {
        new_customer: {
            revenue: newRev,
            percent: total > 0 ? ((newRev / total) * 100).toFixed(2) : 0,
        },
        returning_customer: {
            revenue: oldRev,
            percent: total > 0 ? ((oldRev / total) * 100).toFixed(2) : 0,
        },
    }

    return data
}

const getRevenueByCategory = async date => {
    const result = await RevenueModel.getRevenueByCategory(date)
    return result
}

const getProductRevenueList = async date => {
    const result = await RevenueModel.getProductRevenueList(date)
    return result
}

const getRevenueByPaymentMethod = async date => {
    const result = await RevenueModel.getRevenueByPaymentMethod(date)
    return result
}

const getRevenueByShipmentMethod = async date => {
    const result = await RevenueModel.getRevenueByShipmentMethod(date)
    return result
}

export const RevenueService = {
    getRevenueAnalysisKPIs,
    getYearRevenueAndOrders,
    getNewVsReturningRevenue,
    getRevenueByCategory,
    getProductRevenueList,
    getRevenueByPaymentMethod,
    getRevenueByShipmentMethod,
}
