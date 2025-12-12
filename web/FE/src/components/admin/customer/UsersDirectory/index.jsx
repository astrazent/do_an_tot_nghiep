import React, { useState, useRef, useEffect } from 'react'

const usersData = [
    {
        id: 6,
        username: 'ngoc_anh',
        full_name: 'Ngọc Anh',
        email: 'ngocanh@example.com',
        phone: '090-111-2222',
        address: '789 Đường Sồi',
        city: 'TP. Hồ Chí Minh',
        avatar_link: 'https://i.pravatar.cc/150?u=ngocanh',
        role: 'admin',
        status: 'active',
        lastActive: '30 phút trước',
        created_at: '2023-01-15T10:30:00Z',
        updated_at: '2023-10-28T11:00:00Z',
    },
    {
        id: 5,
        username: 'minh_khoa',
        full_name: 'Minh Khoa',
        email: 'minhkhoa@example.com',
        phone: '091-222-3333',
        address: '456 Đường Thông',
        city: 'Hà Nội',
        avatar_link: 'https://i.pravatar.cc/150?u=minhkhoa',
        role: 'user',
        status: 'inactive',
        lastActive: '1 tuần trước',
        created_at: '2022-11-20T14:00:00Z',
        updated_at: '2023-09-10T08:20:00Z',
    },
]

const SearchIcon = () => (
    <svg
        className="w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
)
const SortIcon = () => (
    <svg
        className="w-4 h-4 ml-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
        />
    </svg>
)
const EllipsisIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
)
const EditIcon = () => (
    <svg
        className="w-4 h-4 mr-3 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z"
        />
    </svg>
)
const ViewProfileIcon = () => (
    <svg
        className="w-4 h-4 mr-3 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
    </svg>
)
const DeleteIcon = () => (
    <svg
        className="w-4 h-4 mr-3 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
    </svg>
)
const RoleBadge = ({ role }) => {
    const roles = {
        admin: 'bg-red-100 text-red-800',
        user: 'bg-indigo-100 text-indigo-800',
        moderator: 'bg-orange-100 text-orange-800',
    }
    const roleText = {
        admin: 'Quản trị viên',
        user: 'Người dùng',
        moderator: 'Điều hành viên',
    }
    return (
        <span
            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${roles[role] || 'bg-gray-100 text-gray-800'}`}
        >
            {roleText[role] || 'Không xác định'}
        </span>
    )
}
const StatusBadge = ({ status }) => {
    const statuses = {
        active: 'bg-green-100 text-green-800',
        inactive: 'bg-gray-200 text-gray-800',
        pending: 'bg-yellow-100 text-yellow-800',
    }
    const statusText = {
        active: 'Hoạt động',
        inactive: 'Ngừng hoạt động',
        pending: 'Đang chờ',
    }
    return (
        <span
            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statuses[status] || 'bg-gray-100 text-gray-800'}`}
        >
            {statusText[status] || 'Không xác định'}
        </span>
    )
}
const ActionMenu = ({ onEdit, onView, onDelete }) => (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
        <ul className="py-1">
            <li>
                <a
                    href="#"
                    onClick={onEdit}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    <EditIcon /> Chỉnh sửa
                </a>
            </li>
            <li>
                <a
                    href="#"
                    onClick={onView}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    <ViewProfileIcon /> Xem hồ sơ
                </a>
            </li>
            <li>
                <a
                    href="#"
                    onClick={onDelete}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                    <DeleteIcon /> Xóa
                </a>
            </li>
        </ul>
    </div>
)

const UsersDirectory = () => {
    const [openMenuId, setOpenMenuId] = useState(null)
    const menuRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = event => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleMenu = userId =>
        setOpenMenuId(openMenuId === userId ? null : userId)

    const formatDate = dateString => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }
        return new Date(dateString).toLocaleDateString('vi-VN', options)
    }

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden font-sans">
            <div className="pt-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
                        Danh sách người dùng
                    </h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Tìm kiếm người dùng..."
                                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <div className="absolute top-1/2 left-3 -translate-y-1/2">
                                <SearchIcon />
                            </div>
                        </div>
                        <select className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Tất cả trạng thái</option>
                            <option>Hoạt động</option>
                            <option>Ngừng hoạt động</option>
                            <option>Đang chờ</option>
                        </select>
                        <select className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Tất cả vai trò</option>
                            <option>Quản trị viên</option>
                            <option>Người dùng</option>
                            <option>Điều hành viên</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 w-12">
                                <input type="checkbox" className="rounded" />
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center">
                                    Họ tên <SortIcon />
                                </div>
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Điện thoại
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Địa chỉ
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vai trò
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày tạo
                            </th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {usersData.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="py-4 px-4">
                                    <input
                                        type="checkbox"
                                        className="rounded"
                                    />
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <img
                                            className="w-10 h-10 rounded-full"
                                            src={user.avatar_link}
                                            alt={`Ảnh đại diện của ${user.full_name}`}
                                        />
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">
                                                {user.full_name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                @{user.username}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                    {user.email}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                    {user.phone}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                    {user.address}, {user.city}
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <RoleBadge role={user.role} />
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap">
                                    <StatusBadge status={user.status} />
                                </td>
                                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                    {formatDate(user.created_at)}
                                </td>
                                <td
                                    className="py-4 px-4 whitespace-nowrap relative"
                                    ref={
                                        openMenuId === user.id ? menuRef : null
                                    }
                                >
                                    <button
                                        onClick={() => toggleMenu(user.id)}
                                        className="p-1 border rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <EllipsisIcon />
                                    </button>
                                    {openMenuId === user.id && (
                                        <ActionMenu
                                            onEdit={() => {
                                                alert(
                                                    `Chỉnh sửa ${user.full_name}`
                                                )
                                                setOpenMenuId(null)
                                            }}
                                            onView={() => {
                                                alert(
                                                    `Xem hồ sơ của ${user.full_name}`
                                                )
                                                setOpenMenuId(null)
                                            }}
                                            onDelete={() => {
                                                alert(`Xóa ${user.full_name}`)
                                                setOpenMenuId(null)
                                            }}
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                <p className="mb-4 sm:mb-0">
                    Hiển thị 1 đến {usersData.length} trong tổng số{' '}
                    {usersData.length} kết quả
                </p>
                <div className="inline-flex -space-x-px">
                    <button className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100 focus:outline-none">
                        Trước
                    </button>
                    <button className="px-3 py-1 text-white bg-indigo-600 border border-indigo-600 focus:outline-none">
                        1
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100 focus:outline-none">
                        Sau
                    </button>
                </div>
            </div>
        </div>
    )
}

export default UsersDirectory
