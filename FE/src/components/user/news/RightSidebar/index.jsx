import React from 'react'
import ArticleListSection from '../ArticleListSection'
import ProductListSection from '~/components/user/product/ProductListSection'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import gaUXiDau from '~/assets/image/shared/product/ga-u-xi-dau.jpg'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'

import { slugify } from '~/utils/slugify'

const featuredPostsData = [
    {
        id: 1,
        title: 'Bí quyết chọn gà ủ muối ngon đúng chuẩn cho ngày Tết',
        imageUrl: gaUMuoi,
        slug: slugify('Bí quyết chọn gà ủ muối ngon đúng chuẩn cho ngày Tết'),
    },
    {
        id: 2,
        title: 'Cách làm pate gan vịt béo ngậy, không bị tanh tại nhà',
        imageUrl: pateGanVit,
        slug: slugify('Cách làm pate gan vịt béo ngậy, không bị tanh tại nhà'),
    },
    {
        id: 3,
        title: 'Gà Đông Tảo có gì đặc biệt mà giá lại đắt đỏ?',
        imageUrl: gaDongTaoUMuoi,
        slug: slugify('Gà Đông Tảo có gì đặc biệt mà giá lại đắt đỏ?'),
    },
    {
        id: 4,
        title: 'Bí quyết chọn gà ủ muối ngon đúng chuẩn cho ngày Tết',
        imageUrl: gaUMuoi,
        slug: slugify('Bí quyết chọn gà ủ muối ngon đúng chuẩn cho ngày Tết'),
    },
    {
        id: 5,
        title: 'Cách làm pate gan vịt béo ngậy, không bị tanh tại nhà',
        imageUrl: pateGanVit,
        slug: slugify('Cách làm pate gan vịt béo ngậy, không bị tanh tại nhà'),
    },
]

const consumerTipsData = [
    {
        id: 1,
        title: '5 cách bảo quản thực phẩm trong tủ lạnh được tươi lâu',
        imageUrl: gaUXiDau,
        slug: slugify('5 cách bảo quản thực phẩm trong tủ lạnh được tươi lâu'),
    },
    {
        id: 2,
        title: 'Mẹo hay khử mùi tanh của cá hiệu quả 100%',
        imageUrl: gaUMuoi,
        slug: slugify('Mẹo hay khử mùi tanh của cá hiệu quả 100%'),
    },
    {
        id: 3,
        title: 'Cách phân biệt gà ta và gà công nghiệp nhanh nhất',
        imageUrl: gaDongTaoUMuoi,
        slug: slugify('Cách phân biệt gà ta và gà công nghiệp nhanh nhất'),
    },
]

const promotionProductsData = [
    {
        id: 1,
        name: 'Gà ủ muối - Giảm 20%',
        imageUrl: gaUMuoi,
        price: '200.000đ',
        discountPrice: '160.000đ',
        slug: slugify('Gà ủ muối - Giảm 20%'),
    },
    {
        id: 2,
        name: 'Pate gan vịt - Mua 1 tặng 1',
        imageUrl: pateGanVit,
        price: '120.000đ',
        discountPrice: '120.000đ',
        slug: slugify('Pate gan vịt - Mua 1 tặng 1'),
    },
    {
        id: 3,
        name: 'Combo Gà Đông Tảo - Sale sốc',
        imageUrl: gaDongTaoUMuoi,
        price: '450.000đ',
        discountPrice: '360.000đ',
        slug: slugify('Combo Gà Đông Tảo - Sale sốc'),
    },
    {
        id: 4,
        name: 'Pate gan vịt - Mua 1 tặng 1',
        imageUrl: pateGanVit,
        price: '120.000đ',
        discountPrice: '120.000đ',
        slug: slugify('Pate gan vịt - Mua 1 tặng 1'),
    },
    {
        id: 5,
        name: 'Combo Gà Đông Tảo - Sale sốc',
        imageUrl: gaDongTaoUMuoi,
        price: '450.000đ',
        discountPrice: '360.000đ',
        slug: slugify('Combo Gà Đông Tảo - Sale sốc'),
    },
]

const RightSidebar = ({
    sections: {
        featuredPosts = true,
        consumerTips = true,
        promotions = true,
    } = {},
} = {}) => {
    return (
        <aside className="w-full max-w-xs rounded-lg p-4 font-sans">
            {featuredPosts && (
                <ArticleListSection
                    title="Bài viết nổi bật"
                    articles={featuredPostsData}
                />
            )}

            {consumerTips && (
                <ArticleListSection
                    title="Mẹo hay tiêu dùng"
                    articles={consumerTipsData}
                />
            )}

            {promotions && (
                <ProductListSection
                    title="Sản phẩm khuyến mãi"
                    products={promotionProductsData}
                    isPromotion={true}
                />
            )}
        </aside>
    )
}

export default RightSidebar
