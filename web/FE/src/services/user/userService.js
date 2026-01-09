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
    const { data } = await api.post('/auth/google', { tokenId })
    return data
}
// Gửi email quên mật khẩu
export const forgotPassword = async (email) => {
    if (!email) throw new Error('Email là bắt buộc!')

    const res = await api.post('/auth/forgot-password', { email })
    return res.data
}

export const verifyResetPasswordToken = async (token) => {
    if (!token) throw new Error('Token là bắt buộc!')

    const res = await api.get('/auth/reset-password/verify', {
        params: { token },
    })
    return res.data
}

export const resetPassword = async (token, newPassword) => {
    if (!token || !newPassword) throw new Error('Token và mật khẩu mới là bắt buộc!')

    const res = await api.post('/auth/reset-password', { token, newPassword }, {
        headers: { 'Content-Type': 'application/json' }
    })
    return res.data
}

export const logoutUser = async data => {
    const res = await api.post('/auth/logout', data)
    return res.data
}

export const getUserById = async userId => {
    if (!userId) throw new Error('userId là bắt buộc!')
    const res = await api.get(`/user`, {
        params: { userId },
    })
    return res.data
}

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

export const checkPasswordAndUpdate = async data => {
    const res = await api.post(`/user/check_and_update`, data, {
        headers: { 'Content-Type': 'application/json' },
    })
    return res.data
}
