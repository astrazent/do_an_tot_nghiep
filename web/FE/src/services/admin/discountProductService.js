import api from './api'

export const getAllDiscountProducts = async () => {
    try {
        const response = await api.get('/discount_product/list')
        return response.data.data
    } catch (error) {
        console.error('Lỗi khi lấy danh sách discount_product:', error)
        throw error
    }
}

export const createDiscountProduct = async (discountProductData) => {
    try {
        const response = await api.post('/discount_product/', discountProductData)
        return response.data.data
    } catch (error) {
        console.error('Lỗi khi tạo discount_product:', error)
        throw error
    }
}

export const deleteDiscountProduct = async (discountProductId) => {
    try {
        const response = await api.delete('/discount_product/', { 
            params: { discountProductId } 
        })
        return response.data.data
    } catch (error) {
        console.error(`Lỗi khi xoá discount_product với id=${discountProductId}:`, error)
        throw error
    }
}
