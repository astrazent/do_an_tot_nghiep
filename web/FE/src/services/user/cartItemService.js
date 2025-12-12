import api from './api'

const transformCartItem = cartItem => {
    const rating = cartItem.rate_count
        ? Math.round(cartItem.rate_point_total / cartItem.rate_count)
        : 0

    return {
        id: cartItem.product_id,
        cartItemId: cartItem.cart_item_id,
        qty: cartItem.qty_total,
        totalPrice: cartItem.price_total,
        name: cartItem.name,
        slug: cartItem.slug,
        description: cartItem.description,
        price: cartItem.price,
        oldPrice: cartItem.origin_price,
        ocop: cartItem.ocop_rating || 0,
        rating,
        reviewCount: cartItem.rate_count || 0,
        image: cartItem.main_image || null,
        createdAt: cartItem.created_at,
    }
}

export const getCartItemsByUser = async userId => {
    try {
        const res = await api.get(`/cart?userId=${userId}`)
        if (res.data && Array.isArray(res.data.data)) {
            return res.data.data.map(transformCartItem)
        }
        return []
    } catch (error) {
        console.error(
            'Lỗi lấy giỏ hàng:',
            error.response?.data || error.message
        )
        return []
    }
}

export const addCartItem = async (userId, productId, quantity) => {
    try {
        const res = await api.post(`/cart?userId=${userId}`, {
            userId,
            productId,
            quantity,
        })
        if ((res.status === 200 || res.status === 201) && res.data) return true
        return false
    } catch (error) {
        console.error(
            'Lỗi thêm cart item:',
            error.response?.data || error.message
        )
        return false
    }
}

export const updateCartItem = async (
    userId,
    productId,
    quantity,
    priceTotal
) => {
    try {
        console.log(userId, productId, quantity, priceTotal)
        const res = await api.patch(`/cart?userId=${userId}`, {
            product_id: productId,
            quantity,
            price_total: priceTotal,
        })
        if (res.status === 200 && res.data) return true
        return false
    } catch (error) {
        console.error(
            'Lỗi update cart item:',
            error.response?.data || error.message
        )
        return false
    }
}

export const deleteCartItem = async cartItemId => {
    try {
        const res = await api.delete(`/cart?cartItemId=${cartItemId}`)
        return res.data ? res.data : true
    } catch (error) {
        console.error(
            'Lỗi xóa cart item:',
            error.response?.data || error.message
        )
        return false
    }
}

export const deleteCartByUser = async userId => {
    if (!userId) throw new Error('userId là bắt buộc')

    try {
        const response = await api.delete('/cart/by_user', {
            params: { userId },
        })
        return response.data
    } catch (error) {
        console.error('Xóa giỏ hàng thất bại:', error)
        throw error
    }
}
