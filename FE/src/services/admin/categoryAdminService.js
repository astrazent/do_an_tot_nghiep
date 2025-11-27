import axios from "axios"

    export const createCategory = async (data) => {
        try {
            const response = await axios.post('http://localhost:8023/v1/category', data)
            return response.data
        } catch (error) {
            console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
            throw error
        }
    }

export const updateCategory = async (data, categoryId) => {
    try {
        console.log(data)
        const response = await axios.patch(
            `http://localhost:8023/v1/category/${categoryId}`, 
            data,
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi cập nhật category', error)
        throw error
    }
}

export const deleteCategory = async (categoryId) => {
    try {
        const response = await axios.delete(
            `http://localhost:8023/v1/category`, 
            { params: { categoryId: categoryId } }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi xóa category', error)
        throw error
    }
}