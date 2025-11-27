// src/pages/admin/blog/AdminBlogTypeManagement.jsx
import React, { useState, useEffect, useRef } from 'react'
import {
    FaEdit, FaTrashAlt, FaEllipsisV, FaSearch, FaTimes, FaPlus, FaTag, FaCalendarAlt
} from 'react-icons/fa'
import BlogTypeCreateModal from '~/components/admin/blog/BlogTypeCreateModal'
import BlogTypeEditModal from '~/components/admin/blog/BlogTypeEditModal'
import { deletePostType, getListPostType } from '~/services/admin/postAdminService'

const formatDateTime = dateString => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    const day = date.toLocaleDateString('vi-VN')
    return `${time} ${day}`
}

const SkeletonRow = () => (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="col-span-3"><div className="h-4 bg-gray-200 rounded w-full mb-2"></div><div className="h-3 bg-gray-200 rounded w-2/3"></div></div>
        <div className="col-span-3"><div className="h-4 bg-gray-200 rounded w-4/5"></div></div>
        <div className="col-span-3"><div className="h-3 bg-gray-200 rounded w-full"></div></div>
        <div className="col-span-2"><div className="h-3 bg-gray-200 rounded w-5/6"></div></div>
        <div className="col-span-1 flex justify-center"><div className="h-8 w-8 bg-gray-200 rounded"></div></div>
    </div>
)

const ActionDropdown = ({ item, onEdit, onDelete, deleting }) => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = e => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false) }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            {deleting ? (
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors">
                    <FaEllipsisV className="w-4 h-4" />
                </button>
            )}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                    <button onClick={() => { onEdit(item); setIsOpen(false) }} className="w-full px-4 py-3 text-left hover:bg-blue-50 text-sm text-gray-700 flex items-center gap-3">
                        <FaEdit className="text-blue-500" /> Chỉnh sửa
                    </button>
                    <div className="h-px bg-gray-100 mx-3"></div>
                    <button onClick={() => { onDelete(item); setIsOpen(false) }} className="w-full px-4 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3">
                        <FaTrashAlt className="text-red-500" /> Xóa loại bài
                    </button>
                </div>
            )}
        </div>
    )
}

const AdminBlogTypeManagement = () => {
    const [types, setTypes] = useState([])
    const [filteredTypes, setFilteredTypes] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [deletingId, setDeletingId] = useState(null)

    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingType, setEditingType] = useState(null)

    const itemsPerPage = 8

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true)
            try {
                const res = await getListPostType()
                const list = res.data || []
                setTypes(list)
                setFilteredTypes(list)
            } catch (err) {
                setError('Không thể tải danh sách loại bài viết')
            } finally {
                setIsLoading(false)
            }
        }
        fetch()
    }, [refreshTrigger])

    useEffect(() => {
        let result = types
        if (searchTerm) {
            result = result.filter(t => 
                t.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                t.slug?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }
        setFilteredTypes(result)
        setCurrentPage(1)
    }, [searchTerm, types])

    const handleCreateSuccess = () => setRefreshTrigger(prev => prev + 1)
    const handleUpdateSuccess = () => setRefreshTrigger(prev => prev + 1)

    const handleEdit = (type) => {
        setEditingType(type)
        setIsEditOpen(true)
    }

    const handleDelete = async (type) => {
        if (!window.confirm(`Xóa loại bài viết "${type.name}"?\nCác bài viết thuộc loại này có thể bị ảnh hưởng!`)) return

        setDeletingId(type.id)
        try {
            await deletePostType(type.id)
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            alert(err.response?.data?.message || 'Không thể xóa (có thể đang có bài viết)')
        } finally {
            setDeletingId(null)
        }
    }

    const totalPages = Math.ceil(filteredTypes.length / itemsPerPage)
    const currentItems = filteredTypes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const pages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
        if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Loại Bài Viết</h1>
                    <p className="text-sm text-gray-500 mt-1">Tổ chức và quản lý các loại bài viết trên blog</p>
                </div>
                <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2.5 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-md hover:shadow-lg">
                    <FaPlus className="text-lg" /> Thêm loại mới
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}><FaTimes /></button>
                </div>
            )}

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <FaSearch className="text-indigo-500" /> Tìm kiếm loại bài viết
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc slug..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-2 text-center">Tên loại bài</div>
                    <div className="col-span-3 text-center">Slug</div>
                    <div className="col-span-3 text-center">Mô tả</div>
                    <div className="col-span-3 text-center">Ngày tạo / Cập nhật</div>
                    <div className="col-span-1 text-center">Thao tác</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                    ) : currentItems.length > 0 ? (
                        currentItems.map(item => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/80 group">
                                <div className="col-span-2 flex items-center gap-3">
                                    <div className="font-medium text-gray-900">{item.name}</div>
                                </div>

                                <div className="col-span-3 font-mono text-sm text-gray-600 text-center">{item.slug}</div>

                                <div className="col-span-3 text-sm text-gray-600 text-center">
                                    {item.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                                </div>

                                <div className="col-span-3 text-xs text-gray-600 flex flex-col items-center gap-1">
                                    <div className="flex items-center gap-1.5">
                                        <FaCalendarAlt className="text-gray-400" />
                                        {formatDateTime(item.created_at)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-gray-500">
                                        <FaCalendarAlt className="text-gray-400 text-xs" />
                                        {formatDateTime(item.updated_at) === formatDateTime(item.created_at) 
                                            ? <span className="text-gray-400">Chưa cập nhật</span>
                                            : formatDateTime(item.updated_at)}
                                    </div>
                                </div>

                                <div className="col-span-1 flex justify-center">
                                    <ActionDropdown 
                                        item={item} 
                                        onEdit={handleEdit} 
                                        onDelete={handleDelete}
                                        deleting={deletingId === item.id}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">Không tìm thấy loại bài viết nào...</div>
                    )}
                </div>

                {filteredTypes.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center gap-2 py-4">
                        {pages().map((p, i) => (
                            p === '...' ? <span key={i} className="px-3 py-2">…</span> :
                            <button key={i} onClick={() => setCurrentPage(p)} className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === p ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <BlogTypeCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={handleCreateSuccess} />
            <BlogTypeEditModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} type={editingType} onSuccess={handleUpdateSuccess} />
        </div>
    )
}

export default AdminBlogTypeManagement