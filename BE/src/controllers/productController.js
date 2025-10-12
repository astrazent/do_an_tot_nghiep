import {
    fetchProducts,
    getProductDetailBySlug,
    getProductImages,
    getRelatedProducts,
    increaseProductViews,
} from '../services/productService.js'

export const getProductsDetail = async (req, res) => {
    const { slug } = req.params
    try {
        //1. lay chi tiet san pham
        const product = await getProductDetailBySlug(slug)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        //2. lay hinh anh va san pham lien quan
        const [images, relatedProducts] = await Promise.all([
            getProductImages(product.id),
            getRelatedProducts(product.category_id, product.id, 8)
        ]);

        //3. tang luot xem
         increaseProductViews(slug).catch(err => console.error('Lỗi khi tăng views:', err));
        
          // 💡 Bước 3.5: Chuẩn hóa dữ liệu hình ảnh cho Frontend
        const standardizedImages = images.map(img => ({
            id: img.id,
            image_url: img.image_url,
            is_main: img.is_main,
            type: 'image', // 🚨 Thêm type tĩnh để frontend không bị lỗi
            // Nếu bạn có video, bạn cần thêm cột 'type' vào DB
        }));

         // 4. Chuẩn hóa dữ liệu 
         const finalProductData = {
            id: product.id,
            name: product.name,
            slug: product.slug,
            // 💡 Chuẩn hóa: description có thể là NULL, cần xử lý
            description: product.description ? product.description.split('\n') : [],
            images: standardizedImages,
            // 💡 Chuẩn hóa: DECIMAL sang Float
            origin_price: parseFloat(product.origin_price) || 0, 
            price: parseFloat(product.price) || 0,
            
            // 💡 Chuẩn hóa: INT UNSIGNED sang Integer
            buyed: parseInt(product.buyed),
            rate_count: parseInt(product.rate_count),
            stock_qty: parseInt(product.stock_qty),
            
            status: product.status,
            category_name: product.category_name,
            ocop_rating: product.ocop_rating,
            views: parseInt(product.views) + 1, // Views đã tăng
            
            // Dữ liệu tính toán từ Model
            rating: Number(product.average_rating || 0).toFixed(2), 
            stockStatus: product.stock_qty > 0 && product.status === 1,
            images: images,
            
            // ... (additionalInfo)
        };

        return res.json({ product: finalProductData, relatedProducts: relatedProducts });

    } catch (error) {
        console.error('Error in getProducts:', error)
        res.status(500).json({ message: 'Server error' })
    }
}
