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
                {/* SỬA ĐỔI: Hiển thị trực tiếp các props đã được định dạng */}
                <div className="price-row">
                    <span>Tạm tính:</span>
                    {/* `subtotal` đã là chuỗi "1.700.000 ₫" */}
                    <span>{subtotal}</span>
                </div>
                <div className="price-row discount">
                    <span>Giảm giá:</span>
                    {/* Giữ lại dấu "-" và hiển thị `discount` */}
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
                    {/* Hiển thị tổng tiền đã được định dạng */}
                    <span>{total}</span>
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