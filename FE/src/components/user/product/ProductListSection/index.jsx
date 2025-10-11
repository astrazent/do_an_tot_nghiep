import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

const ProductListSection = ({ title, products, isPromotion = false }) => {
    if (!title || !products || products.length === 0) return null

    return (
        <section className="mt-10">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-2">
                <h3 className="text-sm md:text-base font-bold text-gray-700 uppercase tracking-wide">
                    {title}
                </h3>
                <a
                    href="#"
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                    Xem tất cả
                    <FaArrowRight className="text-xs" />
                </a>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                    <a
                        key={product.id}
                        href={`/product/${product.id}`}
                        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all p-3 flex flex-col"
                    >
                        <div className="relative">
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-48 object-cover rounded-md group-hover:opacity-90 transition-opacity"
                            />
                            {isPromotion && product.discountPrice && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-md">
                                    -{Math.round(
                                        ((product.price - product.discountPrice) /
                                            product.price) *
                                            100
                                    )}
                                    %
                                </span>
                            )}
                        </div>

                        <div className="flex-1 mt-3">
                            <h5 className="text-sm font-semibold text-gray-800 line-clamp-2 group-hover:text-green-600 transition-colors">
                                {product.name}
                            </h5>

                            {isPromotion && product.discountPrice ? (
                                <div className="mt-2">
                                    <span className="block text-xs text-gray-400 line-through">
                                        {product.price.toLocaleString()} VNĐ
                                    </span>
                                    <span className="block text-sm text-red-600 font-bold">
                                        {product.discountPrice.toLocaleString()} VNĐ
                                    </span>
                                </div>
                            ) : (
                                <p className="text-sm text-green-600 font-bold mt-2">
                                    {product.price.toLocaleString()} VNĐ
                                </p>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}

export default ProductListSection
