import ArticleHeader from '~/components/user/newsDetail/ArticleHeader'
import ArticleBody from '~/components/user/newsDetail/ArticleBody'
import SocialSidebar from '~/components/user/newsDetail/SocialSidebar'
import RelatedArticle from '~/components/user/newsDetail/RelatedArticle'
import chanVitRutXuongUXiDau from '~/assets/image/shared/product/chan-vit-rut-xuong-u-xi-dau.png'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'

function NewsDetail() {
    return (
        <div className="min-h-screen">
            <main className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg relative">
                <SocialSidebar />
                <ArticleHeader />
                <ArticleBody />

                <RelatedArticle
                    title="Các bài viết liên quan"
                    articles={[
                        {
                            id: 1,
                            image: chanVitRutXuongUXiDau,
                            title: 'Bí quyết làm xúc xích cốm thơm ngon tại nhà',
                            date: '06/10/2025',
                        },
                        {
                            id: 2,
                            image: pateGanVit,
                            title: 'Xúc xích cốm – món ăn sáng lý tưởng cho ngày mới',
                            date: '03/10/2025',
                        },
                        {
                            id: 3,
                            image: gaDongTaoUMuoi,
                            title: 'Khám phá hương vị xúc xích cốm Hà Nội truyền thống',
                            date: '01/10/2025',
                        },
                        {
                            id: 1,
                            image: chanVitRutXuongUXiDau,
                            title: 'Bí quyết làm xúc xích cốm thơm ngon tại nhà',
                            date: '06/10/2025',
                        },
                        {
                            id: 2,
                            image: pateGanVit,
                            title: 'Xúc xích cốm – món ăn sáng lý tưởng cho ngày mới',
                            date: '03/10/2025',
                        },
                        {
                            id: 3,
                            image: gaDongTaoUMuoi,
                            title: 'Khám phá hương vị xúc xích cốm Hà Nội truyền thống',
                            date: '01/10/2025',
                        },
                        {
                            id: 1,
                            image: chanVitRutXuongUXiDau,
                            title: 'Bí quyết làm xúc xích cốm thơm ngon tại nhà',
                            date: '06/10/2025',
                        },
                        {
                            id: 2,
                            image: pateGanVit,
                            title: 'Xúc xích cốm – món ăn sáng lý tưởng cho ngày mới',
                            date: '03/10/2025',
                        },
                        {
                            id: 3,
                            image: gaDongTaoUMuoi,
                            title: 'Khám phá hương vị xúc xích cốm Hà Nội truyền thống',
                            date: '01/10/2025',
                        },
                    ]}
                />
            </main>
        </div>
    )
}

export default NewsDetail
