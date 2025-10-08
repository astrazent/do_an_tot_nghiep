import React from 'react'
import FixedNavbar from '~/components/user/home/FixedNavbar'
import Banner from '~/components/user/home/Banner'
import Header from '~/components/user/home/Header'
import Footer from '~/components/user/home/Footer'
import ProductCollection from '~/components/user/home/ProductCollection'
import FeedbackCollection from '~/components/user/home/FeedbackCollection'
import LatestNews from '~/components/user/home/LatestNews'
import { useState } from 'react'
import './home.scss'
import LogoCarousel from '~/components/user/home/LogoCarousel'

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
//Nhận xét từ khách hàng
import damVinhHungAvatar from '~/assets/image/shared/layout/avatar/dam-vinh-hung.png'
import hoaiLinhAvatar from '~/assets/image/shared/layout/avatar/hoai-linh.png'
import ngocTrinhAvatar from '~/assets/image/shared/layout/avatar/ngoc-trinh.png'
import quangLinhAvatar from '~/assets/image/shared/layout/avatar/quang-linh.png'
import thuyTienAvatar from '~/assets/image/shared/layout/avatar/thuy-tien.png'
//Ảnh báo
import news1 from '~/assets/image/shared/news/tai-sao-nen-mua-ga-u-muoi-tai-bep-sach-viet.jpg'
import news2 from '~/assets/image/shared/news/5-ly-do-tai-sao-ban-nen-chon-mua-cha-vit-tu-bep-sach-viet.png'
import news3 from '~/assets/image/shared/news/an-uong-lanh-manh-voi-hat-va-trai-cay-say-bi-quyet-dinh-duong-tu-bep-sach-viet.jpg'
import news4 from '~/assets/image/shared/news/hanh-trinh-gin-giu-huong-vi-viet-cung-bep-sach-viet.png'
import news5 from '~/assets/image/shared/news/cha-vit-thuy-manh-duoc-ton-vinh-thuong-hieu-vang-nong-nghiep-viet-nam-nam-2023.jpg'
import news6 from '~/assets/image/shared/news/festival-nong-san-ha-noi-lan-2-tai-ung-hoa.jpg'
import news7 from '~/assets/image/shared/news/mon-moi-cha-chan-vit-thuy-manh.png'
import news8 from '~/assets/image/shared/news/moc-vit-mot-dac-san-khac-cua-van-dinh-chua-nhieu-nguoi-biet-den.png'

export const newestProducts = [
    {
        id: 'p01',
        name: 'Đặc sản Vân Đình Vịt Ủ Xì Dầu',
        price: '180.000₫',
        oldPrice: '200.000₫',
        image: vitUxiDau,
        ocop: 4,
        rating: 5,
        reviewCount: 12,
    },
    {
        id: 'p02',
        name: 'Gà Ủ Muối Nguyên Con',
        price: '150.000₫',
        oldPrice: '160.000₫',
        image: gaUMuoi,
        ocop: 3,
        rating: 4,
        reviewCount: 8,
    },
    {
        id: 'p03',
        name: 'Chân Vịt Rút Xương Ủ Muối',
        price: '85.000₫',
        oldPrice: null,
        image: chanVitRutXuongUMuoi,
        ocop: null,
        rating: 3,
        reviewCount: 5,
    },
    {
        id: 'sr01',
        name: 'Chả Cá Thác Lác Tươi',
        price: '95.000₫',
        oldPrice: '110.000₫',
        image: chaCaThacLacTuoi,
        ocop: null,
        rating: 4,
        reviewCount: 7,
    },
    {
        id: 'sr02',
        name: 'Chả Cốm Hà Nội',
        price: '80.000₫',
        oldPrice: null,
        image: chaComHaNoi,
        ocop: 3,
        rating: 5,
        reviewCount: 15,
    },
    {
        id: 'ps01',
        name: 'Khâu Nhục Lạng Sơn',
        price: '130.000₫',
        oldPrice: '150.000₫',
        image: khauNhucLangSon,
        ocop: 4,
        rating: 4,
        reviewCount: 9,
    },
]

