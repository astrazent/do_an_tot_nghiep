import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    cartItems: [],
}

export const cartItemSlice = createSlice({
    name: 'cartItem',
    initialState,
    reducers: {
        deleteAllCart: state => {
            state.cartItems = []
        },

        updateCart: (state, action) => {
            const { cartItem } = action.payload
            state.cartItems.push(cartItem)
        },

        addCart: (state, action) => {
            const { cartItem } = action.payload
            const existing = state.cartItems.find(
                item => item.product_id === cartItem.product_id
            )

            if (existing) {
                existing.qty_total += parseInt(cartItem.qty_total)
                existing.price_total = (
                    parseFloat(existing.price) * existing.qty_total
                ).toFixed(2)
            } else {
                state.cartItems.push({
                    ...cartItem,
                    price_total: (
                        parseFloat(cartItem.price) * cartItem.qty_total
                    ).toFixed(2),
                })
            }
        },

        increaseAmountCart: (state, action) => {
            const { product_id } = action.payload
            const item = state.cartItems.find(i => i.product_id === product_id)
            if (item) {
                item.qty_total += 1
                item.price_total = (
                    parseFloat(item.price) * item.qty_total
                ).toFixed(2)
            }
        },

        decreaseAmountCart: (state, action) => {
            const { product_id } = action.payload
            const item = state.cartItems.find(i => i.product_id === product_id)
            if (item && item.qty_total > 1) {
                item.qty_total -= 1
                item.price_total = (
                    parseFloat(item.price) * item.qty_total
                ).toFixed(2)
            }
        },

        removeCartItem: (state, action) => {
            const { product_id } = action.payload
            state.cartItems = state.cartItems.filter(
                item => item.product_id !== product_id
            )
        },
    },
})

export const {
    deleteAllCart,
    updateCart,
    addCart,
    increaseAmountCart,
    decreaseAmountCart,
    removeCartItem,
} = cartItemSlice.actions

export default cartItemSlice.reducer
