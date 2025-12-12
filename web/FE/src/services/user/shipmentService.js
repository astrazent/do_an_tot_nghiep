import api from './api'

export const getAllShipments = async () => {
    try {
        const response = await api.get('/shipment/getAll')

        return response.data.data || []
    } catch (error) {
        console.error('Lỗi khi tải danh sách shipment:', error)
        throw error
    }
}
