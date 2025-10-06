//src/App.jsx
import React from 'react'
import FeaturedSection from '~/components/user/news/FeaturedSection'
import HotTopics from '~/components/user/news/HotTopic'
import ArticleList from '~/components/user/news/ArticleList'
//Nhóm Gà, Vịt
import vitUxiDau from '~/assets/image/shared/product/dac-san-van-dinh-vit-u-xi-dau.jpg'
import chaVitThuyManh from '~/assets/image/shared/product/dac-san-van-dinh-cha-vit-thuy-manh.jpg'
import mocVitVanDinh from '~/assets/image/shared/product/dac-san-moc-vit-van-dinh.png'
import chanVitRutXuongUMuoi from '~/assets/image/shared/product/chan-vit-rut-xuong-u-muoi.png'
import chanVitRutXuongUXiDau from '~/assets/image/shared/product/chan-vit-rut-xuong-u-xi-dau.png'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import gaUXiDau from '~/assets/image/shared/product/ga-u-xi-dau.jpg'
//Nhóm Chả & Nem
import chaChanVit from '~/assets/image/shared/product/dac-san-cha-chan-vit.png'
import chaCaThacLacTuoi from '~/assets/image/shared/product/cha-ca-thac-lac-tuoi.jpg'
import chaCaThacLacHauGiang from '~/assets/image/shared/product/cha-ca-thac-lac-hau-giang.jpg'
import chaCaThacLacTamGiaVi from '~/assets/image/shared/product/cha-ca-thac-lac-tuoi-tam-gia-vi.png'
import chaChiaHaiPhong from '~/assets/image/shared/product/dac-san-cha-chia-hai-phong.jpg'
import chaComHaNoi from '~/assets/image/shared/product/dac-san-cha-com-ha-noi.jpg'
import chaOcNua from '~/assets/image/shared/product/dac-san-cha-oc-nua.png'
import chaSun from '~/assets/image/shared/product/dac-san-cha-sun.jpg'
import mocOc from '~/assets/image/shared/product/moc-oc.png'
import nemHaNoi from '~/assets/image/shared/product/nem-ha-noi.jpg'
import nemLuiNhaTrang from '~/assets/image/shared/product/nem-lui-nha-trang.jpg'
import xucXichCom from '~/assets/image/shared/product/xuc-xich-com.png'
//Nhóm Heo & Đặc sản khác
import chanGioGiaCay from '~/assets/image/shared/product/chan-gio-gia-cay.jpg'
import khauNhucLangSon from '~/assets/image/shared/product/khau-nhuc-lang-son.jpg'
import taiHeoUMuoi from '~/assets/image/shared/product/tai-heo-u-muoi.png'
import taiHeoUXiDau from '~/assets/image/shared/product/tai-heo-u-xi-dau.png'
import taiHeoUTuong from '~/assets/image/shared/product/tai-heo-u-tuong.png'

