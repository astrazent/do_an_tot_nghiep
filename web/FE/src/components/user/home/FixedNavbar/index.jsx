import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeUser } from '~/Redux/reducers/userReducer'
import { logoutUser } from '~/services/user/userService'
import { useAlert } from '~/contexts/AlertContext'
import logo from '~/assets/icon/logo/brand-logo.png'
import { FaShoppingCart, FaUserCircle, FaChevronDown } from 'react-icons/fa'
import { useAllCategories } from '~/hooks/user/useCategory'
import { FaSignOutAlt, FaShoppingBag, FaUser } from 'react-icons/fa'
import { useCartItemsByUser } from '~/hooks/user/useCartItem'

const FixedNavbar = ({ login = true }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isProductMenuOpen, setIsProductMenuOpen] = useState(false)
    const [isUserMenuOpen, setUserMenuOpen] = useState(false)
    const user = useSelector(state => state.user)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { showAlert } = useAlert()

    const isLoggedIn = !!user.email

    const { data: userCartData } = useCartItemsByUser(user.user_id)

    const { cartItems: guestCartItems } = useSelector(state => state.cartItem)

    const cartItemCount = isLoggedIn
        ? userCartData?.length || 0
        : guestCartItems?.length || 0

    const handleSuccess = message => {
        showAlert(message, {
            type: 'success',
        })
    }

    const handleError = message => {
        showAlert(message, {
            type: 'error',
            duration: 3000,
        })
    }

    const handleLogout = async () => {
        try {
            await logoutUser()
            dispatch(removeUser())
            handleSuccess('Đăng xuất thành công')
            navigate('/')
        } catch (err) {
            handleError('Đăng xuất thất bại')
            console.error('Logout failed:', err)
        }
    }

    const { data: categories = [], isLoading: isCategoriesLoading } =
        useAllCategories()
    const location = useLocation()

    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 200)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const productMenuItems = isCategoriesLoading
        ? [{ id: 'loading', name: 'Đang tải...', href: '#' }]
        : categories.map(cat => ({
              id: cat.id,
              name: cat.name,
              href: `/category/${cat.slug}`,
          }))

    const userMenuItems = [
        {
            id: 'profile',
            name: 'Tài khoản của tôi',
            href: '/user/profile',
            icon: <FaUser />,
        },
        {
            id: 'orders',
            name: 'Đơn mua',
            href: '/user/purchase',
            icon: <FaShoppingBag />,
        },
        {
            id: 'logout',
            name: 'Đăng xuất',
            isButton: true,
            icon: <FaSignOutAlt />,
        },
    ]

    const getNavLinkClass = ({ isActive }) =>
        `py-2 transition-colors ${isActive ? 'text-green-600' : 'text-gray-700 hover:text-green-600'}`

    const isProductActive =
        location.pathname.startsWith('/search') ||
        location.pathname.startsWith('/category')
    const isSaleActive = location.pathname === '/sale'

    return (
        <nav
            className={`fixed top-0 left-0 right-0 bg-white shadow-lg z-50 transition-all duration-500 ${
                isVisible
                    ? 'translate-y-0 opacity-100'
                    : '-translate-y-full opacity-0 pointer-events-none'
            }`}
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
                                <NavLink
                                    to="/gioi-thieu"
                                    className={getNavLinkClass}
                                    end
                                >
                                    GIỚI THIỆU
                                </NavLink>
                            </li>

                            <li
                                className="relative"
                                onMouseEnter={() => setIsProductMenuOpen(true)}
                                onMouseLeave={() => setIsProductMenuOpen(false)}
                            >
                                <div
                                    className={`flex items-center gap-1 py-2 cursor-pointer transition-colors ${
                                        isProductActive
                                            ? 'text-green-600'
                                            : 'text-gray-700 hover:text-green-600'
                                    }`}
                                >
                                    SẢN PHẨM
                                    <FaChevronDown
                                        className={`h-3 w-3 transition-transform duration-300 ${
                                            isProductMenuOpen
                                                ? 'rotate-180'
                                                : ''
                                        }`}
                                    />
                                </div>

                                <ul
                                    className={`absolute top-full left-1/2 -translate-x-1/5 w-60
                                        origin-top rounded-lg bg-white shadow-lg border border-gray-200/75
                                        divide-y divide-gray-100
                                        transition-all duration-300 ease-in-out
                                        ${isProductMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
                                    `}
                                >
                                    {productMenuItems.map(item => (
                                        <li key={item.id}>
                                            <NavLink
                                                to={item.href}
                                                className={({ isActive }) =>
                                                    `block px-5 py-3 text-sm transition-colors duration-200 ${
                                                        isActive
                                                            ? 'bg-green-100 text-green-700 font-semibold'
                                                            : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                                    }`
                                                }
                                            >
                                                {item.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li>
                                <NavLink
                                    to="/news"
                                    className={getNavLinkClass}
                                    end
                                >
                                    TIN TỨC
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/tuyen-dung"
                                    className={getNavLinkClass}
                                    end
                                >
                                    TUYỂN DỤNG
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/lien-he"
                                    className={getNavLinkClass}
                                    end
                                >
                                    LIÊN HỆ
                                </NavLink>
                            </li>
                            {login && (
                                <li>
                                    <NavLink
                                        to="/sale"
                                        className={`font-bold py-2 transition-colors ${
                                            isSaleActive
                                                ? 'text-red-600'
                                                : 'text-green-600 hover:text-red-600'
                                        }`}
                                        end
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
                                {cartItemCount}
                            </span>
                        </Link>

                        {login ? (
                            <div
                                className="relative"
                                onMouseEnter={() => setUserMenuOpen(true)}
                                onMouseLeave={() => setUserMenuOpen(false)}
                            >
                                <div className="cursor-pointer p-4 flex items-center justify-center rounded-full">
                                    {user && user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt="User Avatar"
                                            className={`w-10 h-10 rounded-full object-cover border-2 border-gray-200 transition-all duration-300 ${
                                                isUserMenuOpen
                                                    ? 'border-green-500'
                                                    : ''
                                            }`}
                                        />
                                    ) : (
                                        <FaUserCircle
                                            className={`text-2xl transition-colors duration-300 ${
                                                isUserMenuOpen
                                                    ? 'text-green-600'
                                                    : 'text-gray-600'
                                            }`}
                                        />
                                    )}
                                </div>

                                <div
                                    className={`absolute top-full -translate-y-2 -right-3 w-56 z-10
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
                                                        className="w-full text-left !px-4 !py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200 flex items-center gap-2"
                                                    >
                                                        {item.icon && (
                                                            <span>
                                                                {item.icon}
                                                            </span>
                                                        )}
                                                        {item.name}
                                                    </button>
                                                ) : (
                                                    <Link
                                                        to={item.href}
                                                        className="!px-4 !py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 flex items-center gap-2"
                                                    >
                                                        {item.icon && (
                                                            <span>
                                                                {item.icon}
                                                            </span>
                                                        )}
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
                                to="/category/all"
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
