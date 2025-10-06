import React from 'react'

const ProductListSection = ({ title, products, isPromotion = false }) => {
    if (!title || !products || products.length === 0) return null

    return (
        <div className="mt-8">
            <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                {title}
            </h3>
            <div className="mt-4 space-y-4">
                {products.map(product => (
                    <a
                        href="#"
                        key={product.id}
                        className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-16 h-16 rounded-md object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <h5 className="text-sm font-semibold text-gray-800 truncate">
                                {product.name}
                            </h5>

                            {isPromotion && product.discountPrice ? (
                                <div className="mt-1 flex flex-col">
                                    <span className="text-xs text-gray-400 line-through">
                                        {product.price}
                                    </span>
                                    <span className="text-sm text-green-600 font-bold">
                                        {product.discountPrice}
                                    </span>
                                </div>
                            ) : (
                                <p className="text-sm text-green-600 font-bold mt-1">
                                    {product.price}
                                </p>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}

export default ProductListSection
