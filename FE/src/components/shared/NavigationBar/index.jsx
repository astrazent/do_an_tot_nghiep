import { useState, useRef, useEffect } from 'react' // 1. Import thêm useRef và useEffect
import { NavLink, useLocation } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'
import { useAllCategories } from '~/hooks/user/useCategory'

function NavigationBar() {
    const { data: categories = [], isLoading } = useAllCategories()
    const location = useLocation()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    // 2. Tạo refs để lưu ID của setTimeout
    const openTimerRef = useRef(null)
    const closeTimerRef = useRef(null)

    const isProductPageActive =
        location.pathname.startsWith('/category/') ||
        location.pathname.startsWith('/search')

    const getNavLinkClass = ({ isActive }) =>
        isActive
            ? 'block px-5 py-3 bg-orange-500'
            : 'block px-5 py-3 hover:bg-green-600'

    const handleDropdownItemClick = () => {
        setIsDropdownOpen(false)
    }

    // 3. Hàm xử lý khi di chuột vào (có delay)
    const handleMouseEnter = () => {
        clearTimeout(closeTimerRef.current) // Hủy hẹn giờ đóng nếu có
        openTimerRef.current = setTimeout(() => {
            setIsDropdownOpen(true)
        }, 200) // Mở sau 200ms
    }

    // 4. Hàm xử lý khi di chuột ra (có delay)
    const handleMouseLeave = () => {
        clearTimeout(openTimerRef.current) // Hủy hẹn giờ mở nếu có
        closeTimerRef.current = setTimeout(() => {
            setIsDropdownOpen(false)
        }, 200) // Đóng sau 200ms
    }

    // 5. Dọn dẹp timers khi component unmount
    useEffect(() => {
        return () => {
            clearTimeout(openTimerRef.current)
            clearTimeout(closeTimerRef.current)
        }
    }, [])

    return (
        <nav className="bg-green-700 text-white px-40">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <ul className="flex items-center font-semibold">
                    {/* ... các NavLink khác ... */}
                    <li>
                        <NavLink to="/" className={getNavLinkClass} end>
                            TRANG CHỦ
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/gioi-thieu" className={getNavLinkClass}>
                            GIỚI THIỆU
                        </NavLink>
                    </li>
                    {/* === BẮT ĐẦU THAY ĐỔI CHO DROPDOWN === */}
                    <li
                        className="relative"
                        // 6. Sử dụng các hàm xử lý mới
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <NavLink
                            to="/category/all"
                            className={
                                isProductPageActive
                                    ? 'flex items-center px-5 py-3 bg-orange-500'
                                    : 'flex items-center px-5 py-3 hover:bg-green-600'
                            }
                        >
                            SẢN PHẨM
                            <FaChevronDown className="ml-1 text-xs" />
                        </NavLink>

                        <div
                            className={`
                                absolute top-full left-0 w-60 z-10
                                origin-top rounded-md bg-white shadow-lg border border-gray-200/75
                                transition-all duration-300 ease-in-out
                                ${
                                    isDropdownOpen
                                        ? 'opacity-100 scale-100 pointer-events-auto'
                                        : 'opacity-0 scale-95 pointer-events-none'
                                }
                            `}
                        >
                            <ul className="divide-y divide-gray-100">
                                {isLoading && (
                                    <li className="px-5 py-3 text-sm text-gray-500">
                                        Đang tải...
                                    </li>
                                )}
                                {!isLoading &&
                                    categories.map(cat => (
                                        <li key={cat.id}>
                                            <NavLink
                                                to={`/category/${cat.slug}`}
                                                className={({ isActive }) =>
                                                    `block px-5 py-3 text-sm transition-colors duration-200 ${
                                                        isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                                                    }`
                                                }
                                                onClick={handleDropdownItemClick}
                                            >
                                                {cat.name}
                                            </NavLink>
                                        </li>
                                    ))}
                                {!isLoading && categories.length === 0 && (
                                    <li className="px-5 py-3 text-sm text-gray-500">
                                        Không có danh mục
                                    </li>
                                )}
                            </ul>
                        </div>
                    </li>
                    {/* === KẾT THÚC THAY ĐỔI CHO DROPDOWN === */}
                    <li>
                        <NavLink to="/news" className={getNavLinkClass}>
                            TIN TỨC
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/recruitment" className={getNavLinkClass}>
                            TUYỂN DỤNG
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact" className={getNavLinkClass}>
                            LIÊN HỆ
                        </NavLink>
                    </li>
                </ul>
                <NavLink
                    to="/sale"
                    className={({ isActive }) =>
                        isActive
                            ? 'font-semibold relative mr-10 text-orange-400 transition-colors duration-300'
                            : 'font-semibold relative mr-10 text-white hover:text-orange-400 transition-colors duration-300'
                    }
                >
                    KHUYẾN MÃI
                    <span className="absolute -top-2 -right-9 bg-[#f2f801] text-green-800 text-[12px] font-bold px-0.5 py-0 rounded scale-90 blink">
                        NEW
                    </span>
                </NavLink>
            </div>
        </nav>
    )
}

export default NavigationBar