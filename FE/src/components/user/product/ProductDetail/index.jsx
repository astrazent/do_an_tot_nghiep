import React from 'react'
import {
    FaStar,
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
}) => {
    return (
        <div>
            <h1 className="text-2xl font-bold uppercase">{name}</h1>

            <div className="flex items-center my-5 space-x-2">
                <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                            key={index}
                            className={
                                index < rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            }
                        />
                    ))}
                </div>
                <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded border border-gray-300">
                    {totalReviews} đánh giá
                </span>
            </div>

            <div className="flex justify-between text-gray-600 text-sm my-5">
                <div className="flex items-center space-x-1">
                    <FaEye /> <span>{views.toLocaleString()} lượt xem</span>
                </div>
                <div className="flex items-center space-x-1">
                    <FaShoppingCart />{' '}
                    <span>{sold.toLocaleString()} đã bán</span>
                </div>
            </div>

            {description.map((line, idx) => (
                <p key={idx} className="text-gray-700 my-4">
                    {line}
                </p>
            ))}

            <div className="mt-12">
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

            <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-4 text-sm">
                <FaShoppingCart />
                <span>Thêm vào giỏ hàng</span>
            </button>
        </div>
    )
}

export default ProductDetail
