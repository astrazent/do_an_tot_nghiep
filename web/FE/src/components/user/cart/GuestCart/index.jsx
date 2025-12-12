import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { formatCurrency } from '~/utils/formatCurrency'
import {
    increaseAmountCart,
    decreaseAmountCart,
    removeCartItem,
    deleteAllCart,
} from '~/Redux/reducers/cartItemReducer'
import { useCouponByCode } from '~/hooks/user/useCoupon'
import GuestCartItem from '../GuestCartItem'
import OrderSummary from '~/components/user/cart/OrderSummary'
import FeatureStrip from '~/components/shared/FeatureStrip'
import CheckoutPopup from '~/components/user/cart/CheckoutPopup'
import { useNavigate } from 'react-router-dom'
import { FiShoppingCart } from 'react-icons/fi'
import { useAlert } from '~/contexts/AlertContext'
import { useCreateTransaction } from '~/hooks/user/useTransaction'
import { useQueryClient } from '@tanstack/react-query'
import './cart.scss'

const GuestCart = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cartItems } = useSelector(state => state.cartItem)
    const { showAlert } = useAlert()

    const [couponCode, setCouponCode] = useState('')
    const [appliedCouponCode, setAppliedCouponCode] = useState('')
    const [couponDiscount, setCouponDiscount] = useState(0)
    const [couponMessage, setCouponMessage] = useState({ type: '', text: '' })

    const { data: couponData, isLoading: isCouponLoading } =
        useCouponByCode(appliedCouponCode)

    const [isPopupOpen, setIsPopupOpen] = useState(false)

    const items = useMemo(() => {
        if (!Array.isArray(cartItems)) return []
        return cartItems.map(item => ({
            productId: item.product_id,
            image: item.main_image,
            name: item.name,
            price: parseFloat(item.price) || 0,
            quantity: item.qty_total,
        }))
    }, [cartItems])

    const subtotal = useMemo(
        () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
        [items]
    )

    useEffect(() => {
        if (!couponData) {
            if (appliedCouponCode) {
                setCouponMessage({
                    type: 'error',
                    text: 'Mã giảm giá không hợp lệ.',
                })
                setCouponDiscount(0)
            }
            return
        }
        const coupon = couponData
        const now = new Date()
        const startDate = new Date(coupon.start_date)
        const endDate = new Date(coupon.end_date)
        const minOrderValue = parseFloat(coupon.min_order_value)

        if (coupon.status !== 1 || now < startDate || now > endDate) {
            setCouponMessage({
                type: 'error',
                text: 'Mã đã hết hạn hoặc không hợp lệ.',
            })
            setCouponDiscount(0)
            return
        }
        if (subtotal < minOrderValue) {
            setCouponMessage({
                type: 'error',
                text: `Cần mua tối thiểu ${formatCurrency(minOrderValue)} để áp dụng.`,
            })
            setCouponDiscount(0)
            return
        }

        if (coupon.type === 1) {
            let discount = 0
            const couponValue = parseFloat(coupon.value)

            if (couponValue <= 100) {
                discount = (subtotal * couponValue) / 100

                if (
                    coupon.max_value &&
                    discount > parseFloat(coupon.max_value)
                ) {
                    discount = parseFloat(coupon.max_value)
                }
            } else {
                discount = couponValue
            }

            setCouponDiscount(discount)
            setCouponMessage({
                type: 'success',
                text: 'Áp dụng mã thành công!',
            })
        } else {
            setCouponMessage({
                type: 'error',
                text: 'Mã không áp dụng cho sản phẩm.',
            })
            setCouponDiscount(0)
        }
    }, [couponData, subtotal, appliedCouponCode])

    const queryClient = useQueryClient()

    const handleApplyCoupon = () => {
        if (!couponCode.trim()) {
            setCouponMessage({
                type: 'error',
                text: 'Vui lòng nhập mã giảm giá.',
            })
            setCouponDiscount(0)
            return
        }

        setCouponMessage({ type: '', text: '' })
        setCouponDiscount(0)

        queryClient.invalidateQueries(['coupon', 'by_code', couponCode])

        setAppliedCouponCode('')
        setTimeout(() => {
            setAppliedCouponCode(couponCode)
        }, 0)
    }

    const tax = 14000

    const total = subtotal - couponDiscount + tax

    const handleOpenPopup = () => setIsPopupOpen(true)
    const handleClosePopup = () => setIsPopupOpen(false)
    const { mutate: createTransaction, isLoading: creatingTransaction } =
        useCreateTransaction({
            onSuccess: data => {
                showAlert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.', {
                    type: 'success',
                })
                try {
                    dispatch(deleteAllCart())
                    queryClient.invalidateQueries(['cart', 'guest'])
                } catch (err) {
                    console.error('Xóa giỏ hàng thất bại:', err)
                }
                window.scrollTo({ top: 0, behavior: 'smooth' })
                setIsPopupOpen(false)
            },
            onError: err => {
                console.error('Tạo transaction thất bại:', err)
                showAlert('Đặt hàng thất bại. Vui lòng thử lại.', {
                    type: 'error',
                })
            },
        })

    const handleConfirmOrder = formData => {
        console.log('Khách hàng chưa đăng nhập, tạo transaction:', formData)
        createTransaction(formData)
    }

    const handleQuantityChange = (productId, newQuantity) => {
        const currentItem = items.find(item => item.productId === productId)
        if (!currentItem) return
        if (newQuantity > currentItem.quantity) {
            dispatch(increaseAmountCart({ product_id: productId }))
        } else if (newQuantity < currentItem.quantity && newQuantity > 0) {
            dispatch(decreaseAmountCart({ product_id: productId }))
        }
    }

    const handleRemoveItem = productId => {
        dispatch(removeCartItem({ product_id: productId }))
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
                                <GuestCartItem
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
                {}
                <OrderSummary
                    subtotal={formatCurrency(subtotal)}
                    discount={formatCurrency(couponDiscount)}
                    tax={formatCurrency(tax)}
                    total={formatCurrency(total)}
                    couponCode={couponCode}
                    setCouponCode={setCouponCode}
                    onApplyCoupon={handleApplyCoupon}
                    couponMessage={couponMessage}
                    isCouponLoading={isCouponLoading}
                    onMakePurchase={handleOpenPopup}
                />
            </div>
            {isPopupOpen && (
                <CheckoutPopup
                    total={total}
                    onClose={handleClosePopup}
                    onSubmit={handleConfirmOrder}
                    user={null}
                    cartItems={items}
                />
            )}
        </>
    )
}

export default GuestCart
