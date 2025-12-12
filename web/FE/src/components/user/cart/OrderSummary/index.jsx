import React from 'react'
import { useNavigate } from 'react-router-dom'
import './orderSummary.scss'

const OrderSummary = ({
    subtotal,
    discount,
    tax,
    total,
    couponCode,
    setCouponCode,
    onApplyCoupon,
    onMakePurchase,
    couponMessage,
    isCouponLoading,
}) => {
    const navigate = useNavigate()

    const handleContinueShopping = () => {
        navigate('/')
    }

    return (
        <div className="order-summary">
            <div className="coupon-section">
                <p>Có mã giảm giá?</p>
                <div className="coupon-input">
                    <input
                        type="text"
                        placeholder="Mã giảm giá"
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        disabled={isCouponLoading}
                    />
                    <button onClick={onApplyCoupon} disabled={isCouponLoading}>
                        {isCouponLoading ? 'Đang...' : 'Áp dụng'}
                    </button>
                </div>
                {couponMessage?.text && (
                    <p className={`coupon-message ${couponMessage.type || ''}`}>
                        {couponMessage.text}
                    </p>
                )}
            </div>
            <div className="price-details">
                <div className="price-row">
                    <span>Tạm tính:</span>
                    <span>{subtotal}</span>
                </div>
                <div className="price-row discount">
                    <span>Giảm giá:</span>
                    <span>- {discount}</span>
                </div>
                <div className="price-row">
                    <span>Thuế:</span>
                    <span>{tax}</span>
                </div>
            </div>
            <div className="total-section">
                <div className="price-row total">
                    <span>Tổng cộng:</span>
                    <span>{total}</span>
                </div>
                <button className="purchase-btn" onClick={onMakePurchase}>
                    Thanh toán
                </button>
                <button className="back-btn" onClick={handleContinueShopping}>
                    Tiếp tục mua sắm
                </button>
            </div>
        </div>
    )
}

export default OrderSummary
