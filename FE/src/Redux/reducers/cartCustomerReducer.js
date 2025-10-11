import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartItems : [],
}

export const cartCustomerSlice = createSlice({
    name: 'cartCustomer',
    initialState,
    reducers: {
        deleteAllCart: (state, action) => {
            state.cartItems = [];
        },

        updateCart: (state, action) => {
            const {cartItem} = action.payload
            state?.cartItems.push({cartItem})
        },

        addCart: (state, action) => {
            const {cartItem} = action.payload
            const itemCart = state?.cartItems?.find((item) => item?.product_id === cartItem.product_id)
            if(itemCart){
                itemCart.amount += parseInt(cartItem?.amount)
            } else {
                state.cartItems.push(cartItem)
            }
        },

        increaseAmountCart: (state, action) => {
            const {cartItem} = action.payload
            const itemCart = state?.cartItems?.find((item) => item?.product_id === cartItem.product_id)
            if (itemCart) {
                itemCart.amount += 1
            }
        },

        decreaseAmountCart: (state, action) => {
            const {cartItem} = action.payload
            const itemCart = state?.cartItems?.find((item) => item?.product_id === cartItem.product_id)
            if (itemCart && itemCart.amount > 1) {
                itemCart.amount -= 1
            }
        },

        removeCartItem: (state, action) => {
            const {cartItem} = action.payload
            state.cartItems = state.cartItems.filter(item => item.product_id !== cartItem.product_id);
        },
    }
})

export const {deleteAllCart, updateCart, addCart, increaseAmountCart, decreaseAmountCart, removeCartItem} = cartCustomerSlice.actions

export default cartCustomerSlice.reducer