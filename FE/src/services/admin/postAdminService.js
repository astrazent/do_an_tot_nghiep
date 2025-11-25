import axios from 'axios'

export const getListPost = async () => {
    try {
        const response = await axios.get('http://localhost:8023/v1/post/list')
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const getByIdPost = async postId => {
    try {
        const response = await axios.get('http://localhost:8023/v1/post', {
            params: { postId },
        })
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}
