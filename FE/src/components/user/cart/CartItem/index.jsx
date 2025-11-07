import React from 'react'
import { FaTrash } from 'react-icons/fa'
// SỬA ĐỔI 1: Import hàm formatCurrency
import { formatCurrency } from '~/utils/formatCurrency'
import './cartItem.scss'

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    const handleIncrease = () => {
        // item.id ở đây chính là cartItemId đã được map ở component cha
        onQuantityChange(item.id, item.quantity + 1)
    }

    const handleDecrease = () => {
        if (item.quantity > 1) {
            onQuantityChange(item.id, item.quantity - 1)
        }
    }

    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} className="item-image" />
            <div className="item-info">
                <p className="item-name">{item.name}</p>
            </div>

            <div className="item-quantity">
                <button
                    className="quantity-btn minus-btn"
                    onClick={handleDecrease}
                    disabled={item.quantity <= 1}
                >
                    -
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                    className="quantity-btn plus-btn"
                    onClick={handleIncrease}
                >
                    +
                </button>
            </div>

            {/* SỬA ĐỔI 2: Sử dụng formatCurrency để hiển thị giá */}
            <div className="item-price">
                <p className="total-item-price">
                    {/* Tính toán với number, sau đó mới format thành string */}
                    {formatCurrency(item.price * item.quantity)}
                </p>
                <p className="price-per-item">
                    {/* Format giá của một sản phẩm */}
                    {formatCurrency(item.price)} / sản phẩm
                </p>
            </div>

            <div className="item-actions">
                <button
                    className="remove-btn"
                    onClick={() => onRemove(item.id)}
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    )
}

export default CartItem