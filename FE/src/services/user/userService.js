import api from './api'

export const loginUser = async data => {
    const res = await api.post('/auth/login', data)
    return res.data
}

export const registerUser = async data => {
    const res = await api.post('/auth/register', data)
    return res.data
}

export const logoutUser = async data => {
    const res = await api.post('/auth/logout', data)
    return res.data
}


// GET user theo userId
export const getUserById = async (userId) => {
    if (!userId) throw new Error('userId là bắt buộc!')
    const res = await api.get(`/user`, {
        params: { userId }
    })
    return res.data
}

// PATCH update user
export const updateUserById = async (userId, data) => {
    if (!userId) throw new Error('userId là bắt buộc!')
    const res = await api.patch(`/user`, data, {
        params: { userId },
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return res.data
}