export const poultryProducts = [
    {
        id: 'p01',
        name: 'Đặc sản Vân Đình Vịt Ủ Xì Dầu',
        price: '180.000₫',
        oldPrice: '200.000₫',
        image: vitUxiDau,
        ocop: 4,
        rating: 5,
        reviewCount: 12,
    },
    {
        id: 'p02',
        name: 'Gà Ủ Muối Nguyên Con',
        price: '150.000₫',
        oldPrice: null,
        image: gaUMuoi,
        ocop: 3,
        rating: 4,
        reviewCount: 8,
    },
    {
        id: 'p03',
        name: 'Chân Vịt Rút Xương Ủ Muối',
        price: '85.000₫',
        oldPrice: null,
        image: chanVitRutXuongUMuoi,
        ocop: null,
        rating: 3,
        reviewCount: 5,
    },
    {
        id: 'p04',
        name: 'Gà Đông Tảo Ủ Muối',
        price: '250.000₫',
        oldPrice: '280.000₫',
        image: gaDongTaoUMuoi,
        ocop: 4,
        rating: 5,
        reviewCount: 15,
    },
    {
        id: 'p05',
        name: 'Chân Vịt Rút Xương Ủ Xì Dầu',
        price: '85.000₫',
        oldPrice: null,
        image: chanVitRutXuongUXiDau,
        ocop: null,
        rating: 3,
        reviewCount: 6,
    },
    {
        id: 'p06',
        name: 'Gà Ủ Xì Dầu',
        price: '160.000₫',
        oldPrice: '180.000₫',
        image: gaUXiDau,
        ocop: 3,
        rating: 4,
        reviewCount: 10,
    },
    {
        id: 'p07',
        name: 'Pate Gan Vịt',
        price: '90.000₫',
        oldPrice: null,
        image: pateGanVit,
        ocop: null,
        rating: 4,
        reviewCount: 4,
    },
    {
        id: 'p08',
        name: 'Chả Vịt Thủy Mạnh (Vân Đình)',
        price: '120.000₫',
        oldPrice: '140.000₫',
        image: chaVitThuyManh,
        ocop: 3,
        rating: 5,
        reviewCount: 9,
    },
    {
        id: 'p09',
        name: 'Mộc Vịt Vân Đình',
        price: '70.000₫',
        oldPrice: null,
        image: mocVitVanDinh,
        ocop: null,
        rating: 3,
        reviewCount: 3,
    },
]

export const sausageAndRollProducts = [
    {
        id: 'sr01',
        name: 'Chả Cá Thác Lác Tươi',
        price: '95.000₫',
        oldPrice: '110.000₫',
        image: chaCaThacLacTuoi,
        ocop: null,
        rating: 4,
        reviewCount: 7,
    },
    {
        id: 'sr02',
        name: 'Chả Cốm Hà Nội',
        price: '80.000₫',
        oldPrice: null,
        image: chaComHaNoi,
        ocop: 3,
        rating: 5,
        reviewCount: 15,
    },
    {
        id: 'sr03',
        name: 'Nem Lui Nha Trang',
        price: '75.000₫',
        oldPrice: null,
        image: nemLuiNhaTrang,
        ocop: null,
        rating: 4,
        reviewCount: 6,
    },
    {
        id: 'sr04',
        name: 'Chả Chìa Hải Phòng',
        price: '110.000₫',
        oldPrice: '120.000₫',
        image: chaChiaHaiPhong,
        ocop: 3,
        rating: 4,
        reviewCount: 8,
    },
    {
        id: 'sr05',
        name: 'Chả Cá Thác Lác Hậu Giang',
        price: '105.000₫',
        oldPrice: null,
        image: chaCaThacLacHauGiang,
        ocop: null,
        rating: 4,
        reviewCount: 5,
    },
    {
        id: 'sr06',
        name: 'Nem Hà Nội',
        price: '70.000₫',
        oldPrice: null,
        image: nemHaNoi,
        ocop: null,
        rating: 3,
        reviewCount: 4,
    },
    {
        id: 'sr07',
        name: 'Chả Ốc Nứa',
        price: '90.000₫',
        oldPrice: null,
        image: chaOcNua,
        ocop: 3,
        rating: 4,
        reviewCount: 6,
    },
    {
        id: 'sr08',
        name: 'Chả Sụn',
        price: '85.000₫',
        oldPrice: null,
        image: chaSun,
        ocop: null,
        rating: 3,
        reviewCount: 5,
    },
    {
        id: 'sr09',
        name: 'Chả Chân Vịt',
        price: '65.000₫',
        oldPrice: null,
        image: chaChanVit,
        ocop: null,
        rating: 3,
        reviewCount: 3,
    },
    {
        id: 'sr10',
        name: 'Mộc Ốc',
        price: '60.000₫',
        oldPrice: null,
        image: mocOc,
        ocop: null,
        rating: 3,
        reviewCount: 2,
    },
    {
        id: 'sr11',
        name: 'Xúc Xích Cốm',
        price: '75.000₫',
        oldPrice: null,
        image: xucXichCom,
        ocop: null,
        rating: 4,
        reviewCount: 4,
    },
    {
        id: 'sr12',
        name: 'Chả Cá Thác Lác Tẩm Gia Vị',
        price: '100.000₫',
        oldPrice: '115.000₫',
        image: chaCaThacLacTamGiaVi,
        ocop: null,
        rating: 4,
        reviewCount: 7,
    },
]

