import React from 'react'
import {
    FaStar,
    FaRegStar,
    FaStarHalfAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaEye,
    FaShoppingCart,
} from 'react-icons/fa'

const ProductDetail = ({
    name = 'Sản phẩm',
    description = [],
    stockStatus = true,
    originalPrice,
    salePrice,
    rating = 0,
    totalReviews = 0,
    views = 0,
    sold = 0,
    additionalInfo = [],
    onAddToCart, // ✅ thêm props cho hành động thêm giỏ hàng
}) => {
    // ⭐ Làm đẹp rating — hiển thị nửa sao và sao rỗng
    const renderStars = () => {
        const stars = []
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<FaStar key={i} className="text-yellow-400" />)
            } else if (rating >= i - 0.5) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />)
            } else {
                stars.push(<FaRegStar key={i} className="text-gray-300" />)
            }
        }
        return stars
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            {/* Tên sản phẩm */}
            <h1 className="text-2xl font-bold uppercase text-gray-800">
                {name}
            </h1>

            {/* Đánh giá */}
            <div className="flex items-center my-5 space-x-2">
                <div className="flex space-x-1">{renderStars()}</div>
                <span className="bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded border border-gray-300">
                    {totalReviews} đánh giá
                </span>
            </div>

            {/* Thống kê */}
            <div className="flex justify-between text-gray-600 text-sm my-5">
                <div className="flex items-center space-x-1">
                    <FaEye className="text-gray-500" />
                    <span>{views.toLocaleString()} lượt xem</span>
                </div>
                <div className="flex items-center space-x-1">
                    <FaShoppingCart className="text-gray-500" />
                    <span>{sold.toLocaleString()} đã bán</span>
                </div>
            </div>

            {/* Mô tả sản phẩm */}
            {description.length > 0 ? (
                description.map((line, idx) => (
                    <p key={idx} className="text-gray-700 my-3 leading-relaxed">
                        {line}
                    </p>
                ))
            ) : (
                <p className="text-gray-500 italic my-3">Chưa có mô tả.</p>
            )}

            {/* Tình trạng hàng */}
            <div className="mt-8">
                <span className="font-bold mr-2">Tình trạng:</span>
                <span
                    className={`px-3 py-1 rounded-md text-sm font-medium inline-flex items-center space-x-1 ${
                        stockStatus
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {stockStatus ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>{stockStatus ? 'Còn hàng' : 'Hết hàng'}</span>
                </span>
            </div>

            {/* Giá */}
            <div className="my-6 flex items-baseline gap-4">
                {originalPrice && (
                    <span className="text-gray-400 line-through text-lg">
                        {originalPrice.toLocaleString()} VNĐ
                    </span>
                )}
                {salePrice && (
                    <span className="text-red-600 font-semibold text-3xl">
                        {salePrice.toLocaleString()} VNĐ
                    </span>
                )}
            </div>

            {/* Thông tin thêm */}
            {additionalInfo.length > 0 && (
                <div className="my-6 border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">
                        Thông tin thêm:
                    </h3>
                    <ul className="list-disc pl-5 text-gray-600 text-sm space-y-1">
                        {additionalInfo.map((item, idx) => (
                            <li key={idx}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Nút thêm giỏ hàng */}
            <button
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded text-sm font-medium w-full transition-all duration-300 ${
                    stockStatus
                        ? 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                onClick={stockStatus ? onAddToCart : undefined}
                disabled={!stockStatus}
            >
                <FaShoppingCart />
                <span>
                    {stockStatus ? 'Thêm vào giỏ hàng' : 'Hết hàng'}
                </span>
            </button>
        </div>
    )
}

export default ProductDetail
