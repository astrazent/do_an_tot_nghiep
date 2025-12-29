import React, { useState, useEffect, useRef } from 'react'
import {
    FaEdit,
    FaTrashAlt,
    FaEllipsisV,
    FaSearch,
    FaFilter,
    FaTimes,
    FaPlus,
    FaTag,
    FaLayerGroup,
    FaCalendarAlt,
    FaSitemap,
} from 'react-icons/fa'
import { getListCategory } from '~/services/admin/productAdminService'
import { deleteCategory } from '~/services/admin/categoryAdminService'
import CategoryCreateModal from '~/components/admin/category/CategoryCreateModal'
import CategoryEditModal from '~/components/admin/category/CategoryEditModal'
import Alert from '~/components/shared/Alert'

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    const day = date.toLocaleDateString('vi-VN')
    return `${time} ${day}`
}

// Skeleton Row
const SkeletonRow = () => (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="col-span-3"><div className="h-4 bg-gray-200 rounded w-full mb-2"></div><div className="h-3 bg-gray-200 rounded w-2/3"></div></div>
        <div className="col-span-2"><div className="h-4 bg-gray-200 rounded w-4/5"></div></div>
        <div className="col-span-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>
        <div className="col-span-2"><div className="h-3 bg-gray-200 rounded w-full"></div></div>
        <div className="col-span-2"><div className="h-3 bg-gray-200 rounded w-5/6"></div></div>
        <div className="col-span-1 flex justify-center"><div className="h-8 w-8 bg-gray-200 rounded"></div></div>
    </div>
)