const articles = [
    {
        id: 1,
        title: 'Đặc Sản Vân Đình Vịt Ủ Xì Dầu',
        summary:
            'Đặc sản Vân Đình Vịt Ủ Xì Dầu mang đến hương vị đậm đà khó quên — thịt vịt được chọn lọc kỹ lưỡng, ướp cùng xì dầu thơm ngon rồi ủ trong nhiều giờ để thấm đều gia vị.',
        imageUrl: vitUxiDau,
        category: 'Gà, Vịt',
        timestamp: '1 giờ trước',
        type: 'featured_main',
    },

    {
        id: 2,
        title: 'Đặc Sản Vân Đình Chả Vịt Thủy Mãn',
        summary: 'Thưởng thức món Chả Vịt Thủy Mãn thơm ngon, độc đáo.',
        imageUrl: chaVitThuyManh,
        category: 'Gà, Vịt',
        timestamp: '2 giờ trước',
        type: 'featured_side',
    },
    {
        id: 3,
        title: 'Đặc Sản Mộc Vịt Vân Đình',
        summary:
            'Mộc Vịt Vân Đình - Sự lựa chọn hoàn hảo cho bữa cơm gia đình.',
        imageUrl: mocVitVanDinh,
        category: 'Gà, Vịt',
        timestamp: '3 giờ trước',
        type: 'featured_side',
    },
    {
        id: 4,
        title: 'Chân Vịt Rút Xương Ủ Muối',
        summary:
            'Món nhâm nhi khoái khẩu không thể bỏ qua - Chân vịt rút xương ủ muối.',
        imageUrl: chanVitRutXuongUMuoi,
        category: 'Gà, Vịt',
        timestamp: '4 giờ trước',
        type: 'hot_topic',
    },
    {
        id: 5,
        title: 'Chân Vịt Rút Xương Ủ Xì Dầu',
        summary: 'Trải nghiệm hương vị mới lạ với Chân vịt rút xương ủ xì dầu.',
        imageUrl: chanVitRutXuongUXiDau,
        category: 'Gà, Vịt',
        timestamp: '5 giờ trước',
        type: 'hot_topic',
    },
    {
        id: 6,
        title: 'Pate Gan Vịt',
        summary: 'Pate Gan Vịt béo ngậy, mềm mịn, chuẩn vị Pháp.',
        imageUrl: pateGanVit,
        category: 'Gà, Vịt',
        timestamp: '6 giờ trước',
        type: 'hot_topic',
    },
    {
        id: 7,
        title: 'Gà Đông Tảo Ủ Muối',
        summary:
            'Thịt gà Đông Tảo săn chắc, đậm vị muối, một đặc sản tiến vua.',
        imageUrl: gaDongTaoUMuoi,
        category: 'Gà, Vịt',
        timestamp: '7 giờ trước',
        type: 'list_item',
    },
    {
        id: 8,
        title: 'Gà Ủ Muối',
        summary: 'Gà ủ muối da giòn, thịt ngọt, thơm lừng hương thảo mộc.',
        imageUrl: gaUMuoi,
        category: 'Gà, Vịt',
        timestamp: '8 giờ trước',
        type: 'list_item',
    },
    {
        id: 9,
        title: 'Gà Ủ Xì Dầu',
        summary: 'Khám phá sự kết hợp tuyệt vời giữa thịt gà và xì dầu.',
        imageUrl: gaUXiDau,
        category: 'Gà, Vịt',
        timestamp: '9 giờ trước',
        type: 'list_item',
    },
    {
        id: 10,
        title: 'Đặc Sản Chả Chân Vịt',
        summary: 'Chả chân vịt giòn sần sật, một món ngon không thể chối từ.',
        imageUrl: chaChanVit,
        category: 'Chả & Nem',
        timestamp: '10 giờ trước',
        type: 'hot_topic',
    },
    {
        id: 11,
        title: 'Chả Cá Thác Lác Tươi',
        summary: 'Chả cá thác lác tươi ngon, dai giòn tự nhiên.',
        imageUrl: chaCaThacLacTuoi,
        category: 'Chả & Nem',
        timestamp: '11 giờ trước',
        type: 'list_item',
    },
    {
        id: 12,
        title: 'Chả Cá Thác Lác Hậu Giang',
        summary: 'Đặc sản Chả cá thác lác Hậu Giang nức tiếng gần xa.',
        imageUrl: chaCaThacLacHauGiang,
        category: 'Chả & Nem',
        timestamp: '12 giờ trước',
        type: 'list_item',
    },
    {
        id: 13,
        title: 'Chả Cá Thác Lác Tươi Tẩm Gia Vị',
        summary:
            'Tiện lợi và thơm ngon với chả cá thác lác đã được tẩm ướp sẵn.',
        imageUrl: chaCaThacLacTamGiaVi,
        category: 'Chả & Nem',
        timestamp: '13 giờ trước',
        type: 'list_item',
    },
    {
        id: 14,
        title: 'Đặc Sản Chả Chìa Hải Phòng',
        summary: 'Chả chìa Hải Phòng - Món quà quý từ thành phố cảng.',
        imageUrl: chaChiaHaiPhong,
        category: 'Chả & Nem',
        timestamp: '14 giờ trước',
        type: 'hot_topic',
    },
    {
        id: 15,
        title: 'Đặc Sản Chả Cốm Hà Nội',
        summary: 'Hương vị mùa thu Hà Nội gói trọn trong món chả cốm dẻo thơm.',
        imageUrl: chaComHaNoi,
        category: 'Chả & Nem',
        timestamp: '15 giờ trước',
        type: 'list_item',
    },
    {
        id: 16,
        title: 'Đặc Sản Chả Ốc',
        summary: 'Chả ốc giòn dai, thơm mùi lá lốt, hấp dẫn mọi thực khách.',
        imageUrl: chaOcNua,
        category: 'Chả & Nem',
        timestamp: '16 giờ trước',
        type: 'list_item',
    },
    {
        id: 17,
        title: 'Đặc Sản Chả Sụn',
        summary:
            'Chả sụn sần sật, đậm đà, là món nhậu hay ăn cùng cơm đều tuyệt.',
        imageUrl: chaSun,
        category: 'Chả & Nem',
        timestamp: '17 giờ trước',
        type: 'list_item',
    },
    {
        id: 18,
        title: 'Mộc Ốc',
        summary: 'Sáng tạo cùng món mộc ốc, cho bữa ăn thêm phần phong phú.',
        imageUrl: mocOc,
        category: 'Chả & Nem',
        timestamp: '18 giờ trước',
        type: 'hot_topic',
    },
    {
        id: 19,
        title: 'Nem Hà Nội',
        summary:
            'Nem rán Hà Nội vỏ giòn rụm, nhân đầy đặn, chuẩn vị truyền thống.',
        imageUrl: nemHaNoi,
        category: 'Chả & Nem',
        timestamp: '19 giờ trước',
        type: 'list_item',
    },
    {
        id: 20,
        title: 'Nem Lụi Nha Trang',
        summary: 'Thưởng thức hương vị biển cả với món nem lụi Nha Trang.',
        imageUrl: nemLuiNhaTrang,
        category: 'Chả & Nem',
        timestamp: '20 giờ trước',
        type: 'list_item',
    },
    {
        id: 21,
        title: 'Xúc Xích Cốm',
        summary:
            'Sự kết hợp độc đáo giữa xúc xích và cốm, tạo nên hương vị khó quên.',
        imageUrl: xucXichCom,
        category: 'Chả & Nem',
        timestamp: '21 giờ trước',
        type: 'list_item',
    },
    {
        id: 22,
        title: 'Chân Giò Giả Cầy',
        summary: 'Chân giò giả cầy thơm lừng mùi riềng mẻ, đậm đà khó cưỡng.',
        imageUrl: chanGioGiaCay,
        category: 'Heo & Đặc sản khác',
        timestamp: '22 giờ trước',
        type: 'featured_main',
    },
    {
        id: 25,
        title: 'Tai Heo Ủ Xì Dầu',
        summary: 'Đổi vị với món tai heo ủ xì dầu thơm ngon, đậm vị.',
        imageUrl: taiHeoUXiDau,
        category: 'Heo & Đặc sản khác',
        timestamp: '1 ngày trước',
        type: 'hot_topic',
    },
    {
        id: 26,
        title: 'Tai Heo Ủ Tương',
        summary: 'Tai heo ủ tương - một biến tấu mới lạ cho món ăn quen thuộc.',
        imageUrl: taiHeoUTuong,
        category: 'Heo & Đặc sản khác',
        timestamp: '1 ngày trước',
        type: 'hot_topic',
    },
]

function News() {
    const mainArticle = articles.find(a => a.type === 'featured_main')
    const sideArticles = articles.filter(a => a.type === 'featured_side')
    const hotTopicArticles = articles.filter(a => a.type === 'hot_topic')
    const listArticles = articles.filter(a => a.type === 'list_item')

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <div className="container mx-auto p-4 md:p-8">
                <FeaturedSection
                    mainArticle={mainArticle}
                    sideArticles={sideArticles}
                />
                <HotTopics articles={hotTopicArticles} />
                <ArticleList articles={listArticles} />
            </div>
        </div>
    )
}

export default News
