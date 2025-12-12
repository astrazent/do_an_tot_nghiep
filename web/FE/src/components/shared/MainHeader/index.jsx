import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { persistor } from '~/Redux/store'
import { logoutUser } from '~/services/user/userService'
import { useAlert } from '~/contexts/AlertContext'
import {
    FaSearch,
    FaShoppingCart,
    FaUserCircle,
    FaSignInAlt,
    FaSignOutAlt,
    FaShoppingBag,
    FaUser,
    FaSpinner,
} from 'react-icons/fa'
import logo from '~/assets/icon/logo/brand-logo.png'

import { useDebounce } from '~/hooks/shared/useDebounce'
import { useSearchProducts } from '~/hooks/user/useProduct'

import { useCartItemsByUser } from '~/hooks/user/useCartItem'

const userMenuItems = [
    { id: 1, name: 'Tài khoản của tôi', to: '/user/profile', icon: <FaUser /> },
    { id: 2, name: 'Đơn mua', to: '/user/purchase', icon: <FaShoppingBag /> },
    { id: 3, name: 'Đăng xuất', isButton: true, icon: <FaSignOutAlt /> },
]

function MainHeader() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { showAlert } = useAlert()
    const location = useLocation()
    const isCartActive = location.pathname === '/cart'
    const user = useSelector(state => state.user)
    const isLoggedIn = !!user.email

    const { data: userCartData } = useCartItemsByUser(user.user_id)

    const { cartItems: guestCartItems } = useSelector(state => state.cartItem)

    const cartItemCount = isLoggedIn
        ? userCartData?.length || 0
        : guestCartItems?.length || 0

    const [searchValue, setSearchValue] = useState('')
    const [showResults, setShowResults] = useState(false)
    const debouncedSearchValue = useDebounce(searchValue, 500)
    const queryClient = useQueryClient()
    const { data: searchData, isLoading: isSearching } =
        useSearchProducts(debouncedSearchValue)

    const handleSearchChange = e => {
        setSearchValue(e.target.value)
    }
    const handleBlurSearch = () => {
        setTimeout(() => {
            setShowResults(false)
            if (debouncedSearchValue) {
                queryClient.removeQueries([
                    'product',
                    'search',
                    debouncedSearchValue,
                ])
            }
        }, 200)
    }

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

    const handleUserIconClick = () => {
        if (isLoggedIn) {
            navigate('/user/profile')
        } else {
            navigate('/login')
        }
    }

    const handleLogout = async () => {
        try {
            console.log('đã bấm logout!')
            await logoutUser()
            dispatch({ type: 'auth/logout' })
            await persistor.purge()
            handleSuccess('Đăng xuất thành công')
        } catch (err) {
            handleError('Đăng xuất thất bại')
            console.error('Logout failed:', err)
        }
    }

    return (
        <header className="bg-white py-4 px-30 shadow-md">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <div className="flex-shrink-0">
                    <Link to="/">
                        <img src={logo} alt="Tab Farm Logo" className="h-20" />
                    </Link>
                </div>

                {}
                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm..."
                        className="border border-green-500 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
                        value={searchValue}
                        onChange={handleSearchChange}
                        onFocus={() => setShowResults(true)}
                        onBlur={handleBlurSearch}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>

                    {}
                    {showResults && searchValue && (
                        <div className="absolute top-full mt-2 w-full z-20 bg-white rounded-md shadow-lg border border-gray-200/75 max-h-96 overflow-y-auto">
                            {isSearching && (
                                <div className="p-4 flex items-center justify-center text-gray-500">
                                    <FaSpinner className="animate-spin mr-2" />
                                    Đang tìm...
                                </div>
                            )}

                            {!isSearching && searchData?.length === 0 && (
                                <div className="p-4 text-center text-gray-500">
                                    Không tìm thấy sản phẩm.
                                </div>
                            )}
                            {!isSearching && searchData?.length > 0 && (
                                <ul>
                                    {searchData.map(product => (
                                        <li key={product.id}>
                                            <Link
                                                to={`/product/${product.slug}`}
                                                className="flex items-center p-3 hover:bg-green-50 transition-colors duration-200"
                                            >
                                                <img
                                                    src={
                                                        product.images?.[0]
                                                            ?.url ??
                                                        '/placeholder.jpg'
                                                    }
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-md mr-4"
                                                />
                                                <span className="text-sm text-gray-800 font-medium">
                                                    {product.name}
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
                {}

                <div className="text-center flex-shrink-0">
                    <span className="text-gray-500 font-semibold">
                        HOTLINE:
                    </span>
                    <span className="block text-orange-500 font-bold text-lg">
                        0868839655 | 0963538357
                    </span>
                </div>

                <div className="flex items-center space-x-6 flex-shrink-0">
                    <Link
                        to="/cart"
                        className={`relative group ${isCartActive ? 'text-green-600' : ''}`}
                    >
                        <FaShoppingCart
                            className={`text-2xl transition-colors duration-300 ${isCartActive ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'}`}
                        />
                        <span className="absolute -top-3 -right-3 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-transform group-hover:scale-110">
                            {cartItemCount}
                        </span>
                    </Link>

                    <div className="relative group">
                        <button
                            onClick={handleUserIconClick}
                            className="text-gray-600 hover:text-green-600 transition-colors duration-300 text-3xl flex items-center justify-center"
                            aria-label="Tài khoản"
                        >
                            {isLoggedIn ? (
                                user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 group-hover:border-green-500"
                                    />
                                ) : (
                                    <FaUserCircle size={25} />
                                )
                            ) : (
                                <FaSignInAlt size={25} />
                            )}
                        </button>

                        {isLoggedIn && (
                            <div
                                className="
                                    absolute top-full right-0 w-48 z-10
                                    origin-top-right rounded-md bg-white shadow-lg border border-gray-200/75
                                    transition-all duration-300 ease-in-out
                                    opacity-0 scale-95 pointer-events-none
                                    group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                                "
                            >
                                <ul className="divide-y divide-gray-100">
                                    {userMenuItems.map(item => (
                                        <li key={item.id}>
                                            {item.isButton ? (
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left block !px-4 !py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200 flex items-center space-x-2"
                                                >
                                                    {item.icon && (
                                                        <span>{item.icon}</span>
                                                    )}
                                                    <span>{item.name}</span>
                                                </button>
                                            ) : (
                                                <Link
                                                    to={item.to}
                                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 flex items-center space-x-2"
                                                >
                                                    {item.icon && (
                                                        <span>{item.icon}</span>
                                                    )}
                                                    <span>{item.name}</span>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default MainHeader
