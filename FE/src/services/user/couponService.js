import api from './api'

export const getCouponByCode = async couponCode => {
    if (!couponCode) return null

    try {
        const response = await api.get(
            `/coupon/get_by_code?couponCode=${couponCode}`
        )
        return response.data.data || null
    } catch (error) {
        console.error('Lỗi khi tải thông tin mã giảm giá:', error)
        throw error
    }
}
