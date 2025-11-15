import React from 'react'
import ArticleListSection from '../ArticleListSection'
import ProductListSection from '~/components/user/product/ProductListSection'
import { usePosts } from '~/hooks/user/usePost'
import { usePromotionProducts } from '~/hooks/user/useProduct'
const RightSidebar = ({
    sections: {
        featuredPosts = true,
        consumerTips = true,
        promotions = true,
    } = {},
} = {}) => {
    const {
        data: featuredPostsResult,
        isLoading: isFeaturedLoading,
        isError: isFeaturedError,
    } = usePosts({ type: 'postType', slug: 'tin-tuc-am-thuc', limit: 3 })

    const {
        data: consumerTipsResult,
        isLoading: isTipsLoading,
        isError: isTipsError,
    } = usePosts({ type: 'postType', slug: 'meo-hay-tieu-dung', limit: 3 })

    const {
        data: promotionProductsResult,
        isLoading: isPromotionLoading,
        isError: isPromotionError,
    } = usePromotionProducts(3)

    return (
        <aside className="w-full max-w-xs rounded-lg font-sans">
            {featuredPosts && (
                <>
                    {isFeaturedLoading && (
                        <div>Đang tải bài viết nổi bật...</div>
                    )}
                    {isFeaturedError && (
                        <div>Lỗi khi tải bài viết nổi bật.</div>
                    )}
                    {featuredPostsResult && (
                        <ArticleListSection
                            title="Tin tức ẩm thực"
                            articles={featuredPostsResult}
                        />
                    )}
                </>
            )}

            {consumerTips && (
                <>
                    {isTipsLoading && <div>Đang tải mẹo hay tiêu dùng...</div>}
                    {isTipsError && <div>Lỗi khi tải mẹo hay tiêu dùng.</div>}
                    {consumerTipsResult && (
                        <ArticleListSection
                            title="Mẹo hay tiêu dùng"
                            articles={consumerTipsResult}
                        />
                    )}
                </>
            )}

            {promotions && (
                <>
                    {isPromotionLoading && <div>Đang tải sản phẩm...</div>}
                    {isPromotionError && (
                        <div>Lỗi khi tải sản phẩm khuyến mãi.</div>
                    )}
                    {promotionProductsResult && (
                        <ProductListSection
                            title="Sản phẩm khuyến mãi"
                            products={promotionProductsResult.data || []}
                            isPromotion={true}
                        />
                    )}
                </>
            )}
        </aside>
    )
}

export default RightSidebar
