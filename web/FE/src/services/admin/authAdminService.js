import axios from 'axios'

export const adminLogin = async data => {
    try {
        const response = await axios.post(
            'http://localhost:2082/v1/admin/login',
            data,
            { withCredentials: true }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi login:', error)
        throw error
    }
}
