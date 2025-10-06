// src/App.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import './index.css'; 

// ⚠️ Đảm bảo URL này khớp với API của bạn
const PRODUCTS_API_URL = "http://localhost:8023/v1/products"; 

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(PRODUCTS_API_URL);
        
        // 🚨 ĐIỀU CHỈNH QUAN TRỌNG NHẤT: Trích xuất mảng 'products' từ response.data
        const fetchedProducts = response.data.products;
        
        setProducts(fetchedProducts || []); // Sử dụng mảng products
        setError(null);

      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
        setError("Không thể tải dữ liệu sản phẩm. Vui lòng thử lại.");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ... (Phần logic isLoading, error và render không thay đổi) ...
  
  // --- HIỂN THỊ GIAO DIỆN CHÍNH ---
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
            Sản Phẩm Mới Nhất
        </h2>
        
        {products.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Không tìm thấy sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              // Truyền đối tượng sản phẩm đã được trích xuất
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;