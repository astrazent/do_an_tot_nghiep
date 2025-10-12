import React, {useState, useEffect} from 'react'
import axios from 'axios'   
import { useParams } from 'react-router-dom'; 
import ProductDetail from '~/components/user/product/ProductDetail'
import ProductImages from '~/components/user/product/ProductImage'
import CommentsSection from '~/components/user/product/comment/CommentSection'
import FeatureStrip from '~/components/shared/FeatureStrip'
import RelatedProduct from '~/components/user/product/RelatedProduct'
// import chaChanVit from '~/assets/image/shared/product/dac-san-cha-chan-vit.png'
// import chaCaThacLacTuoi from '~/assets/image/shared/product/cha-ca-thac-lac-tuoi.jpg'
// import chaCaThacLacHauGiang from '~/assets/image/shared/product/cha-ca-thac-lac-hau-giang.jpg'
// import chaCaThacLacTamGiaVi from '~/assets/image/shared/product/cha-ca-thac-lac-tuoi-tam-gia-vi.png'
// import chaChiaHaiPhong from '~/assets/image/shared/product/dac-san-cha-chia-hai-phong.jpg'
// import chaComHaNoi from '~/assets/image/shared/product/dac-san-cha-com-ha-noi.jpg'
// import chaOcNua from '~/assets/image/shared/product/dac-san-cha-oc-nua.png'
// import chaSun from '~/assets/image/shared/product/dac-san-cha-sun.jpg'
// import mocOc from '~/assets/image/shared/product/moc-oc.png'
// import nemHaNoi from '~/assets/image/shared/product/nem-ha-noi.jpg'
// import nemLuiNhaTrang from '~/assets/image/shared/product/nem-lui-nha-trang.jpg'
// import xucXichCom from '~/assets/image/shared/product/xuc-xich-com.png'

const API_BASE_URL = 'http://localhost:8023/v1'; 

// export const sampleRelatedProducts = [
//     {
//         id: 'sr01',
//         name: 'Chả Cá Thác Lác Tươi',
//         price: '95.000₫',
//         oldPrice: '110.000₫',
//         image: chaCaThacLacTuoi,
//         ocop: null,
//         rating: 4,
//         reviewCount: 7,
//     },
//     {
//         id: 'sr02',
//         name: 'Chả Cốm Hà Nội',
//         price: '80.000₫',
//         oldPrice: null,
//         image: chaComHaNoi,
//         ocop: 3,
//         rating: 5,
//         reviewCount: 15,
//     },
//     {
//         id: 'sr03',
//         name: 'Nem Lui Nha Trang',
//         price: '75.000₫',
//         oldPrice: null,
//         image: nemLuiNhaTrang,
//         ocop: null,
//         rating: 4,
//         reviewCount: 6,
//     },
//     {
//         id: 'sr04',
//         name: 'Chả Chìa Hải Phòng',
//         price: '110.000₫',
//         oldPrice: '120.000₫',
//         image: chaChiaHaiPhong,
//         ocop: 3,
//         rating: 4,
//         reviewCount: 8,
//     },
//     {
//         id: 'sr05',
//         name: 'Chả Cá Thác Lác Hậu Giang',
//         price: '105.000₫',
//         oldPrice: null,
//         image: chaCaThacLacHauGiang,
//         ocop: null,
//         rating: 4,
//         reviewCount: 5,
//     },
//     {
//         id: 'sr06',
//         name: 'Nem Hà Nội',
//         price: '70.000₫',
//         oldPrice: null,
//         image: nemHaNoi,
//         ocop: null,
//         rating: 3,
//         reviewCount: 4,
//     },
//     {
//         id: 'sr07',
//         name: 'Chả Ốc Nứa',
//         price: '90.000₫',
//         oldPrice: null,
//         image: chaOcNua,
//         ocop: 3,
//         rating: 4,
//         reviewCount: 6,
//     },
//     {
//         id: 'sr08',
//         name: 'Chả Sụn',
//         price: '85.000₫',
//         oldPrice: null,
//         image: chaSun,
//         ocop: null,
//         rating: 3,
//         reviewCount: 5,
//     },
//     {
//         id: 'sr09',
//         name: 'Chả Chân Vịt',
//         price: '65.000₫',
//         oldPrice: null,
//         image: chaChanVit,
//         ocop: null,
//         rating: 3,
//         reviewCount: 3,
//     },
//     {
//         id: 'sr10',
//         name: 'Mộc Ốc',
//         price: '60.000₫',
//         oldPrice: null,
//         image: mocOc,
//         ocop: null,
//         rating: 3,
//         reviewCount: 2,
//     },
//     {
//         id: 'sr11',
//         name: 'Xúc Xích Cốm',
//         price: '75.000₫',
//         oldPrice: null,
//         image: xucXichCom,
//         ocop: null,
//         rating: 4,
//         reviewCount: 4,
//     },
//     {
//         id: 'sr12',
//         name: 'Chả Cá Thác Lác Tẩm Gia Vị',
//         price: '100.000₫',
//         oldPrice: '115.000₫',
//         image: chaCaThacLacTamGiaVi,
//         ocop: null,
//         rating: 4,
//         reviewCount: 7,
//     },
// ]

