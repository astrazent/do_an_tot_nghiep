import React from 'react'
import { FaBell, FaUser, FaShoppingBag } from 'react-icons/fa'

const UserSidebar = () => {
    const menuItems = [
        {
            id: 1,
            icon: FaBell,
            label: 'Thông báo',
            onClick: () => console.log('Thông báo clicked'),
            color: 'text-red-500',
        },
        {
            id: 2,
            icon: FaUser,
            label: 'Tài khoản của tôi',
            onClick: () => console.log('Tài khoản clicked'),
            color: 'text-blue-500',
        },
        {
            id: 3,
            icon: FaShoppingBag,
            label: 'Đơn mua',
            onClick: () => console.log('Đơn mua clicked'),
            color: 'text-green-500',
        },
    ]

    return (
        <aside className="w-full max-w-xs rounded-lg p-4 font-sans">
            <div>
                <h3 className="text-sm font-bold text-gray-500 uppercase pb-2 border-b">
                    Tài khoản
                </h3>
                <div className="mt-4 space-y-2">
                    {menuItems.map(item => {
                        const IconComponent = item.icon
                        return (
                            <button
                                key={item.id}
                                onClick={item.onClick}
                                className="w-full flex items-center gap-3 p-3 text-left rounded-md hover:bg-gray-100 transition-colors duration-200 border border-transparent hover:border-gray-200"
                            >
                                <IconComponent
                                    className={`text-lg ${item.color}`}
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {item.label}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </aside>
    )
}

export default UserSidebar
