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

export const createPost = async (data) => {
    try {
        const response = await axios.post('http://localhost:8023/v1/post', data,
            { headers: { 'Content-Type': 'multipart/form-data' } }
        )
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

export const getListPostType = async () => {
    try {
        const response = await axios.get('http://localhost:8023/v1/post_type/list')
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const createPostType = async (data) => {
    try {
        const response = await axios.post('http://localhost:8023/v1/post_type', data)
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const updatePostType = async (data, postTypeId) => {
    try {
        const response = await axios.patch(`http://localhost:8023/v1/post_type/${postTypeId}`, data)
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi lấy dữ liệu', error)
        throw error
    }
}

export const deletePostType = async (postTypeId) => {
    try {
        const response = await axios.delete(
            `http://localhost:8023/v1/post_type`, 
            { params: { postTypeId: postTypeId } }
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi xóa category', error)
        throw error
    }
}