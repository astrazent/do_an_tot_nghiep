import React from 'react'
import ProductCard from '~/components/shared/ProductCard'
import { formatCurrency } from '~/utils/formatCurrency'
const ProductList = ({ products }) => {
    return (
        <div className="container mx-auto px-4">
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => {
                        const rating =
                            product.rate_count > 0
                                ? product.rate_point_total / product.rate_count
                                : 0

                        return (
                            <div key={product.id}>
                                <ProductCard
                                    slug={product.slug}
                                    image={product.images[0]}
                                    name={product.name}
                                    price={formatCurrency(product.price)}
                                    oldPrice={formatCurrency(product.origin_price)}
                                    ocop={product.ocop_rating}
                                    rating={rating} // dùng rating mới tính
                                    reviewCount={product.reviewCount}
                                    size="small"
                                />
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        Không tìm thấy sản phẩm nào phù hợp.
                    </p>
                </div>
            )}
        </div>
    )
}

export default ProductList
