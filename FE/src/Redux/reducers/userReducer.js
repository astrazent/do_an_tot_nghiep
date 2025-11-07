import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user_id: null,
    username: '',
    full_name: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    avatar_url: '',
    status: null,
    created_at: null,
    updated_at: null,
    token: '',
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const payload = action.payload || {}
            console.log('payload: ', action.payload)
            state.user_id = payload.user_id ?? null
            state.username = payload.username ?? ''
            state.full_name = payload.full_name ?? ''
            state.gender = payload.gender ?? ''
            state.email = payload.email ?? ''
            state.phone = payload.phone ?? ''
            state.address = payload.address ?? ''
            state.city = payload.city ?? ''
            state.district = payload.district ?? ''
            state.ward = payload.ward ?? ''
            state.avatar_url = payload.avatar_url ?? ''
            state.status = payload.status ?? null
            state.created_at = payload.created_at ?? null
            state.updated_at = payload.updated_at ?? null
            state.token = payload.token ?? ''
        },
        removeUser: state => {
            state.user_id = null
            state.username = ''
            state.full_name = ''
            state.gender = ''
            state.email = ''
            state.phone = ''
            state.address = ''
            state.city = ''
            state.district = ''
            state.ward = ''
            state.avatar_url = ''
            state.status = null
            state.created_at = null
            state.updated_at = null
            state.token = ''
        },
    },
})

export const { updateUser, removeUser } = userSlice.actions

export default userSlice.reducer
