import React from 'react'
import { useCurrentUser } from '~/hooks/user/useUser'
import LoggedInCart from '~/components/user/cart/LoggedInCart'
import GuestCart from '~/components/user/cart/GuestCart'

const Cart = () => {
    const { isAuthenticated, loading: userLoading } = useCurrentUser()

    if (userLoading) {
        return <div className="cart-status">Đang tải giỏ hàng...</div>
    }

    return isAuthenticated ? <LoggedInCart /> : <GuestCart />
}

export default Cart