const ProductPage = () => {
    const { slug } = useParams();

    const [productData, setProductData] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
     useEffect(() => {
        const fetchProductPageData = async () => {
            setLoading(true);
            setError(null);
            
            if (!slug) {
                setLoading(false);
                setError('Lỗi: Thiếu mã định danh (slug) sản phẩm.');
                return;
            }

            try {
                // 📞 Gọi API GET /api/products/:slug
                // Controller của bạn đã được sửa để trả về product, images, relatedProducts
                const response = await axios.get(`${API_BASE_URL}/products/${slug}`);
                
                // 📝 PHÂN CHIA DỮ LIỆU TRẢ VỀ TỪ CONTROLLER
                const { product, relatedProducts } = response.data;

                setProductData(product);
                setRelatedProducts(relatedProducts);
                
            } catch (err) {
                console.error("Lỗi khi tải trang sản phẩm:", err);
                // Xử lý lỗi 404 hoặc lỗi server
                const errMsg = err.response?.data?.message || 'Không thể kết nối đến server hoặc sản phẩm không tồn tại.';
                setError(errMsg);
                setProductData(null); 
            } finally {
                setLoading(false);
            }
        };

        fetchProductPageData();
    }, [slug]);
    
    // --- XỬ LÝ THÊM GIỎ HÀNG ---
    const handleAddToCart = async () => {
        if (!productData || !productData.stockStatus) return;

        try {
            await axios.post(`${API_BASE_URL}/cart/add`, {
                product_id: productData.id,
                qty: 1, 
            });
            alert(`Đã thêm ${productData.name} vào giỏ hàng thành công!`);
        } catch (error) {
            console.error("Lỗi khi thêm giỏ hàng:", error);
            alert("Lỗi: Không thể thêm vào giỏ hàng.");
        }
    };

    // --- HIỂN THỊ TRẠNG THÁI ---
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
                <p className="ml-3 text-lg text-gray-700">Đang tải chi tiết sản phẩm...</p>
            </div>
        );
    }

    if (error || !productData) {
        return (
            <div className="text-center p-12 bg-red-100 rounded-xl m-8 border border-red-300">
                <h2 className="text-2xl font-bold text-red-700">Lỗi Tải Sản Phẩm</h2>
                <p className="text-lg text-gray-700 mt-3">{error || 'Sản phẩm bạn đang tìm không tồn tại.'}</p>
            </div>
        );
    }
    
    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. PRODUCT IMAGES */}
                <ProductImages 
                    images={productData.images || []} 
                    name={productData?.name} 
                /> 
                
                {/* 2. PRODUCT DETAIL */}
                <ProductDetail
                    name={productData.name}
                    description={productData.description}
                    stockStatus={productData.stockStatus}
                    originalPrice={productData.origin_price}
                    salePrice={productData.price}
                    rating={productData.rating}
                    totalReviews={productData.rate_count}
                    views={productData.views}
                    sold={productData.buyed}
                    additionalInfo={productData.additionalInfo}
                    // Truyền hàm xử lý sự kiện xuống
                    onAddToCart={handleAddToCart}
                />
            </div>
            
            <div className="col-span-full mt-12">
                <FeatureStrip bordered={false} />
            </div>
            
            {/* 3. COMMENTS SECTION */}
            <div className="col-span-full mt-12">
                <CommentsSection 
                    productId={productData.id}
                    totalReviews={productData.rate_count}
                    averageRating={productData.rating}
                    // Thường component này sẽ tự fetch comments theo product.id
                />
            </div>
            
            {/* 4. RELATED PRODUCTS */}
            {relatedProducts.length > 0 && (
                <div className="col-span-full mt-12">
                    <RelatedProduct
                        title="Sản phẩm liên quan"
                        products={relatedProducts} 
                    />
                </div>
            )}
            
            {/* 5. YOU MAY LIKE (Tạm dùng lại data liên quan) */}
            {relatedProducts.length > 0 && (
                <div className="col-span-full mt-12">
                    <RelatedProduct
                        title="Có thể bạn sẽ thích"
                        products={relatedProducts} 
                    />
                </div>
            )}
        </div>
    );
};

export default ProductPage;