import React from 'react'
import { FaArrowRight } from 'react-icons/fa'
import ProductCollection from '~/components/user/home/ProductCollection'

const RelatedProduct = ({
    title = 'Sản phẩm liên quan',
    products = [],
    showViewAll = true,
    onViewAllClick, // ✅ thêm callback "Xem tất cả"
}) => {
    if (!products || products.length === 0) return null

    return (
        <section className="pt-10 border-t">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl md:text-2xl font-bold flex items-center uppercase text-gray-800">
                    <span className="w-1 h-6 bg-green-600 mr-2 rounded-full inline-block"></span>
                    {title}
                </h2>

                {/* Nút xem tất cả */}
                {showViewAll && (
                    <button
                        onClick={onViewAllClick}
                        className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
                    >
                        Xem tất cả
                        <FaArrowRight className="text-xs" />
                    </button>
                )}
            </div>

            {/* Danh sách sản phẩm */}
            <ProductCollection
                products={products}
                title=""
                backgroundColor="bg-transparent"
                autoPlay={false}
            />

            {/* Thông báo nếu sản phẩm ít */}
            {products.length < 4 && (
                <p className="text-gray-500 text-sm italic text-center mt-4">
                    Hiện chưa có nhiều sản phẩm liên quan để hiển thị.
                </p>
            )}
        </section>
    )
}

export default RelatedProduct
