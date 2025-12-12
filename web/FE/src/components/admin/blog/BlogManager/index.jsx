import React, { useState, useEffect, useRef } from 'react'
import {
    FaEdit,
    FaTrashAlt,
    FaEye,
    FaSyncAlt,
    FaEllipsisV,
} from 'react-icons/fa'

const initialPosts = [
    {
        id: 1,
        title: 'Mùa du lịch miền Tây',
        author: 'Nguyễn Văn A',
        description:
            'Cẩm nang khám phá đặc sản và các địa điểm không thể bỏ lỡ.',
        published_at: '2025-10-01',
        status: 'Đăng',
    },
    {
        id: 2,
        title: 'Giảm giá đặc biệt tháng 10',
        author: 'Admin',
        description:
            'Ưu đãi khủng tháng 10, đừng bỏ lỡ cơ hội mua sắm tuyệt vời.',
        published_at: '2025-10-10',
        status: 'Ẩn',
    },
    {
        id: 3,
        title: 'Công thức nấu ăn mùa thu',
        author: 'Lê Thị B',
        description: 'Tổng hợp các món ăn ngon và dễ làm cho mùa thu se lạnh.',
        published_at: '2025-09-25',
        status: 'Đăng',
    },
    {
        id: 4,
        title: 'Cập nhật công nghệ mới',
        author: 'Admin',
        description: 'Những xu hướng công nghệ định hình năm 2026.',
        published_at: '2025-10-05',
        status: 'Đăng',
    },
]

const StatusDisplay = ({ status }) => {
    const isPublished = status === 'Đăng'
    const text = isPublished ? 'Đăng' : 'Ẩn'
    const icon = isPublished ? '✅' : '🚫'
    const colorClass = isPublished ? 'text-green-700' : 'text-red-700'

    return (
        <span className={`font-medium ${colorClass}`}>{`${icon} ${text}`}</span>
    )
}

const ActionDropdown = ({
    post,
    onToggleStatus,
    onEdit,
    onPreview,
    onDelete,
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = event => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const toggleStatusText =
        post.status === 'Đăng' ? 'Chuyển thành Ẩn' : 'Chuyển thành Đăng'

    const handleAction = action => {
        action()
        setIsOpen(false)
    }

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <FaEllipsisV className="h-4 w-4" />
                </button>
            </div>

            {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div
                        className="py-1"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                handleAction(() => onToggleStatus(post.id))
                            }}
                            className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            <FaSyncAlt className="mr-3 text-gray-400 group-hover:text-gray-600" />
                            {toggleStatusText}
                        </a>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                handleAction(() => onEdit(post.id))
                            }}
                            className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            <FaEdit className="mr-3 text-gray-400 group-hover:text-gray-600" />
                            Chỉnh sửa
                        </a>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                handleAction(() => onPreview(post.id))
                            }}
                            className="text-gray-700 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            <FaEye className="mr-3 text-gray-400 group-hover:text-gray-600" />
                            Xem trước
                        </a>
                        <div className="border-t border-gray-100"></div>
                        <a
                            href="#"
                            onClick={e => {
                                e.preventDefault()
                                handleAction(() => onDelete(post.id))
                            }}
                            className="text-red-600 group flex items-center px-4 py-2 text-sm hover:bg-gray-100"
                            role="menuitem"
                        >
                            <FaTrashAlt className="mr-3 text-red-400 group-hover:text-red-600" />
                            Xóa
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}

const BlogManager = () => {
    const [posts, setPosts] = useState(initialPosts)
    const [filteredPosts, setFilteredPosts] = useState(initialPosts)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('Tất cả')
    const [dateFilter, setDateFilter] = useState('')

    useEffect(() => {
        let result = posts
        if (searchTerm) {
            result = result.filter(
                post =>
                    post.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    post.author
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    post.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
        }
        if (statusFilter !== 'Tất cả') {
            result = result.filter(post => post.status === statusFilter)
        }
        if (dateFilter) {
            result = result.filter(post => post.published_at === dateFilter)
        }
        result.sort(
            (a, b) => new Date(b.published_at) - new Date(a.published_at)
        )
        setFilteredPosts(result)
    }, [searchTerm, statusFilter, dateFilter, posts])

    const handleResetFilters = () => {
        setSearchTerm('')
        setStatusFilter('Tất cả')
        setDateFilter('')
    }

    const handleEdit = postId => alert(`Sửa bài viết ID: ${postId}`)
    const handlePreview = postId => alert(`Xem trước bài viết ID: ${postId}`)
    const handleDelete = postId => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
        }
    }
    const handleToggleStatus = postId => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? {
                          ...post,
                          status: post.status === 'Đăng' ? 'Ẩn' : 'Đăng',
                      }
                    : post
            )
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Quản lý Bài viết
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tìm kiếm
                    </label>
                    <input
                        type="text"
                        placeholder="Tìm theo tiêu đề, tác giả, mô tả..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trạng thái
                    </label>
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option>Tất cả</option>
                        <option>Đăng</option>
                        <option>Ẩn</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày phát hành
                    </label>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={e => setDateFilter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="md:col-start-4 flex items-end justify-end">
                    <button
                        onClick={handleResetFilters}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                        Reset
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tiêu đề
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tác giả
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mô tả
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ngày phát hành
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredPosts.map(post => (
                            <tr key={post.id}>
                                <td className="px-6 py-4 max-w-sm">
                                    <p className="font-semibold text-gray-900 truncate">
                                        {post.title}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {post.author}
                                </td>
                                <td className="px-6 py-4 max-w-md">
                                    <p className="text-sm text-gray-700 truncate">
                                        {post.description}
                                    </p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {post.published_at}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusDisplay status={post.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <ActionDropdown
                                        post={post}
                                        onToggleStatus={handleToggleStatus}
                                        onEdit={handleEdit}
                                        onPreview={handlePreview}
                                        onDelete={handleDelete}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {filteredPosts.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                    Không tìm thấy bài viết nào phù hợp.
                </div>
            )}
        </div>
    )
}

export default BlogManager
