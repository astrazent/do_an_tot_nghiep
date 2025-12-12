import axios from "axios"

export const getListSlider = async () => {
    try {
        const response = await axios.get('http://localhost:8023/v1/slider/list')
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const createSlider = async (data) => {
    try {
        const response = await axios.post('http://localhost:8023/v1/slider', data)
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const updateSlider = async (data, sliderId) => {
    try {
        const response = await axios.patch(
            `http://localhost:8023/v1/slider/${sliderId}`, 
            data,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi cập nhật slider', error)
        throw error
    }
}

export const deleteSlider = async (sliderId) => {
    try {
        const response = await axios.delete(
            `http://localhost:8023/v1/slider`, 
            { params: { sliderId: sliderId } }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi xóa slider', error)
        throw error
    }
}