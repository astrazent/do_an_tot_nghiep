import React from 'react'
import ProductDetail from '~/components/user/product/ProductDetail'
import ProductImages from '~/components/user/product/ProductImage'
import CommentsSection from '~/components/user/product/comment/CommentSection'
import FeatureStrip from '~/components/shared/FeatureStrip'
import RelatedProduct from '~/components/user/product/RelatedProduct'
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

export const sampleRelatedProducts = [
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

const Product = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProductImages />
            <ProductDetail
                name="MỘC VỊT VÂN ĐÌNH"
                description={[
                    'Vịt Vân Đình – đặc sản nổi tiếng từ vùng Vân Đình, Hà Nội.',
                    'Thịt săn chắc, thơm ngon, giàu dinh dưỡng, thích hợp chế biến luộc, nướng, hấp hay quay.',
                    'Vịt được chăn thả tự nhiên, đảm bảo an toàn vệ sinh thực phẩm.',
                    'Mang hương vị đặc trưng, đậm đà, là lựa chọn hoàn hảo cho bữa cơm gia đình hoặc món ăn lễ hội.',
                ]}
                stockStatus={true}
                originalPrice={300000}
                salePrice={200000}
                rating={4}
                totalReviews={12}
            />
            <div className="col-span-full mt-12">
                <FeatureStrip bordered={false} />
            </div>
            <div className="col-span-full">
                <CommentsSection />
            </div>
            <div className="col-span-full">
                <RelatedProduct
                    title="Sản phẩm liên quan"
                    products={sampleRelatedProducts}
                />
            </div>
            <div className="col-span-full">
                <RelatedProduct
                    title="Có thể bạn sẽ thích"
                    products={sampleRelatedProducts}
                />
            </div>
        </div>
    )
}

export default Product
