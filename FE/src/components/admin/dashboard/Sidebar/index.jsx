import React, { useState } from 'react'
import {
    FiChevronRight,
    FiHome,
    FiGrid,
    FiEdit,
    FiFileText,
    FiPieChart,
    FiSliders,
    FiShoppingBag,
    FiUsers,
    FiLock,
    FiMessageSquare,
} from 'react-icons/fi'

const Sidebar = () => {
    const [activeItem, setActiveItem] = useState('Dashboard')

    const menuItems = [
        {
            section: 'DASHBOARD & APPS',
            items: [
                { name: 'Dashboard', icon: <FiHome size={20} /> },
                { name: 'Apps', icon: <FiGrid size={20} /> },
            ],
        },
        {
            section: 'COMPONENTS & UI',
            items: [
                { name: 'UI Elements', icon: <FiEdit size={20} /> },
                { name: 'Forms & Tables', icon: <FiFileText size={20} /> },
                { name: 'Charts', icon: <FiPieChart size={20} /> },
            ],
        },
        {
            section: 'COLLECTIONS',
            items: [
                { name: 'Widgets', icon: <FiSliders size={20} /> },
                { name: 'Ecommerce', icon: <FiShoppingBag size={20} /> },
                { name: 'Pages', icon: <FiUsers size={20} /> },
            ],
        },
        {
            section: 'LOGIN & ERROR',
            items: [
                { name: 'Authentication', icon: <FiLock size={20} /> },
                { name: 'Miscellaneous', icon: <FiMessageSquare size={20} /> },
            ],
        },
    ]

    return (
        <div className="flex h-screen w-64 flex-col bg-white ">
            <div className="flex-grow">
                <nav className="flex-1 space-y-1 bg-white p-2">
                    {menuItems.map(menu => (
                        <div key={menu.section}>
                            <h3 className="px-4 pt-4 text-xs font-semibold uppercase text-gray-400">
                                {menu.section}
                            </h3>
                            <div className="mt-2 space-y-1">
                                {menu.items.map(item => (
                                    <a
                                        key={item.name}
                                        href="#"
                                        onClick={() => setActiveItem(item.name)}
                                        className={`group flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                                            activeItem === item.name
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <span
                                            className={`mr-3 ${
                                                activeItem === item.name
                                                    ? 'text-white'
                                                    : 'text-gray-400 group-hover:text-gray-500'
                                            }`}
                                        >
                                            {item.icon}
                                        </span>
                                        <span>{item.name}</span>
                                        <FiChevronRight className="ml-auto h-5 w-5 text-gray-400 transition-colors duration-150 ease-in-out group-hover:text-gray-500" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    )
}

export default Sidebar