export const porkSpecialties = [
    {
        id: 'ps01',
        name: 'Khâu Nhục Lạng Sơn',
        price: '130.000₫',
        oldPrice: '150.000₫',
        image: khauNhucLangSon,
        ocop: 4,
        rating: 4,
        reviewCount: 8,
    },
    {
        id: 'ps02',
        name: 'Tai Heo Ủ Tương',
        price: '95.000₫',
        oldPrice: null,
        image: taiHeoUTuong,
        ocop: null,
        rating: 3,
        reviewCount: 5,
    },
    {
        id: 'ps03',
        name: 'Tai Heo Ủ Muối',
        price: '90.000₫',
        oldPrice: null,
        image: taiHeoUMuoi,
        ocop: null,
        rating: 3,
        reviewCount: 4,
    },
    {
        id: 'ps04',
        name: 'Chân Giò Giả Cầy',
        price: '110.000₫',
        oldPrice: '125.000₫',
        image: chanGioGiaCay,
        ocop: null,
        rating: 4,
        reviewCount: 6,
    },
    {
        id: 'ps05',
        name: 'Tai Heo Ủ Xì Dầu',
        price: '95.000₫',
        oldPrice: null,
        image: taiHeoUXiDau,
        ocop: 3,
        rating: 3,
        reviewCount: 4,
    },
]

//Dữ liệu mẫu cho feedback
const customerFeedback = [
    {
        id: 'cfb01',
        name: 'Ca sĩ Đàm Vĩnh Hưng',
        location: 'TP. Hồ Chí Minh',
        avatar: damVinhHungAvatar,
        feedback:
            'Các món đặc sản ở đây rất tinh tế và đặc sắc. Hưng đã dùng để đãi bạn bè trong một buổi tiệc nhỏ và ai cũng phải tấm tắc khen ngợi. Chắc chắn sẽ là khách hàng thân thiết!',
    },
    {
        id: 'cfb02',
        name: 'NSƯT Hoài Linh',
        location: 'TP. Hồ Chí Minh',
        avatar: hoaiLinhAvatar,
        feedback:
            'Mấy món ăn ở đây đậm đà hương vị quê nhà, ăn một miếng là nhớ cả tuổi thơ. Món nào cũng được chế biến kỹ lưỡng, sạch sẽ. Bà con ai muốn ăn đồ ngon thì cứ ghé đây!',
    },
    {
        id: 'cfb03',
        name: 'Người mẫu Ngọc Trinh',
        location: 'TP. Hồ Chí Minh',
        avatar: ngocTrinhAvatar,
        feedback:
            'Dù bận rộn nhưng Trinh vẫn muốn tự tay chuẩn bị bữa ăn ngon cho mình. Các món ăn sẵn ở đây vừa tiện lợi lại vừa ngon miệng, giúp Trinh tiết kiệm được rất nhiều thời gian.',
    },
    {
        id: 'cfb04',
        name: 'Vlogger Quang Linh',
        location: 'Châu Phi & Việt Nam',
        avatar: quangLinhAvatar,
        feedback:
            'Linh đã mang mấy món đặc sản này sang Châu Phi để giới thiệu cho team. Ai cũng thích mê hương vị Việt Nam. Cảm ơn shop đã có những sản phẩm chất lượng.',
    },
    {
        id: 'cfb05',
        name: 'Hoa hậu Thùy Tiên',
        location: 'TP. Hồ Chí Minh',
        avatar: thuyTienAvatar,
        feedback:
            'Tiên rất chú trọng đến những bữa ăn gia đình. Các sản phẩm ở đây không chỉ ngon mà còn đảm bảo vệ sinh, giúp Tiên an tâm chuẩn bị những món ăn ấm cúng cho cả nhà.',
    },
]

