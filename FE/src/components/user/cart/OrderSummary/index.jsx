import React from 'react'
import './orderSummary.scss'

const OrderSummary = ({
    subtotal,
    discount,
    tax,
    total,
    couponCode,
    setCouponCode,
    onMakePurchase,
}) => {
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
                    />
                    <button>Áp dụng</button>
                </div>
            </div>
            <div className="price-details">
                <div className="price-row">
                    <span>Tạm tính:</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="price-row discount">
                    <span>Giảm giá:</span>
                    <span>- ${discount.toFixed(2)}</span>
                </div>
                <div className="price-row">
                    <span>Thuế:</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
            </div>
            <div className="total-section">
                <div className="price-row total">
                    <span>Tổng cộng:</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <button className="purchase-btn" onClick={onMakePurchase}>
                    Thanh toán
                </button>
                <button className="back-btn">Tiếp tục mua sắm</button>
            </div>
        </div>
    )
}

export default OrderSummary
