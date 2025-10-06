import React, { useState, useEffect } from 'react'
import CartItem from '~/components/user/cart/CartItem'
import OrderSummary from '~/components/user/cart/OrderSummary'
import FeatureStrip from '~/components/shared/FeatureStrip'
import CheckoutPopup from '~/components/user/cart/CheckoutPopup'
import './cart.scss'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'

//Dữ liệu giả lập cho sản phẩm trong giỏ hàng
const initialItems = [
    {
        id: 1,
        image: pateGanVit,
        name: 'Chân Vịt Rút Xương Ủ Muối',
        details: 'Đóng gói 500g, dùng kèm muối ớt chanh',
        price: 460.0,
        quantity: 1,
    },
    {
        id: 2,
        image: gaDongTaoUMuoi,
        name: 'Gà Đông Tảo Ủ Muối Nguyên Con',
        details: 'Khoảng 1.2 - 1.5kg, gà ta thả vườn, giao trong ngày',
        price: 12.2,
        quantity: 4,
    },
    {
        id: 3,
        image: gaUMuoi,
        name: 'Khâu Nhục Lạng Sơn',
        details: 'Đóng hộp 400g, hương vị truyền thống vùng Đông Bắc',
        price: 460.0,
        quantity: 3,
    },
]

const Cart = () => {
    const [items, setItems] = useState(initialItems)
    const [couponCode, setCouponCode] = useState('')

    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const handleOpenPopup = () => {
        setIsPopupOpen(true)
    }

    const handleClosePopup = () => {
        setIsPopupOpen(false)
    }

    const handleConfirmOrder = formData => {
        console.log('Đơn hàng đã được xác nhận với thông tin:', formData)
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.')

        setIsPopupOpen(false)
        setItems([])
    }

    const discount = 60.0
    const tax = 14.0

    const handleQuantityChange = (itemId, newQuantity) => {
        setItems(
            items.map(item =>
                item.id === itemId ? { ...item, quantity: newQuantity } : item
            )
        )
    }

    const handleRemoveItem = itemId => {
        setItems(items.filter(item => item.id !== itemId))
    }

    const subtotal = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    )

    const total = subtotal - discount + tax

    return (
        <>
            {' '}
            <div className="shopping-cart-container">
                <div className="cart-items">
                    <h2>Giỏ hàng của bạn</h2>
                    {items.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onQuantityChange={handleQuantityChange}
                            onRemove={handleRemoveItem}
                        />
                    ))}
                    <FeatureStrip />
                </div>
                <OrderSummary
                    subtotal={subtotal}
                    discount={discount}
                    tax={tax}
                    total={total}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    onMakePurchase={handleOpenPopup}
                />
            </div>
            {isPopupOpen && (
                <CheckoutPopup
                    total={total}
                    onClose={handleClosePopup}
                    onSubmit={handleConfirmOrder}
                />
            )}
        </>
    )
}

export default Cart
