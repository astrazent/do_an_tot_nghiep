import { NavLink } from 'react-router-dom'
import { FaChevronDown } from 'react-icons/fa'

//Giả sử productMenuItems của bạn trông như thế này
const productMenuItems = [
    { id: 1, name: 'Sản phẩm từ Vịt', href: '#' },
    { id: 2, name: 'Sản phẩm từ Gà', href: '#' },
    { id: 3, name: 'Các loại hạt', href: '#' },
    { id: 4, name: 'Sản phẩm từ heo', href: '#' },
    { id: 5, name: 'Sản phẩm từ cá', href: '#' },
    { id: 6, name: 'Sản phẩm từ ngan', href: '#' },
    { id: 7, name: 'Hải sản', href: '#' },
    { id: 8, name: 'Các loại ruốc', href: '#' },
    { id: 9, name: 'Thực phẩm khác', href: '#' },
]

function NavigationBar() {
    const getNavLinkClass = ({ isActive }) =>
        isActive
            ? 'block px-5 py-3 bg-orange-500'
            : 'block px-5 py-3 hover:bg-green-600'

    const getProductNavLinkClass = ({ isActive }) =>
        isActive
            ? 'flex items-center px-5 py-3 bg-orange-500'
            : 'flex items-center px-5 py-3 hover:bg-green-600'

    return (
        <nav className="bg-green-700 text-white px-40">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <ul className="flex items-center font-semibold">
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
                    <li className="relative group">
                        <NavLink
                            to="/category/all"
                            className={getProductNavLinkClass}
                        >
                            SẢN PHẨM
                            <FaChevronDown className="ml-1 text-xs" />
                        </NavLink>

                        <div
                            className="
                                absolute top-full left-0 w-60 z-10 
                                origin-top rounded-md bg-white shadow-lg border border-gray-200/75
                                transition-all duration-300 ease-in-out
                                opacity-0 scale-95 pointer-events-none 
                                group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto
                            "
                        >
                            <ul className="divide-y divide-gray-100">
                                {productMenuItems.map(item => (
                                    <li key={item.id}>
                                        <NavLink
                                            to={item.to}
                                            className="block px-5 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200"
                                        >
                                            {item.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
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
                    to="/category/sale"
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