// Parent Filter Dropdown (giữ nguyên)
const ParentFilterDropdown = ({ value, onChange, categories }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const options = [
        { id: null, name: 'Tất cả danh mục' },
        { id: 0, name: 'Danh mục gốc' },
        ...(categories || []).filter(c => c.parent_id !== null).map(c => ({ id: c.id, name: c.name })),
    ]

    const currentLabel = options.find(o => o.id === value)?.name || 'Tất cả danh mục'

    return (
        <div className="relative w-full" ref={ref}>
            <div
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:border-indigo-400 transition-colors text-sm text-gray-700"
            >
                <span className="truncate">{currentLabel}</span>
                <svg className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden max-h-64 overflow-y-auto">
                    {options.map(item => (
                        <div
                            key={item.id ?? 'all'}
                            onClick={() => { onChange(item.id); setOpen(false) }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === item.id ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Action Dropdown (giữ nguyên)
const ActionDropdown = ({ category, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
            >
                <FaEllipsisV className="w-4 h-4" />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                    <button onClick={() => { onEdit(category); setIsOpen(false) }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 text-sm text-gray-700 flex items-center gap-3">
                        <FaEdit className="text-blue-500" /> Chỉnh sửa
                    </button>
                    <div className="h-px bg-gray-100 mx-3"></div>
                    <button onClick={() => { onDelete(category); setIsOpen(false) }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3">
                        <FaTrashAlt className="text-red-500" /> Xóa danh mục
                    </button>
                </div>
            )}
        </div>
    )
}

// Modal xác nhận xóa (tương tự ProductTable)
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, categoryName }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Xác nhận xóa danh mục
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Bạn có chắc chắn muốn xóa danh mục 
                    <span className="font-medium text-red-600"> "{categoryName}"</span>?
                    <br />
                    Các danh mục con sẽ chuyển thành gốc. Sản phẩm liên quan có thể bị ảnh hưởng.
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                    >
                        <FaTrashAlt className="w-4 h-4" />
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    )
}

const AdminCategoryManagement = () => {
    const [categories, setCategories] = useState([])
    const [filteredCategories, setFilteredCategories] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [parentFilter, setParentFilter] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [deletingId, setDeletingId] = useState(null)

    // State cho Alert
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type })
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 2500)
    }

    // State cho modal xóa
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [categoryToDelete, setCategoryToDelete] = useState(null)

    const itemsPerPage = 6

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true)
            try {
                const data = await getListCategory()
                const list = data.data || data || []
                setCategories(list)
                setFilteredCategories(list)
            } catch (err) {
                setError('Không thể tải danh sách danh mục')
            } finally {
                setIsLoading(false)
            }
        }
        fetchCategories()
    }, [refreshTrigger])

    useEffect(() => {
        let result = categories

        if (searchTerm) {
            result = result.filter(cat =>
                cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (parentFilter !== null) {
            result = parentFilter === 0
                ? result.filter(cat => cat.parent_id === null)
                : result.filter(cat => cat.parent_id === parentFilter)
        }

        setFilteredCategories(result)
        setCurrentPage(1)
    }, [searchTerm, parentFilter, categories])

    const handleEdit = (category) => {
        setSelectedCategory(category)
        setIsEditModalOpen(true)
    }

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return

        setDeletingId(categoryToDelete.id)
        try {
            await deleteCategory(categoryToDelete.id)
            showAlert('Xóa danh mục thành công!', 'success')
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            const msg = err.response?.data?.message || 'Không thể xóa danh mục này (có thể có sản phẩm hoặc danh mục con)'
            showAlert(msg, 'error')
        } finally {
            setDeletingId(null)
            setIsDeleteModalOpen(false)
            setCategoryToDelete(null)
        }
    }

    const handleCreateSuccess = () => {
        showAlert('Thêm danh mục mới thành công!', 'success')
        setRefreshTrigger(prev => prev + 1)
    }

    const handleUpdateSuccess = () => {
        showAlert('Cập nhật danh mục thành công!', 'success')
        setRefreshTrigger(prev => prev + 1)
    }

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
    const currentItems = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const pages = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
        if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục Sản phẩm</h1>
                    <p className="text-sm text-gray-500 mt-1">Tổ chức và quản lý cấu trúc danh mục cửa hàng</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2.5 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                    <FaPlus className="text-lg" />
                    Thêm danh mục mới
                </button>
            </div>

            {/* Alert hiển thị */}
            {alert.show && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    duration={2500}
                    onClose={() => setAlert({ show: false, message: '', type: 'success' })}
                />
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}><FaTimes /></button>
                </div>
            )}

            {/* Bộ lọc */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <FaFilter className="text-indigo-500" /> Bộ lọc tìm kiếm
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 relative">
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
                    <div className="md:col-span-4">
                        <ParentFilterDropdown value={parentFilter} onChange={setParentFilter} categories={categories} />
                    </div>
                    <div className="md:col-span-3 flex items-center justify-end">
                        <button
                            onClick={() => { setSearchTerm(''); setParentFilter(null) }}
                            className="px-4 py-2.5 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                            Xóa bộ lọc
                        </button>
                    </div>
                </div>
            </div>

            {/* Bảng */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3 text-center">Danh mục</div>
                    <div className="col-span-2 text-center">Slug</div>
                    <div className="col-span-2 text-center">Danh mục cha</div>
                    <div className="col-span-2 text-center">Ngày tạo</div>
                    <div className="col-span-2 text-center">Cập nhật</div>
                    <div className="col-span-1 text-center">Thao tác</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
                    ) : currentItems.length > 0 ? (
                        currentItems.map(cat => (
                            <div key={cat.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/80 group">
                                <div className="col-span-3 flex items-center gap-3">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        {cat.parent_id ? <FaLayerGroup className="text-indigo-600" /> : <FaTag className="text-indigo-600" />}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{cat.name}</div>
                                        {cat.description && <div className="text-xs text-gray-500 italic truncate max-w-xs">{cat.description}</div>}
                                    </div>
                                </div>

                                <div className="col-span-2 font-mono text-sm text-gray-600 text-center">{cat.slug}</div>

                                <div className="col-span-2 text-sm text-gray-700 text-center">
                                    {cat.parent_id ? (
                                        <span className="flex items-center justify-center gap-1 text-indigo-600">
                                            <FaSitemap className="text-xs" />
                                            {categories.find(c => c.id === cat.parent_id)?.name || 'Cha đã xóa'}
                                        </span>
                                    ) : (
                                        <span className="text-emerald-600 font-medium">Danh mục gốc</span>
                                    )}
                                </div>

                                <div className="col-span-2 text-xs text-gray-600 flex items-center justify-center gap-1.5">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span className="whitespace-nowrap">{formatDateTime(cat.created_at)}</span>
                                </div>

                                <div className="col-span-2 text-xs text-gray-600 flex items-center justify-center gap-1.5">
                                    <FaCalendarAlt className="text-gray-400" />
                                    <span className="whitespace-nowrap">{formatDateTime(cat.updated_at)}</span>
                                </div>

                                <div className="col-span-1 flex justify-center">
                                    {deletingId === cat.id ? (
                                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <ActionDropdown category={cat} onEdit={handleEdit} onDelete={handleDeleteClick} />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <FaTag className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-gray-900 font-medium">Không tìm thấy danh mục nào</h3>
                            <p className="text-gray-500 text-sm mt-1">Thử thay đổi từ khóa hoặc bộ lọc</p>
                        </div>
                    )}
                </div>

                {filteredCategories.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center gap-2 py-4">
                        {pages().map((p, i) => (
                            p === '...' ? <span key={i} className="px-3 py-2">…</span> :
                            <button key={i} onClick={() => setCurrentPage(p)}
                                className={`px-4 py-2 rounded-lg border transition-colors ${currentPage === p ? 'bg-indigo-600 text-white' : 'hover:bg-gray-50'}`}>
                                {p}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <CategoryCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            <CategoryEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                category={selectedCategory}
                onSuccess={handleUpdateSuccess}
            />

            {/* Modal Xác nhận xóa */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setCategoryToDelete(null)
                }}
                onConfirm={handleConfirmDelete}
                categoryName={categoryToDelete?.name || ''}
            />
        </div>
    )
}

export default AdminCategoryManagement