import React from 'react'
import ProductCard from '~/components/shared/ProductCard'

const ProductList = ({ products }) => {
    return (
        <div className="container mx-auto px-4">
            {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <div key={product.id}>
                                <ProductCard
                                    slug={product.slug} // truyền slug vào đây
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    oldPrice={product.oldPrice}
                                    ocop={product.ocop}
                                    rating={product.rating}
                                    reviewCount={product.reviewCount}
                                    size="small"
                                />
                        </div>
                    ))}
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
