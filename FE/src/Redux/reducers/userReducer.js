import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user_id: null,
    username: '',
    full_name: '',
    gender: '',
    email: '',
    email_verified: false, // thêm
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    avatar_url: '',
    status: null,
    provider: '',
    provider_id: '',
    created_at: null,
    updated_at: null,
    token: '',
    expire_date: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const payload = action.payload || {}
            console.log(payload);
            return {
                user_id: payload.id ?? payload.user_id ?? null,
                username: payload.username ?? '',
                full_name: payload.full_name ?? '',
                gender: payload.gender ?? '',
                email: payload.email ?? '',
                email_verified: payload.email_verified ?? false,
                phone: payload.phone ?? '',
                address: payload.address ?? '',
                city: payload.city ?? '',
                district: payload.district ?? '',
                ward: payload.ward ?? '',
                avatar_url: payload.avatar_url ?? '',
                status: payload.status ?? null,
                provider: payload.provider ?? '',
                provider_id: payload.provider_id ?? '',
                created_at: payload.created_at ?? null,
                updated_at: payload.updated_at ?? null,
                token: payload.token ?? '',
                expire_date: payload.expire_date ?? state.expire_date
            }
        },
        removeUser: state => {
            state.user_id = null
            state.username = ''
            state.full_name = ''
            state.gender = ''
            state.email = ''
            state.email_verified = false // thêm
            state.phone = ''
            state.address = ''
            state.city = ''
            state.district = ''
            state.ward = ''
            state.avatar_url = ''
            state.status = null
            state.provider = ''
            state.provider_id = ''
            state.created_at = null
            state.updated_at = null
            state.token = ''
            state.expire_date = null
        },
    },
})

export const { updateUser, removeUser } = userSlice.actions

export default userSlice.reducer
