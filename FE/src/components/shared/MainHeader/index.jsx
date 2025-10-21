import { Link, useNavigate } from 'react-router-dom'
import {
    FaSearch,
    FaShoppingCart,
    FaUserCircle,
    FaSignInAlt,
} from 'react-icons/fa'
import logo from '~/assets/icon/logo/brand-logo.png'

const userMenuItems = [
    { id: 1, name: 'Tài khoản của tôi', to: '/user/profile' },
    { id: 2, name: 'Đơn hàng của tôi', to: '/user/purchase' },
    { id: 3, name: 'Đăng xuất', isButton: true },
]

function MainHeader({ login, handleLogout, cartItemCount = 0 }) {
    const navigate = useNavigate()

    const handleUserIconClick = () => {
        if (login) {
            navigate('/user/profile')
        } else {
            navigate('/login')
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

                <div className="relative w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm sản phẩm ..."
                        className="border border-green-500 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-1 focus:ring-green-400"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                </div>

                <div className="text-center flex-shrink-0">
                    <span className="text-gray-500 font-semibold">
                        HOTLINE:
                    </span>
                    <span className="block text-orange-500 font-bold text-lg">
                        0868839655 | 0963538357
                    </span>
                </div>

                <div className="flex items-center space-x-6 flex-shrink-0">
                    <Link to="/cart" className="relative group">
                        <FaShoppingCart className="text-2xl text-gray-600 group-hover:text-green-600 transition-colors duration-300" />
                        <span className="absolute -top-3 -right-3 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-transform group-hover:scale-110">
                            {cartItemCount}
                        </span>
                    </Link>

                    <div className="relative group">
                        <button
                            onClick={handleUserIconClick}
                            className="text-gray-600 hover:text-green-600 transition-colors duration-300 text-3xl"
                            aria-label="Tài khoản"
                        >
                            {login ? (
                                <FaUserCircle size={25} />
                            ) : (
                                <FaSignInAlt size={25} />
                            )}
                        </button>

                        {login && (
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
                                                    className="w-full text-left block px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
                                                >
                                                    {item.name}
                                                </button>
                                            ) : (
                                                <Link
                                                    to={item.to}
                                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                                                >
                                                    {item.name}
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
