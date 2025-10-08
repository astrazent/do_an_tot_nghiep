import React from 'react'
import { FaBell, FaUser, FaShoppingBag } from 'react-icons/fa'
import { NavLink } from 'react-router-dom'

const UserSidebar = () => {
    const menuItems = [
        {
            id: 1,
            icon: FaBell,
            label: 'Thông báo',
            path: '/user/notifications',
            color: 'text-red-500',
        },
        {
            id: 2,
            icon: FaUser,
            label: 'Tài khoản của tôi',
            path: '/user/profile',
            color: 'text-blue-500',
        },
        {
            id: 3,
            icon: FaShoppingBag,
            label: 'Đơn mua',
            path: '/user/purchase',
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
                            // 3. Sử dụng NavLink thay cho button
                            <NavLink
                                key={item.id}
                                to={item.path}
                                // 4. Thêm style cho trạng thái 'active'
                                className={({ isActive }) =>
                                    `w-full flex items-center gap-3 p-3 text-left rounded-md transition-colors duration-200 border ${
                                        isActive
                                            ? 'bg-gray-100 border-gray-200 text-blue-600'
                                            : 'border-transparent hover:bg-gray-100 hover:border-gray-200'
                                    }`
                                }
                            >
                                <IconComponent
                                    className={`text-lg ${item.color}`}
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    {item.label}
                                </span>
                            </NavLink>
                        )
                    })}
                </div>
            </div>
        </aside>
    )
}

export default UserSidebar
