import api from './api'

export const getListSlider = async ({ limit = 10, offset = 0, sort = 'asc' } = {}) => {
    try {
        const response = await api.get('/slider/list', {
            params: { limit, offset, sort },
        })

        const allSliders = response.data.data
        if (!Array.isArray(allSliders)) {
            console.error('Dữ liệu slider không phải là một mảng:', allSliders)
            return []
        }

        return allSliders
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy danh sách slider:', error)
        throw error
    }
}