const articlesData = [
    {
        id: 1,
        title: 'Tại Sao Nên Mua Gà Ủ Muối Tại Bếp Sạch Việt?',
        date: '25/09/2025',
        image: news1,
        slug: 'tai-sao-nen-mua-ga-u-muoi-tai-bep-sach-viet-1',
    },
    {
        id: 2,
        title: '5 lý do tại Sao Bạn Nên Chọn Mua Chả Vịt Từ Bếp Sạch Việt?',
        date: '24/09/2025',
        image: news2,
        slug: '5-ly-do-tai-sao-ban-nen-chon-mua-cha-vit-tu-bep-sach-viet-2',
    },
    {
        id: 3,
        title: 'Ăn Uống Lành Mạnh Với Hạt Và Trái Cây Sấy – Bí Quyết Dinh Dưỡng Từ Bếp Sạch Việt',
        date: '23/09/2025',
        image: news3,
        slug: 'an-uong-lanh-manh-voi-hat-va-trai-cay-say-bi-quyet-dinh-duong-tu-bep-sach-viet-3',
    },
    {
        id: 4,
        title: 'Hành trình gìn giữ hương vị Việt cùng Bếp sạch Việt',
        date: '22/09/2025',
        image: news4,
        slug: 'hanh-trinh-gin-giu-huong-vi-viet-cung-bep-sach-viet-4',
    },
    {
        id: 5,
        title: 'Chả vịt Thúy Mạnh được tôn vinh Thương hiệu Vàng nông nghiệp Việt Nam năm 2023',
        date: '19/09/2025',
        image: news5,
        slug: 'cha-vit-thuy-manh-duoc-ton-vinh-thuong-hieu-vang-nong-nghiep-viet-nam-2023-5',
    },
    {
        id: 6,
        title: 'Festival nông sản Hà nội lần 2 tại Ứng Hòa',
        date: '18/09/2025',
        image: news6,
        slug: 'festival-nong-san-ha-noi-lan-2-tai-ung-hoa-6',
    },
    {
        id: 7,
        title: 'Món mới: Chả chân vịt Thúy Mạnh',
        date: '17/09/2025',
        image: news7,
        slug: 'mon-moi-cha-chan-vit-thuy-manh-7',
    },
    {
        id: 8,
        title: 'Mọc vịt – một đặc sản khác của Vân Đình chưa nhiều người biết đến',
        date: '16/09/2025',
        image: news8,
        slug: 'moc-vit-mot-dac-san-khac-cua-van-dinh-chua-nhieu-nguoi-biet-den-8',
    },
]
const home = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const articlesPerPage = 8
    const totalPages = Math.ceil(articlesData.length / articlesPerPage)

    const currentArticles = articlesData.slice(
        (currentPage - 1) * articlesPerPage,
        currentPage * articlesPerPage
    )

    const handlePageChange = page => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page)
            window.scrollTo(0, 0)
        }
    }
    return (
        <div>
            <Header />
            <FixedNavbar />
            <Banner />
            <ProductCollection
                title="Các Món Từ Gà & Vịt"
                products={newestProducts}
                backgroundColor="bg-white"
            />
            <ProductCollection
                title="Các Loại Chả & Nem"
                products={sausageAndRollProducts}
                backgroundColor="bg-gray-100"
            />
            <ProductCollection
                title="Các Món Từ Gà & Vịt"
                products={poultryProducts}
                backgroundColor="bg-white"
            />
            <ProductCollection
                title="Đặc Sản Chế Biến Từ Heo"
                products={porkSpecialties}
                backgroundColor="bg-gray-100"
            />
            <FeedbackCollection
                feedbackItems={customerFeedback}
                backgroundColor="bg-white"
            />
            <LatestNews
                title="Tin tức mới nhất"
                articles={articlesData}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                backgroundColor="bg-gray-100"
            />
            <LogoCarousel />
            <Footer />
        </div>
    )
}

export default home
