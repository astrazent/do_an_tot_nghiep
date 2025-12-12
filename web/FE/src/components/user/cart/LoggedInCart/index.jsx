import React, { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { formatCurrency } from '~/utils/formatCurrency'

import CartItem from '~/components/user/cart/CartItem'
import OrderSummary from '~/components/user/cart/OrderSummary'
import FeatureStrip from '~/components/shared/FeatureStrip'
import CheckoutPopup from '~/components/user/cart/CheckoutPopup'
import { useCurrentUser } from '~/hooks/user/useUser'
import { useCartItemsByUser } from '~/hooks/user/useCartItem'
import { useUpdateCartItem } from '~/hooks/user/useCartItem'
import { useDeleteCartItem } from '~/hooks/user/useCartItem'
import { useCreateTransaction } from '~/hooks/user/useTransaction'
import { useDeleteCartByUser } from '~/hooks/user/useCartItem'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '~/contexts/AlertContext'
import { FiShoppingCart } from 'react-icons/fi'
import './cart.scss'

const LoggedInCart = () => {
    const { user, isAuthenticated, loading: userLoading } = useCurrentUser()
    const userId = user?.user_id || null
    const { showAlert } = useAlert()

    const {
        data: cartData,
        isLoading: cartLoading,
        isError,
    } = useCartItemsByUser(userId)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const { mutate: updateItem } = useUpdateCartItem(userId)
    const { mutate: deleteItem } = useDeleteCartItem(userId)

    const [couponCode, setCouponCode] = useState('')
    const [isPopupOpen, setIsPopupOpen] = useState(false)

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

    const { mutate: deleteCartByUser } = useDeleteCartByUser({
        onSuccess: () => {
            console.log('Giỏ hàng đã được làm mới sau khi tạo đơn hàng')
        },
        onError: () => {
            console.log('Không thể xóa giỏ hàng sau khi tạo đơn hàng')
        },
    })

    const { mutate: createTransaction, isLoading: creatingTransaction } =
        useCreateTransaction({
            onSuccess: async data => {
                showAlert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.')
                try {
                    await deleteCartByUser(userId)
                    queryClient.invalidateQueries(['cart', userId])
                } catch (err) {
                    console.error('Xóa giỏ hàng thất bại:', err)
                }
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                })
                setIsPopupOpen(false)
            },
            onError: err => {
                console.error('Tạo transaction thất bại:', err)
                showAlert('Đã xảy ra lỗi khi đặt hàng. Vui lòng thử lại.')
            },
        })

    const handleOpenPopup = () => setIsPopupOpen(true)
    const handleClosePopup = () => setIsPopupOpen(false)

    const handleConfirmOrder = formData => {
        console.log('Đơn hàng đã được xác nhận với thông tin:', formData)
        createTransaction(formData)
        setIsPopupOpen(false)
    }

    const discount = 0

    const handleQuantityChange = (cartItemId, newQuantity) => {
        const itemToUpdate = items.find(item => item.id === cartItemId)
        if (itemToUpdate && newQuantity > 0) {
            const newPriceTotal = newQuantity * itemToUpdate.price

            updateItem({
                productId: itemToUpdate.productId,
                quantity: newQuantity,
                priceTotal: newPriceTotal,
            })
        }
    }

    const handleRemoveItem = cartItemId => {
        deleteItem(cartItemId)
    }

    const subtotal = useMemo(
        () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [items]
    )
    const tax = useMemo(
        () => Math.ceil((subtotal * 0.1) / 1000) * 1000,
        [subtotal]
    )
    const total = subtotal - discount + tax

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
        return (
            <div className="cart-empty-container flex flex-col items-center justify-center py-20">
                <FiShoppingCart size={80} className="text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg mb-6">
                    Giỏ hàng của bạn đang trống.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-green-600 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    Tiếp tục mua sắm
                </button>
            </div>
        )
    }

    return (
        <>
            <div className="shopping-cart-container">
                <div className="cart-items-container">
                    <h2>Giỏ hàng của bạn</h2>
                    <div className="cart-items-wrap">
                        <div className="cart-items">
                            {items.map(item => (
                                <CartItem
                                    key={item.productId}
                                    item={item}
                                    onQuantityChange={handleQuantityChange}
                                    onRemove={handleRemoveItem}
                                />
                            ))}
                        </div>
                        <FeatureStrip />
                    </div>
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
                    total={total}
                    onClose={handleClosePopup}
                    onSubmit={handleConfirmOrder}
                    user={user}
                />
            )}
        </>
    )
}

export default LoggedInCart
