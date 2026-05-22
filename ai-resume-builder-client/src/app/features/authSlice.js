import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
        user: null,
        loading: true,
    },
    reducers: {
        login: (state, action) => {
            state.token = action.payload.token
            state.user = action.payload.user
            state.loading = false
            try {
                localStorage.setItem('token', action.payload.token)
            } catch (e) {}
        },
        logout: (state) => {
            state.token = null
            state.user = null
            state.loading = false
            try {
                localStorage.removeItem('token')
            } catch (e) {}
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
    },
})

export const { login, logout, setLoading } = authSlice.actions

export default authSlice.reducer
