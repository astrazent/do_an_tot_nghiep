import axios from 'axios'

export const getListCoupon = async () => {
    try {
        const response = await axios.get(
            'http://localhost:2082/v1/coupon/',
            {
                params: { limit: 1000, offset: 0 },
            }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const updateCoupon = async (couponId, updateData) => {
    try {
        const response = await axios.patch(
            `http://localhost:2082/v1/coupon/?couponId=${couponId}`,
            updateData
        )
        return response.data
    } catch (error) {
        console.error(
            `Đã xảy ra lỗi khi cập nhật mã giảm giá ID ${couponId}:`,
            error.response ? error.response.data : error.message
        )
        throw error
    }
}

export const createCoupon = async data => {
    try {
        const response = await axios.post(
            `http://localhost:2082/v1/coupon`,
            data
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const deleteCoupon = async data => {
    try {
        const response = await axios.delete(
            `http://localhost:2082/v1/coupon`,
            {
                params: { couponId: data.couponId },
            }
        )
        return response.data
    } catch (error) {
        throw error
    }
}

export const getCouponById = async couponId => {
    try {
        const response = await axios.get(`http://localhost:2082/v1/coupon`, {
            params: { couponId: couponId },
        })
        return response.data
    } catch (error) {
        throw error
    }
}
