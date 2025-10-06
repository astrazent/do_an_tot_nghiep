import React from 'react'
import ProductCollection from '~/components/user/home/ProductCollection'

const RelatedProduct = ({ title = 'Sản phẩm liên quan', products = [] }) => {
    return (
        <div className="pt-8 border-t">
            {title && (
                <h2 className="text-xl font-bold flex items-center uppercase mb-4">
                    <span className="w-1 h-6 bg-green-600 mr-2 inline-block"></span>
                    {title}
                </h2>
            )}

            <ProductCollection
                products={products}
                title=""
                backgroundColor="bg-transparent"
                autoPlay={false}
            />
        </div>
    )
}

export default RelatedProduct
