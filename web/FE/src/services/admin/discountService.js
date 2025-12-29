import api from '../user/api'

export const getAllDiscount = async () => {
    try {
        const response = await api.get('/discount/getAll')
        return response.data.data
    } catch (error) {
        console.error('Lỗi khi lấy danh sách khuyến mãi:', error)
        throw error
    }
}

export const createDiscount = async (discountData) => {
    try {
        const response = await api.post('/discount/', discountData)
        return response.data.data
    } catch (error) {
        console.error('Lỗi khi tạo khuyến mãi:', error)
        throw error
    }
}

export const deleteDiscount = async (discountId) => {
    try {
        const response = await api.delete('/discount/', { 
            params: { discountId } 
        })
        return response.data.data
    } catch (error) {
        console.error(`Lỗi khi xoá khuyến mãi với id=${discountId}:`, error)
        throw error
    }
}
