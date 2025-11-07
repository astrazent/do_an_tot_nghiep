import React, { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '~/utils/formatCurrency'
// --- Import các hooks và component cần thiết ---
import CartItem from '~/components/user/cart/CartItem'
import OrderSummary from '~/components/user/cart/OrderSummary'
import FeatureStrip from '~/components/shared/FeatureStrip'
import CheckoutPopup from '~/components/user/cart/CheckoutPopup'
import { useCurrentUser } from '~/hooks/user/useUser'
import { useCartItemsByUser } from '~/hooks/user/useCartItem'
import { useUpdateCartItem } from '~/hooks/user/useCartItem'
import { useDeleteCartItem } from '~/hooks/user/useCartItem'
import './cart.scss'

const Cart = () => {
    // 1. Lấy thông tin người dùng hiện tại
    const { user, isAuthenticated, loading: userLoading } = useCurrentUser()
    const userId = user?.id || 1

    // 2. Lấy các sản phẩm trong giỏ hàng
    const {
        data: cartData,
        isLoading: cartLoading,
        isError,
    } = useCartItemsByUser(userId)
    const queryClient = useQueryClient()

    // 3. Khởi tạo các mutation hooks
    const { mutate: updateItem } = useUpdateCartItem(userId)
    const { mutate: deleteItem } = useDeleteCartItem(userId)

    const [couponCode, setCouponCode] = useState('')
    const [isPopupOpen, setIsPopupOpen] = useState(false)

    // 4. Chuyển đổi dữ liệu từ API
    const items = useMemo(() => {
        if (!Array.isArray(cartData)) return []
        return cartData.map(item => ({
            id: item.cartItemId,
            productId: item.id,
            image: item.image,
            name: item.name,
            price: parseFloat(item.price) || 0,
            quantity: item.qty,
        }))
    }, [cartData])

    const handleOpenPopup = () => setIsPopupOpen(true)
    const handleClosePopup = () => setIsPopupOpen(false)

    const handleConfirmOrder = formData => {
        console.log('Đơn hàng đã được xác nhận với thông tin:', formData)
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.')
        setIsPopupOpen(false)
        queryClient.invalidateQueries(['cart', userId])
    }

    const discount = 60000
    const tax = 14000

    // 5. SỬA ĐỔI QUAN TRỌNG: Cập nhật hàm thay đổi số lượng để gọi API
    const handleQuantityChange = (cartItemId, newQuantity) => {
        const itemToUpdate = items.find(item => item.id === cartItemId)
        if (itemToUpdate && newQuantity > 0) {
            // Tính toán tổng tiền mới cho mặt hàng này
            const newPriceTotal = newQuantity * itemToUpdate.price
            console.log(newPriceTotal);
            // Gọi mutation với đầy đủ các tham số mà API yêu cầu
            updateItem({
                productId: itemToUpdate.productId,
                quantity: newQuantity,
                priceTotal: newPriceTotal, // Thêm tham số còn thiếu
            })
        }
    }

    // 6. Cập nhật hàm xóa sản phẩm để gọi API
    const handleRemoveItem = cartItemId => {
        deleteItem(cartItemId)
    }

    // 7. Tính toán tổng tiền
    const subtotal = useMemo(
        () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [items]
    )

    const total = subtotal - discount + tax

    // 8. Xử lý các trạng thái
    if (userLoading || cartLoading) {
        return <div className="cart-status">Đang tải giỏ hàng...</div>
    }

    if (!isAuthenticated) {
        return (
            <div className="cart-status">
                Vui lòng đăng nhập để xem giỏ hàng của bạn.
            </div>
        )
    }

    if (isError) {
        return (
            <div className="cart-status">
                Đã có lỗi xảy ra khi tải giỏ hàng.
            </div>
        )
    }

    if (items.length === 0) {
        return <div className="cart-status">Giỏ hàng của bạn đang trống.</div>
    }

    return (
        <>
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
                    subtotal={formatCurrency(subtotal)}
                    discount={formatCurrency(discount)}
                    tax={formatCurrency(tax)}
                    total={formatCurrency(total)}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    onMakePurchase={handleOpenPopup}
                />
            </div>
            {isPopupOpen && (
                <CheckoutPopup
                    total={total} // Truyền giá trị số cho Popup để xử lý tiếp
                    onClose={handleClosePopup}
                    onSubmit={handleConfirmOrder}
                />
            )}
        </>
    )
}

export default Cart