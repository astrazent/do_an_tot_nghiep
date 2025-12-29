import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
    HiOutlineViewGrid,
    HiOutlineUserGroup,
    HiOutlineCube,
    HiOutlineShoppingBag,
    HiOutlineClipboardList,
    HiOutlineChatAlt2,
    HiChevronDown,
    HiOutlineCurrencyDollar,
    HiOutlineChartBar,
    HiOutlineCash,
    HiOutlineUsers,
    HiOutlineNewspaper,
    HiOutlineDocumentAdd,
    HiTag,
    HiX,
    HiOutlineTag,
    HiOutlineChip,
    HiOutlineTemplate,
    HiOutlineDocumentText,
    HiOutlineMail,
} from 'react-icons/hi'
import { MdLocalOffer, MdAdsClick, MdArticle } from 'react-icons/md'
import { BiCategoryAlt } from 'react-icons/bi'

const mainNavLinks = [
    {
        name: 'Bảng điều khiển',
        icon: <HiOutlineViewGrid />,
        path: '/admin',
        end: true,
    },
    {
        name: 'Doanh thu',
        icon: <HiOutlineCurrencyDollar />,
        hasSubmenu: true,
        submenu: [
            {
                name: 'Phân tích',
                path: '/admin/revenue/analysis',
                icon: <HiOutlineChartBar />,
            },
            {
                name: 'Nguồn tiền',
                path: '/admin/revenue/sources',
                icon: <HiOutlineCash />,
            },
        ],
    },
    {
        name: 'Khách hàng',
        icon: <HiOutlineUserGroup />,
        hasSubmenu: true,
        submenu: [
            {
                name: 'Phân tích',
                path: '/admin/customers/analysis',
                icon: <HiOutlineChartBar />,
            },
            {
                name: 'Quản lý người dùng',
                path: '/admin/customers/management',
                icon: <HiOutlineUsers />,
            },
        ],
    },
    {
        name: 'Kho',
        icon: <HiOutlineCube />,
        hasSubmenu: true,
        submenu: [
            {
                name: 'Phân tích kho',
                path: '/admin/inventory/analysis',
                icon: <HiOutlineChartBar />,
            },
            {
                name: 'Quản lý kho',
                path: '/admin/inventory/management',
                icon: <HiOutlineClipboardList />,
            },
        ],
    },
    {
        name: 'Danh mục sản phẩm',
        icon: <HiOutlineTag />,
        path: '/admin/category',
    },
    { name: 'Đơn hàng', icon: <HiOutlineShoppingBag />, path: '/admin/orders' },
    { name: 'Khuyến mãi', icon: <MdLocalOffer />, path: '/admin/discount' },
    { name: 'Banner', icon: <MdAdsClick />, path: '/admin/banner' },
    {
        name: 'Blog',
        icon: <MdArticle />,
        hasSubmenu: true,
        submenu: [
            {
                name: 'Danh sách bài viết',
                path: '/admin/blog/management',
                icon: <HiOutlineNewspaper />,
            },
            {
                name: 'Soạn bài viết',
                path: '/admin/blog/create-new',
                icon: <HiOutlineDocumentAdd />,
            },
            {
                name: 'Kiểu bài viết',
                path: '/admin/blog/type',
                icon: <BiCategoryAlt />,
            },
        ],
    },
    {
        name: 'AI Marketing',
        icon: <HiOutlineChip />,
        hasSubmenu: true,
        submenu: [
            {
                name: 'Bài viết AI',
                path: '/admin/ai_marketing/content',
                icon: <HiOutlineDocumentText />,
            },
            {
                name: 'Email AI',
                path: '/admin/ai_marketing/email',
                icon: <HiOutlineMail />,
            },
        ],
    },
]

const NavItem = ({ item, onClick }) => {
    const { name, icon, path, hasSubmenu, submenu, end } = item
    const location = useLocation()

    const isChildActive =
        hasSubmenu &&
        submenu?.some(sub => location.pathname.startsWith(sub.path))
    const [open, setOpen] = useState(isChildActive)

    useEffect(() => {
        if (isChildActive) {
            setOpen(true)
        }
    }, [location.pathname, isChildActive])

    const toggleSubmenu = () => setOpen(!open)

    // Màu active: green-700 + text-white
    const activeClasses = 'bg-green-700 text-white'
    const inactiveClasses =
        'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
    const activeParentClasses = 'bg-gray-100 dark:bg-gray-700'

    if (hasSubmenu) {
        return (
            <div>
                <button
                    onClick={toggleSubmenu}
                    className={`flex items-center justify-between w-full gap-3 px-4 py-3 rounded-lg transition-colors ${isChildActive ? activeParentClasses : inactiveClasses}`}
                >
                    <div className="flex items-center gap-4">
                        {React.cloneElement(icon, { size: 22 })}
                        <span className="flex-grow font-semibold text-base text-left">
                            {name}
                        </span>
                    </div>
                    <HiChevronDown
                        size={20}
                        className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
                    />
                </button>

                <div
                    className={`ml-8 mt-1 grid overflow-hidden transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                    <div className="overflow-hidden space-y-1">
                        {submenu?.map(sub => (
                            <NavLink
                                key={sub.name}
                                to={sub.path}
                                onClick={onClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive ? activeClasses : inactiveClasses}`
                                }
                            >
                                {sub.icon &&
                                    React.cloneElement(sub.icon, { size: 18 })}
                                <span>{sub.name}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <NavLink
            end={end}
            to={path}
            onClick={onClick}
            className={({ isActive }) =>
                `flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? activeClasses : inactiveClasses}`
            }
        >
            <div className="flex items-center gap-4">
                {React.cloneElement(icon, { size: 22 })}
                <span className="flex-grow font-semibold text-base">
                    {name}
                </span>
            </div>
        </NavLink>
    )
}

const Sidebar = ({ isOpen, setIsOpen }) => {
    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false)
        }
    }

    return (
        <>
            <div
                onClick={() => setIsOpen(false)}
                className={`fixed inset-0 bg-black/60 z-30 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            <aside
                className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-40 transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                lg:translate-x-0 lg:fixed`}
            >
                <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center relative shrink-0">
                    <h1 className="text-xl font-bold text-green-800 dark:text-indigo-400 uppercase tracking-wide">
                        Trang quản trị
                    </h1>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute right-4 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                    >
                        <HiX
                            size={24}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </button>
                </div>

                <nav className="flex-grow px-4 py-4 space-y-2 overflow-y-auto">
                    {mainNavLinks.map(item => (
                        <NavItem
                            key={item.name}
                            item={item}
                            onClick={handleLinkClick}
                        />
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default Sidebar