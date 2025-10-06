import React from 'react'
import './cartItem.scss'
import { FaTrash } from 'react-icons/fa'

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    const handleIncrease = () => {
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
                <p className="item-details">{item.details}</p>
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

            <div className="item-price">
                <p className="total-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                </p>
                <p className="price-per-item">
                    ${item.price.toFixed(2)} / sản phẩm
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
