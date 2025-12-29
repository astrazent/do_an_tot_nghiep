import React from 'react'
import {
    HiMenu,
    HiOutlineSearch,
    HiOutlineBell,
    HiOutlineArrowsExpand,
    HiOutlineSun,
    HiOutlineMoon,
    HiChevronDown,
} from 'react-icons/hi'
import { useTheme } from '~/contexts/ThemeContext'
import logo from '~/assets/icon/logo/brand-logo.png'

const Header = ({ onMenuClick }) => {
    const { theme, toggleTheme } = useTheme()

    return (
        <header className="bg-white dark:bg-gray-800 h-16 w-full px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between h-full">
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

                <div className="hidden md:block relative">
                    <div className="flex items-center gap-2">
                        <img
                            src={logo}
                            alt="Avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-3xl font-bold text-green-800 dark:text-gray-200">
                            Bếp Sạch Việt
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {theme === 'light' ? (
                            <HiOutlineSun
                                size={22}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        ) : (
                            <HiOutlineMoon
                                size={22}
                                className="text-gray-600 dark:text-gray-300"
                            />
                        )}
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                        <HiOutlineArrowsExpand
                            size={22}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </button>
                    <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                        <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            3
                        </div>
                        <HiOutlineBell
                            size={22}
                            className="text-gray-600 dark:text-gray-300"
                        />
                    </button>
                    <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                            AN
                        </div>
                        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Anh Nam
                        </span>
                        <HiChevronDown className="text-gray-500 dark:text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
