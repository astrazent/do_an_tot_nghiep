//src/components/user/product/RightSidebar.jsx

import React from 'react'
import ArticleListSection from '../ArticleListSection'
import ProductListSection from '~/components/user/product/ProductListSection'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import gaUXiDau from '~/assets/image/shared/product/ga-u-xi-dau.jpg'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'

const featuredPostsData = [
    {
        id: 1,
        title: 'Bí quyết chọn gà ủ muối ngon đúng chuẩn cho ngày Tết',
        imageUrl: gaUMuoi,
    },
    {
        id: 2,
        title: 'Cách làm pate gan vịt béo ngậy, không bị tanh tại nhà',
        imageUrl: pateGanVit,
    },
    {
        id: 3,
        title: 'Gà Đông Tảo có gì đặc biệt mà giá lại đắt đỏ?',
        imageUrl: gaDongTaoUMuoi,
    },
    {
        id: 4,
        title: 'Bí quyết chọn gà ủ muối ngon đúng chuẩn cho ngày Tết',
        imageUrl: gaUMuoi,
    },
    {
        id: 5,
        title: 'Cách làm pate gan vịt béo ngậy, không bị tanh tại nhà',
        imageUrl: pateGanVit,
    },
]

const consumerTipsData = [
    {
        id: 1,
        title: '5 cách bảo quản thực phẩm trong tủ lạnh được tươi lâu',
        imageUrl: gaUXiDau,
    },
    {
        id: 2,
        title: 'Mẹo hay khử mùi tanh của cá hiệu quả 100%',
        imageUrl: gaUMuoi,
    },
    {
        id: 3,
        title: 'Cách phân biệt gà ta và gà công nghiệp nhanh nhất',
        imageUrl: gaDongTaoUMuoi,
    },
]

//===== DỮ LIỆU SẢN PHẨM KHUYẾN MÃI =====
const promotionProductsData = [
    {
        id: 1,
        name: 'Gà ủ muối - Giảm 20%',
        imageUrl: gaUMuoi,
        price: '200.000đ',
        discountPrice: '160.000đ',
    },
    {
        id: 2,
        name: 'Pate gan vịt - Mua 1 tặng 1',
        imageUrl: pateGanVit,
        price: '120.000đ',
        discountPrice: '120.000đ',
    },
    {
        id: 3,
        name: 'Combo Gà Đông Tảo - Sale sốc',
        imageUrl: gaDongTaoUMuoi,
        price: '450.000đ',
        discountPrice: '360.000đ',
    },
    {
        id: 4,
        name: 'Pate gan vịt - Mua 1 tặng 1',
        imageUrl: pateGanVit,
        price: '120.000đ',
        discountPrice: '120.000đ',
    },
    {
        id: 5,
        name: 'Combo Gà Đông Tảo - Sale sốc',
        imageUrl: gaDongTaoUMuoi,
        price: '450.000đ',
        discountPrice: '360.000đ',
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
