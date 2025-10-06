// src/components/Header.jsx
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex-shrink-0">
          <a href="/" className="text-2xl font-bold text-gray-900">
            Bếp Sạch Việt
          </a>
        </div>

        {/* Navigation (Điều hướng) */}
        <nav className="hidden md:block">
          <div className="ml-10 flex items-baseline space-x-4">
            <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Trang chủ</a>
            <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Sản phẩm</a>
            <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Giới thiệu</a>
            <a href="#" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Liên hệ</a>
          </div>
        </nav>

        {/* Icons (Giỏ hàng & Người dùng) */}
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            {/* Icon Tìm kiếm đơn giản (Search) */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="relative text-gray-500 hover:text-gray-700">
            {/* Icon Giỏ hàng (Shopping Cart) */}
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;