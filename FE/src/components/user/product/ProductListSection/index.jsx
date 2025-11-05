import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const ProductListSection = ({ title, products, isPromotion = false }) => {
    if (!title || !products || products.length === 0) return null

    return (
        <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                {title}
            </h3>
            <div className="mt-4 space-y-4">
                {products.map(product => (
                    <Link
                        to={product.slug ? `/product/${product.slug}` : '#'}
                        key={product.id}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                        <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-semibold text-gray-800 truncate group-hover:text-green-700 transition-colors">
                                {product.name}
                            </h5>

                            {isPromotion ? (
                                <div className="mt-1 flex flex-col">
                                    <span className="text-xs text-gray-400 line-through">
                                        {Number(product.origin_price).toLocaleString('vi-VN')} ₫
                                    </span>
                                    <span className="text-sm text-green-600 font-bold">
                                        {Number(product.price).toLocaleString('vi-VN')} ₫
                                    </span>
                                </div>
                            ) : (
                                <p className="text-sm text-green-600 font-bold mt-1">
                                    {Number(product.price).toLocaleString('vi-VN')} ₫
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default ProductListSection
