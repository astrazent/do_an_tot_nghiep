import React from 'react'
import {
    FaStar,
    FaCheckCircle,
    FaTimesCircle,
    FaShoppingCart,
} from 'react-icons/fa'
import { useProductBySlug } from '~/hooks/user/useProduct'

const ProductDetail = ({ slug }) => {
    const { data: product, isLoading, isError, error } = useProductBySlug(slug)
    if (isLoading) {
        return (
            <div className="animate-pulse text-gray-400">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="text-red-600 bg-red-50 border border-red-200 p-4 rounded-md">
                Lỗi tải thông tin sản phẩm: {error?.message || 'Không xác định'}
            </div>
        )
    }

    if (!product) {
        return (
            <div className="text-gray-600 italic">
                Không tìm thấy thông tin sản phẩm.
            </div>
        )
    }

    const {
        name = 'Sản phẩm',
        description = 'Không có mô tả.',
        origin_price,
        price,
        buyed = 0,
        rate_point_total = 0,
        rate_count = 0,
        stock_qty = 0,
    } = product

    const averageRating =
        rate_count > 0 ? Math.round(rate_point_total / rate_count) : 0
    const isAvailable = stock_qty > 0
    const originalPrice = origin_price ? parseFloat(origin_price) : null
    const salePrice = price ? parseFloat(price) : null

    const handleAddToCart = () => {
        console.log('Thêm vào giỏ hàng:', slug)
    }

    return (
        <div>
            <h1 className="text-2xl font-bold uppercase">{name}</h1>

            <div className="flex items-center my-5 space-x-2">
                <div className="flex space-x-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <FaStar
                            key={index}
                            className={
                                index < averageRating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                            }
                        />
                    ))}
                </div>
                <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded border border-gray-300">
                    {rate_count} đánh giá
                </span>
            </div>

            <div className="flex justify-between text-gray-600 text-sm my-5">
                <div className="flex items-center space-x-1">
                    <FaShoppingCart />
                    <span>{buyed.toLocaleString('vi-VN')} đã bán</span>
                </div>
            </div>

            {Array.isArray(description) ? (
                description.map((line, idx) => (
                    <p key={idx} className="text-gray-700 my-4">
                        {line}
                    </p>
                ))
            ) : (
                <p className="text-gray-700 my-4">{description}</p>
            )}

            <div className="mt-12">
                <span className="font-bold mr-2">Tình trạng:</span>
                <span
                    className={`px-3 py-1 rounded-md text-sm font-medium inline-flex items-center space-x-1 ${
                        isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                    {isAvailable ? <FaCheckCircle /> : <FaTimesCircle />}
                    <span>{isAvailable ? 'Còn hàng' : 'Hết hàng'}</span>
                </span>
            </div>

            <div className="my-6 flex items-baseline gap-4">
                {originalPrice && (
                    <span className="text-gray-400 line-through text-lg">
                        {originalPrice.toLocaleString('vi-VN')}₫
                    </span>
                )}
                {salePrice && (
                    <span className="text-red-600 font-semibold text-3xl">
                        {salePrice.toLocaleString('vi-VN')}₫
                    </span>
                )}
            </div>

            <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className={`flex items-center justify-center gap-2 text-white px-4 py-2 rounded mt-4 text-sm ${
                    isAvailable
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                }`}
            >
                <FaShoppingCart />
                <span>Thêm vào giỏ hàng</span>
            </button>

            <p className="mt-4 text-xs text-gray-500 italic">
                Mã sản phẩm: {slug}
            </p>
        </div>
    )
}

export default ProductDetail
