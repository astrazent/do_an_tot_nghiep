// src/components/ProductCard.jsx

import React from 'react';

const ProductCard = ({ product }) => {
  
  // 🚨 ĐIỀU CHỈNH QUAN TRỌNG: Destructure các thuộc tính mới
  const { 
    id, 
    name, 
    // Dùng 'price' làm giá bán và 'origin_price' làm giá gốc
    price, 
    origin_price, 
    // Dùng 'rate_point_total' và 'rate_count' để tính điểm trung bình
    rate_point_total, 
    rate_count 
  } = product;

  // Tính toán Rating (Điểm trung bình) và Review Count
  const averageRating = rate_count > 0 ? (parseFloat(rate_point_total) / rate_count) : 0;
  // Làm tròn điểm đánh giá để hiển thị sao, tối đa là 5
  const stars = Math.min(5, Math.round(averageRating * 2) / 2); // Ví dụ: làm tròn đến 0.5 gần nhất
  const reviewCount = rate_count;

  // Giả định bạn có một URL ảnh, nếu API không có, bạn phải thêm thuộc tính này hoặc dùng ảnh placeholder
  const imageUrl = product.imageUrl || `https://via.placeholder.com/400x300?text=${name.replace(/\s/g, '+')}`; 

  // Hàm định dạng tiền tệ (Sử dụng parseFloat cho các chuỗi giá)
  const formatCurrency = (amountString) => {
    const amount = parseFloat(amountString);
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-white group rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-100">
      
      {/* ẢNH SẢN PHẨM */}
      <div className="relative aspect-w-4 aspect-h-3">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-cover object-center transition duration-500 group-hover:scale-105"
        />
        {/* ... (Phần Xem Nhanh không đổi) ... */}
      </div>

      {/* THÔNG TIN SẢN PHẨM */}
      <div className="p-4">
        {/* Tên sản phẩm */}
        <h3 className="text-sm font-semibold text-gray-800 truncate">
          <a href={`/products/${id}`} className="hover:text-indigo-600 transition duration-150">
            {name}
          </a>
        </h3>

        {/* Đánh giá */}
        <div className="flex items-center mt-1">
          {/* Hiển thị sao dựa trên stars đã tính toán */}
          <span className="text-yellow-400 text-sm">
            {'★'.repeat(Math.floor(stars))}
            {stars % 1 !== 0 && '½'} {/* Thêm nửa sao nếu cần */}
            {'☆'.repeat(Math.floor(5 - stars))}
          </span>
          <p className="ml-2 text-xs text-gray-500">({reviewCount} đánh giá)</p>
        </div>

        {/* Giá */}
        <div className="mt-2 flex items-baseline">
            {/* Giá hiện tại */}
            <p className="text-lg font-bold text-indigo-600 mr-2">
                {formatCurrency(price)}
            </p>
            {/* Giá gốc (nếu có giảm giá) */}
            {parseFloat(origin_price) > parseFloat(price) && (
                <p className="text-xs text-gray-500 line-through">
                    {formatCurrency(origin_price)}
                </p>
            )}
        </div>
        
        {/* NÚT THÊM VÀO GIỎ */}
        <button
          className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150"
          onClick={() => console.log('Thêm vào giỏ: ' + name)}
        >
          Thêm vào Giỏ
        </button>
      </div>
    </div>
  );
};

export default ProductCard;