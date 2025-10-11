// src/components/Header.jsx

import React from 'react'
import {
    HiMenu,
    HiOutlineChat,
    HiOutlineClipboardList,
    HiOutlineAdjustments,
    HiOutlineSearch,
    HiOutlineBell,
    HiOutlineUser,
    HiOutlineArrowsExpand,
} from 'react-icons/hi'
import { FaPaintRoller } from 'react-icons/fa'
const Logo = () => (
    <div className="flex items-center gap-2">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 relative">
            <div className="w-4 h-4 rounded-full border-2 border-purple-500 absolute animate-spin"></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 absolute"></div>
        </div>
        <span className="text-2xl font-bold text-gray-800 tracking-wider">
            NP
        </span>
    </div>
)

const Header = () => {
    return (
        <header className="bg-white shadow-sm w-full py-3 px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button className="p-2 rounded-md hover:bg-gray-100">
                        <HiMenu size={24} className="text-gray-600" />
                    </button>
                    <Logo />
                    <div className="hidden md:flex items-center gap-2 ml-4">
                        <button className="p-3 rounded-md bg-gray-100 hover:bg-gray-200">
                            <HiOutlineChat
                                size={20}
                                className="text-gray-700"
                            />
                        </button>
                        <button className="p-3 rounded-md bg-gray-100 hover:bg-gray-200">
                            <FaPaintRoller
                                size={20}
                                className="text-gray-700"
                            />
                        </button>
                        <button className="p-3 rounded-md bg-gray-100 hover:bg-gray-200">
                            <HiOutlineClipboardList
                                size={20}
                                className="text-gray-700"
                            />
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center bg-gray-50 rounded-lg border border-gray-200 px-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <HiOutlineArrowsExpand size={20} />
                        </button>
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent focus:outline-none w-48 py-2 px-2 text-sm"
                        />
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                            <HiOutlineSearch size={20} />
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-3 rounded-md hover:bg-gray-100 relative">
                            <HiOutlineBell
                                size={22}
                                className="text-gray-600"
                            />
                            <span className="absolute top-3 right-3 block h-2 w-2 rounded-full bg-blue-500"></span>
                        </button>
                        <button className="p-3 rounded-md hover:bg-gray-100">
                            <HiOutlineUser
                                size={22}
                                className="text-gray-600"
                            />
                        </button>
                        <button className="p-3 rounded-md hover:bg-gray-100">
                            <HiOutlineAdjustments
                                size={22}
                                className="text-gray-600"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
