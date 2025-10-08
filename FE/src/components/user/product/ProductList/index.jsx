import React from 'react'
import ProductCard from '~/components/shared/ProductCard' // Đảm bảo đường dẫn đúng
import { Link } from 'react-router-dom'

// Component này giờ đây rất đơn giản, chỉ nhận và hiển thị danh sách sản phẩm được truyền vào.
// Nó không cần quản lý state hay logic phân trang/xem thêm nữa.
const ProductList = ({ products }) => {
    return (
        <div className="container mx-auto px-4">
            {products.length > 0 ? (
                // Lưới hiển thị sản phẩm
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`} // Bọc ngoài ProductCard
                            className="block w-full"
                        >
                            <ProductCard
                                image={product.image}
                                name={product.name}
                                price={product.price}
                                oldPrice={product.oldPrice}
                                ocop={product.ocop}
                                rating={product.rating}
                                reviewCount={product.reviewCount}
                            />
                        </Link>
                    ))}
                </div>
            ) : (
                // Hiển thị thông báo nếu không có sản phẩm nào (ví dụ: khi tìm kiếm không có kết quả)
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        Không tìm thấy sản phẩm nào phù hợp.
                    </p>
                </div>
            )}
        </div>
    )
}

export default ProductList
