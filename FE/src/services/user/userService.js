import api from './api'

export const loginUser = async data => {
    const res = await api.post('/auth/login', data)
    return res.data
}

export const registerUser = async data => {
    const res = await api.post('/auth/register', data)
    return res.data
}

export const loginGoogleApi = async ({ tokenId }) => {
    // URL này phải khớp với backend của bạn
    const { data } = await api.post('/auth/google', { tokenId })
    return data
}

export const logoutUser = async data => {
    const res = await api.post('/auth/logout', data)
    return res.data
}

// GET user theo userId
export const getUserById = async userId => {
    if (!userId) throw new Error('userId là bắt buộc!')
    const res = await api.get(`/user`, {
        params: { userId },
    })
    return res.data
}

// PATCH update user
export const updateUserById = async (userId, data) => {
    if (!userId) throw new Error('userId là bắt buộc!')

    const res = await api.patch(`/user`, data, {
        params: { userId },
        headers:
            data instanceof FormData
                ? {}
                : { 'Content-Type': 'application/json' },
    })
    return res.data
}

export const checkPasswordAndUpdate = async (data) => {
    const res = await api.post(`/user/check_and_update`, data, {
        headers: { 'Content-Type': 'application/json' },
    })
    return res.data
}