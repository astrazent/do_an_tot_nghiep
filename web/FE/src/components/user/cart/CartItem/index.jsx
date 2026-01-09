import React from 'react'
import { FaTrash } from 'react-icons/fa'
import { formatCurrency } from '~/utils/formatCurrency'
import './cartItem.scss'
import { getProductById } from '~/services/admin/productAdminService'
import { getCartItemsById } from '~/services/user/cartItemService'

const CartItem = ({ item, onQuantityChange, onRemove }) => {
    const [currentStock, setCurrentStock] = React.useState(null)
    const [loadingStock, setLoadingStock] = React.useState(true)
    const [showOverStockWarning, setShowOverStockWarning] =
        React.useState(false)

    React.useEffect(() => {
        const fetchStock = async () => {
            try {
                setLoadingStock(true)

                // API 1: Lấy cart item
                const cartItemResponse = await getCartItemsById(item.id)
                const cartItemData = cartItemResponse?.data || cartItemResponse

                if (!cartItemData?.product_id) {
                    setCurrentStock(999)
                    return
                }

                // API 2: Lấy stock
                const productResponse = await getProductById(
                    cartItemData.product_id
                )
                const productData = productResponse?.data || productResponse
                const stock = productData?.stock_qty ?? 0

                setCurrentStock(stock)
                setShowOverStockWarning(false) // Reset warning khi load
            } catch (error) {
                console.error('Lỗi lấy stock:', error)
                setCurrentStock(999)
                setShowOverStockWarning(false)
            } finally {
                setLoadingStock(false)
            }
        }

        fetchStock()
    }, [item.id])

    const handleIncrease = () => {
        if (loadingStock || currentStock === null) return

        if (item.quantity >= currentStock) {
            // Chỉ lúc này mới bật warning đỏ
            setShowOverStockWarning(true)
            return
        }

        // Tăng bình thường → ẩn warning nếu đang có
        setShowOverStockWarning(false)
        onQuantityChange(item.id, item.quantity + 1)
    }

    const handleDecrease = () => {
        if (item.quantity <= 1) return

        onQuantityChange(item.id, item.quantity - 1)
        setShowOverStockWarning(false) // Z chắc ẩn khi giảm
    }

    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} className="item-image" />

            <div className="item-info">
                <p className="item-name">{item.name}</p>

                {/* 🔥 WARNING ĐỎ NHỎ - CHỈ HIỆN KHI CỐ VƯỢT STOCK */}
                {showOverStockWarning && currentStock !== null && (
                    <p className="stock-warning-text">
                        ⚠️ Hiện tại của hàng chỉ còn {currentStock} sản phẩm.
                    </p>
                )}
            </div>

            <div className="item-quantity">
                <button
                    className="quantity-btn minus-btn"
                    onClick={handleDecrease}
                    disabled={item.quantity <= 1 || loadingStock}
                >
                    -
                </button>
                <span className="quantity-display">
                    {loadingStock ? '...' : item.quantity}
                </span>
                <button
                    className="quantity-btn plus-btn"
                    onClick={handleIncrease}
                    disabled={loadingStock}
                >
                    +
                </button>
            </div>

            <div className="item-price">
                <p className="total-item-price">
                    {formatCurrency(item.price * item.quantity)}
                </p>
                <p className="price-per-item">
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
