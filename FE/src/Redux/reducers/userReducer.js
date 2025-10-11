import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fullName: '',
    phone: '',
    email: '',
    token: ''
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        updateUser: (state, action) => {
            const {full_name, phone, email, token} = action.payload
            state.fullName = full_name
            state.phone = phone
            state.email = email
            state.token = token
        },
        remoteUser: (state) => {
            state.fullName = ""
            state.email = ""
            state.token = ""
            state.phone = ""
        }
    }
})

export const {updateUser, remoteUser} = userSlice.actions

export default userSlice.reducer