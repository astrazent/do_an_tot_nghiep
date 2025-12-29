import axios from 'axios'

export const createPostMarketing = async data => {
    try {
        const response = await axios.post(
            'http://localhost:2082/v1/marketing/post',
            data
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi tạo bài viết marketing', error)
        throw error
    }
}

export const createEmailMarketing = async data => {
    try {
        const response = await axios.post(
            'http://localhost:2082/v1/marketing/email',
            data
        )
        return response.data
    } catch (error) {
        console.error('Đã xảy ra lỗi khi tạo email marketing', error)
        throw error
    }
}