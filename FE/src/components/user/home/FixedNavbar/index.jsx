import React, { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import logo from '~/assets/icon/logo/brand-logo.png'
import { FaShoppingCart, FaUserCircle, FaChevronDown } from 'react-icons/fa'
import { slugify } from '~/utils/slugify'

const FixedNavbar = ({ login = true }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
    const [isUserMenuOpen, setUserMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 200)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const handleLogout = () => {
        console.log('User logged out')
    }

    const productMenuItems = [
        { id: 1, name: 'Sản phẩm từ Vịt' },
        { id: 2, name: 'Sản phẩm từ Gà' },
        { id: 3, name: 'Các loại hạt' },
        { id: 4, name: 'Sản phẩm từ heo' },
        { id: 5, name: 'Sản phẩm từ cá' },
        { id: 6, name: 'Sản phẩm từ ngan' },
        { id: 7, name: 'Hải sản' },
        { id: 8, name: 'Các loại ruốc' },
        { id: 9, name: 'Thực phẩm khác' },
    ].map(item => ({
        ...item,
        href: `/search?category=${slugify(item.name)}`,
    }))

    const userMenuItems = [
        { id: 'profile', name: 'Tài khoản của tôi', href: '/user/profile' },
        { id: 'orders', name: 'Lịch sử đơn hàng', href: '/user/orders' },
        { id: 'logout', name: 'Đăng xuất', isButton: true },
    ]

    const getNavLinkClass = ({ isActive }) =>
        `py-2 transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`

    return (
        <nav
            className={`fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
        >
            <div className="container mx-auto px-20 py-3">
                <div className="flex justify-between items-center">
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img src={logo} alt="tab farm" className="h-12" />
                        </Link>
                    </div>

                    <div className="flex-grow">
                        <ul className="flex items-center justify-center font-semibold space-x-8">
                            <li>
                                <NavLink to="/" className={getNavLinkClass} end>
                                    TRANG CHỦ
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/" className={getNavLinkClass}>
                                    GIỚI THIỆU
                                </NavLink>
                            </li>

                            <div
                                className="relative"
                                onMouseEnter={() => setIsProductMenuOpen(true)}
                                onMouseLeave={() => setIsProductMenuOpen(false)}
                            >
                                <div className="flex items-center gap-1 text-gray-700 hover:text-green-600 py-2 transition-colors cursor-pointer">
                                    SẢN PHẨM
                                    <FaChevronDown
                                        className={`h-3 w-3 transition-transform duration-300 ${isProductMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </div>
                                <ul
                                    className={`
                                        absolute top-full left-1/2 -translate-x-1/5 w-60 
                                        origin-top rounded-lg bg-white shadow-lg border border-gray-200/75 
                                        divide-y divide-gray-100
                                        transition-all duration-300 ease-in-out
                                        ${isProductMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                                    `}
                                >
                                    {productMenuItems.map(item => (
                                        <li key={item.id}>
                                            <Link
                                                to={item.href}
                                                className="block px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                                            >
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <li>
                                <NavLink to="/news" className={getNavLinkClass}>
                                    TIN TỨC
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/" className={getNavLinkClass}>
                                    TUYỂN DỤNG
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/" className={getNavLinkClass}>
                                    LIÊN HỆ
                                </NavLink>
                            </li>

                            {login && (
                                <li>
                                    <NavLink
                                        to="/category/sale"
                                        className={({ isActive }) =>
                                            `font-bold py-2 transition-colors ${isActive ? 'text-red-600' : 'text-green-600 hover:text-red-600'}`
                                        }
                                    >
                                        KHUYẾN MÃI
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div className="flex items-center space-x-12">
                        <Link to="/cart" className="relative">
                            <FaShoppingCart className="text-xl text-gray-600 hover:text-green-600 transition-colors" />
                            <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                0
                            </span>
                        </Link>

                        {login ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setUserMenuOpen(true)}
                                onMouseLeave={() => setUserMenuOpen(false)}
                            >
                                <div className="cursor-pointer py-2">
                                    <FaUserCircle
                                        className={`text-2xl transition-colors duration-300 ${isUserMenuOpen ? 'text-green-600' : 'text-gray-600'}`}
                                    />
                                </div>
                                <div
                                    className={`
                                        absolute top-full -right-3 w-56 z-10
                                        origin-top-right rounded-md bg-white shadow-lg border border-gray-200/75
                                        transition-all duration-300 ease-in-out
                                        ${isUserMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                                    `}
                                >
                                    <ul className="divide-y divide-gray-100">
                                        {userMenuItems.map(item => (
                                            <li key={item.id}>
                                                {item.isButton ? (
                                                    <button
                                                        onClick={handleLogout}
                                                        className="w-full text-left block px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
                                                    >
                                                        {item.name}
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={item.href}
                                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/search"
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold"
                            >
                                ĐẶT HÀNG NGAY
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default FixedNavbar
