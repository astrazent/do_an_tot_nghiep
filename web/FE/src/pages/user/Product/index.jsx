import React from 'react'
import ProductDetail from '~/components/user/product/ProductDetail'
import ProductImage from '~/components/user/product/ProductImage'
import CommentsSection from '~/components/user/product/comment/CommentSection'
import FeatureStrip from '~/components/shared/FeatureStrip'
import RelatedProduct from '~/components/user/product/RelatedProduct'
import { useParams } from 'react-router-dom'

const Product = () => {
    const { slug } = useParams()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProductImage slug={slug} />
            <ProductDetail slug={slug} />
            <div className="col-span-full mt-12">
                <FeatureStrip bordered={false} />
            </div>
            <div className="col-span-full">
                <CommentsSection slug={slug} />
            </div>
            <div className="col-span-full">
                <RelatedProduct title="Có thể bạn sẽ thích" slug={slug} />
            </div>
        </div>
    )
}

export default Product
