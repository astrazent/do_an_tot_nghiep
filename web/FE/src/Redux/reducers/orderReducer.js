import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    user_id: null,
    payment_method: '',
    shipment_method: '',
    status: 'pending',
    payment_status: 'pending',
    deli_name: '',
    deli_phone: '',
    deli_email: '',
    deli_address: '',
    deli_city: '',
    deli_district: '',
    deli_ward: '',
    message: '',
    shipment_status: 'pending',
    shipping_fee: 0,
    shipped_at: null,
    delivered_at: null,
    amount: 0,
    items: [],
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        resetOrder: state => {
            Object.assign(state, initialState)
        },

        setOrderFromPayload: (state, action) => {
            Object.assign(state, action.payload)
        },

        setUserId: (state, action) => {
            state.user_id = action.payload
        },

        setPaymentMethod: (state, action) => {
            state.payment_method = action.payload
        },

        setShipmentMethod: (state, action) => {
            state.shipment_method = action.payload
        },

        setPaymentStatus: (state, action) => {
            state.payment_status = action.payload
        },

        setShippingFee: (state, action) => {
            state.shipping_fee = action.payload
        },

        setDeliveryInfo: (state, action) => {
            const {
                name,
                phone,
                email,
                address,
                city,
                district,
                ward,
                message,
            } = action.payload
            state.deli_name = name
            state.deli_phone = phone
            state.deli_email = email
            state.deli_address = address
            state.deli_city = city
            state.deli_district = district
            state.deli_ward = ward
            state.message = message || ''
        },

        setStatus: (state, action) => {
            state.status = action.payload
        },

        setShipmentStatus: (state, action) => {
            state.shipment_status = action.payload
        },

        setShippedAt: (state, action) => {
            state.shipped_at = action.payload
        },

        setDeliveredAt: (state, action) => {
            state.delivered_at = action.payload
        },

        setAmount: (state, action) => {
            state.amount = action.payload
        },

        addOrderItem: (state, action) => {
            const { orderItem } = action.payload
            if (!state.items) state.items = []
            const existingItem = state.items.find(
                i => i.product_id === orderItem.product_id
            )
            if (existingItem) existingItem.amount += parseInt(orderItem.amount)
            else state.items.push(orderItem)
        },

        increaseOrderItem: (state, action) => {
            const { product_id } = action.payload
            const item = state.items.find(i => i.product_id === product_id)
            if (item) item.amount += 1
        },

        decreaseOrderItem: (state, action) => {
            const { product_id } = action.payload
            const item = state.items.find(i => i.product_id === product_id)
            if (item && item.amount > 1) item.amount -= 1
        },

        removeOrderItem: (state, action) => {
            const { product_id } = action.payload
            state.items = state.items.filter(i => i.product_id !== product_id)
        },
    },
})

export const {
    resetOrder,
    setUserId,
    setOrderFromPayload,
    setPaymentMethod,
    setShipmentMethod,
    setPaymentStatus,
    setShippingFee,
    setDeliveryInfo,
    setStatus,
    setShipmentStatus,
    setShippedAt,
    setDeliveredAt,
    setAmount,
    addOrderItem,
    increaseOrderItem,
    decreaseOrderItem,
    removeOrderItem,
} = orderSlice.actions

export default orderSlice.reducer
