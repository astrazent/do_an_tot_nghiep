import React from 'react'
import { HiMenu, HiOutlineBell, HiChevronDown, HiLogout } from 'react-icons/hi'
import { useTheme } from '~/contexts/ThemeContext'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import logo from '~/assets/icon/logo/brand-logo.png'

const Header = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme()
    const navigate = useNavigate()

    // Lấy user từ Redux (giả sử lưu trong state.auth.user)
    const user = useSelector(state => state.account)

    // Hàm xử lý đăng xuất
    const handleLogout = () => {
        Cookies.remove('access_token') // Xóa token khỏi cookie
        navigate('/admin/login', { replace: true })
    }

    // Tạo chữ cái đầu từ full_name (ví dụ: Nguyễn Anh Nam → NN)
    const getInitials = fullName => {
        if (!fullName) return '??'
        return fullName
            .split(' ')
            .slice(-2) // Lấy 2 từ cuối (thường là tên)
            .map(word => word[0].toUpperCase())
            .join('')
    }

    return (
        <header className="bg-white dark:bg-gray-800 h-16 w-full px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-full">
                {/* Nút menu mobile */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                    >
                        <HiMenu
                            size={24}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </button>
                </div>

                {/* Logo + Tên thương hiệu (ẩn trên mobile) */}
                <div className="hidden md:block">
                    <div className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-3xl font-bold text-green-800 dark:text-gray-200">
                            Bếp Sạch Việt
                        </span>
                    </div>
                </div>

                {/* Phần bên phải: Thông báo + User + Đăng xuất */}
                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                        <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </div>
                        <HiOutlineBell
                            size={22}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </button>

                    {/* Thông tin user + nút Đăng xuất */}
                    <div className="flex items-center gap-3">
                        {/* Avatar + Tên */}
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-200 font-bold text-sm">
                                {getInitials(user?.fullName)}
                            </div>
                            <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {user?.fullName || 'Admin'}
                            </span>
                        </div>

                        {/* Nút Đăng xuất */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition"
                            title="Đăng xuất"
                        >
                            <HiLogout size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
