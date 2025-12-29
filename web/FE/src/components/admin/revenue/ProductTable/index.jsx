import React, { useState, useEffect, useRef } from 'react'
import {
    FiMoreVertical,
    FiChevronDown,
    FiSearch,
    FiFilter,
    FiEye,
    FiShoppingBag,
    FiEdit,
    FiPlus,
    FiTrash2,
} from 'react-icons/fi'

import { getListProduct, deleteProduct } from '~/services/admin/productAdminService'
import CreateProductModal from '../CreateProduct'
import ProductDetailModal from '../ProductDetailModal'
import UpdateStockModal from '../UpdateProductModal'
import Alert from '../../../shared/Alert'  

// Skeleton Loading Row
const SkeletonRow = () => (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="col-span-3">
            <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="col-span-2 flex justify-end">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="col-span-2 flex justify-center">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
        <div className="col-span-2 flex justify-center">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="col-span-2 flex justify-end">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="col-span-1 flex justify-center">
            <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
        </div>
    </div>
)

// Status Badge
const ProductStatus = ({ status, stock_qty, low_stock_threshold }) => {
    let config
    if (status === 0 || status === 'stopped') {
        config = {
            label: 'Ngừng bán',
            bg: 'bg-gray-100',
            text: 'text-gray-600',
            dot: 'bg-gray-400',
        }
    } else if (stock_qty <= 0) {
        config = {
            label: 'Hết hàng',
            bg: 'bg-red-50',
            text: 'text-red-600',
            dot: 'bg-red-500',
        }
    } else if (stock_qty <= low_stock_threshold) {
        config = {
            label: 'Sắp hết',
            bg: 'bg-yellow-50',
            text: 'text-yellow-700',
            dot: 'bg-yellow-500',
        }
    } else {
        config = {
            label: 'Đang bán',
            bg: 'bg-emerald-50',
            text: 'text-emerald-700',
            dot: 'bg-emerald-500',
        }
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
            {config.label}
        </span>
    )
}

// Dropdown Status Filter
const DropdownStatus = ({ value, onChange }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const statuses = [
        { key: '', label: 'Tất cả trạng thái' },
        { key: 'selling', label: 'Đang bán' },
        { key: 'low_stock', label: 'Sắp hết hàng' },
        { key: 'out_of_stock', label: 'Hết hàng' },
        { key: 'stopped', label: 'Ngừng bán' },
    ]
    const currentLabel = statuses.find(s => s.key === value)?.label || 'Tất cả trạng thái'

    return (
        <div className="relative w-full" ref={ref}>
            <div
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:border-indigo-400 transition-colors text-sm text-gray-700"
            >
                <span className="truncate">{currentLabel}</span>
                <FiChevronDown
                    className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                />
            </div>
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl animate-fade-in-up overflow-hidden">
                    {statuses.map(item => (
                        <div
                            key={item.key}
                            onClick={() => {
                                onChange(item.key)
                                setOpen(false)
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === item.key ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Confirmation Delete Modal
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, productName }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Xác nhận xóa sản phẩm</h3>
                <p className="text-gray-600 mb-6">
                    Bạn có chắc chắn muốn xóa sản phẩm <span className="font-medium text-red-600">"{productName}"</span>?
                    <br />
                    Hành động này không thể hoàn tác.
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                        <FiTrash2 /> Xóa
                    </button>
                </div>
            </div>
        </div>
    )
}

// Actions Dropdown
const ActionsDropdown = ({ onViewDetail, onUpdateStock, onDelete }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = event => {
            if (ref.current && !ref.current.contains(event.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
            >
                <FiMoreVertical className="w-5 h-5" />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden">
                    <button
                        onClick={() => {
                            onViewDetail()
                            setOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-indigo-50 text-sm text-gray-700 flex items-center gap-3 transition-colors"
                    >
                        <FiEye className="text-indigo-500" /> Xem chi tiết
                    </button>
                    <div className="h-px bg-gray-100 mx-3"></div>
                    <button
                        onClick={() => {
                            onUpdateStock()
                            setOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 text-sm text-green-600 flex items-center gap-3 transition-colors"
                    >
                        <FiEdit /> Cập nhật sản phẩm
                    </button>
                    <div className="h-px bg-gray-100 mx-3"></div>
                    <button
                        onClick={() => {
                            onDelete()
                            setOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3 transition-colors"
                    >
                        <FiTrash2 /> Xóa sản phẩm
                    </button>
                </div>
            )}
        </div>
    )
}

// Main Component
const ProductTable = () => {
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [limit, setLimit] = useState(100)
    const [currentPage, setCurrentPage] = useState(1)
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')
    const displayPerPage = 10

    const [selectedProduct, setSelectedProduct] = useState(null)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

    // Delete states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState(null)

    // Alert state
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type })
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 2500)
    }

    const handleViewDetail = product => {
        setSelectedProduct(product)
        setIsDetailModalOpen(true)
    }

    const handleUpdateStock = product => {
        setSelectedProduct(product)
        setIsUpdateModalOpen(true)
    }

    const handleDeleteClick = product => {
        setProductToDelete(product)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!productToDelete) return

        try {
            await deleteProduct({ productId: productToDelete.id })
            showAlert('Xóa sản phẩm thành công!', 'success')
            setRefreshKey(prev => prev + 1)
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error)
            showAlert('Không thể xóa sản phẩm. Vui lòng thử lại.', 'error')
        } finally {
            setIsDeleteModalOpen(false)
            setProductToDelete(null)
        }
    }

    const handleUpdateSuccess = () => {
        showAlert('Cập nhật sản phẩm thành công!', 'success')
        setRefreshKey(prev => prev + 1)
    }

    const handleCreateSuccess = () => {
        showAlert('Thêm sản phẩm mới thành công!', 'success')
        setRefreshKey(prev => prev + 1)
    }

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true)
            try {
                const res = await getListProduct({ limit, offset: 0 })
                setProducts(res.data || [])
            } catch (error) {
                console.error('Lỗi tải danh sách sản phẩm:', error)
                showAlert('Không thể tải danh sách sản phẩm.', 'error')
            } finally {
                setTimeout(() => setIsLoading(false), 300)
            }
        }
        fetchProducts()
    }, [limit, refreshKey])

    // Filter logic (giữ nguyên)
    const filtered = products.filter(p => {
        const normalize = str =>
            str
                ?.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
        const searchLower = normalize(search)
        const matchSearch =
            normalize(p.name)?.includes(searchLower) ||
            String(p.id)?.includes(searchLower)

        const stockQty = p.stock_qty || 0
        const lowStockThreshold = p.low_stock_threshold || 0
        let matchStatus = true
        if (statusFilter === 'selling')
            matchStatus = p.status === 1 && stockQty > lowStockThreshold
        else if (statusFilter === 'low_stock')
            matchStatus = p.status === 1 && stockQty > 0 && stockQty <= lowStockThreshold
        else if (statusFilter === 'out_of_stock') matchStatus = stockQty <= 0
        else if (statusFilter === 'stopped') matchStatus = p.status === 0

        const createdDate = p.created_at?.split('T')[0]
        const matchFrom = dateFrom ? createdDate >= dateFrom : true
        const matchTo = dateTo ? createdDate <= dateTo : true

        return matchSearch && matchStatus && matchFrom && matchTo
    })

    const totalPages = Math.ceil(filtered.length / displayPerPage)
    const currentUsers = filtered.slice(
        (currentPage - 1) * displayPerPage,
        currentPage * displayPerPage
    )

    const pages = () => {
        if (totalPages <= 5) return [...Array(totalPages).keys()].map(i => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
        if (currentPage >= totalPages - 2)
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
    }

    return (
        <div className="space-y-6 fade-in">
            {/* HEADER + NÚT TẠO MỚI */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Kho hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Tổng cộng: {products.length} sản phẩm</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                >
                    <FiPlus className="text-xl" />
                    Thêm sản phẩm mới
                </button>
            </div>

            {/* FILTER CARD */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <FiFilter className="text-indigo-500" /> Bộ lọc tìm kiếm
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm theo tên sản phẩm, ID..."
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-3">
                        <DropdownStatus value={statusFilter} onChange={setStatusFilter} />
                    </div>
                    <div className="md:col-span-2">
                        <input
                            type="number"
                            min={1}
                            value={limit}
                            onChange={e => {
                                setLimit(Number(e.target.value))
                                setCurrentPage(1)
                            }}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Số bản ghi"
                        />
                    </div>
                    <div className="md:col-span-3 flex items-center gap-2">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => {
                                setDateFrom(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                        />
                        <span className="text-gray-400">-</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => {
                                setDateTo(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pb-4">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-3">Sản phẩm</div>
                    <div className="col-span-2 text-center">Giá bán / Giá gốc</div>
                    <div className="col-span-2 text-center">Tồn kho / Ngưỡng</div>
                    <div className="col-span-2 text-center">Trạng thái</div>
                    <div className="col-span-2 text-center">Cập nhật cuối</div>
                    <div className="col-span-1 text-center">...</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        [...Array(displayPerPage)].map((_, i) => <SkeletonRow key={i} />)
                    ) : currentUsers.length > 0 ? (
                        currentUsers.map(p => (
                            <div
                                key={p.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/80 transition-colors group"
                            >
                                <div className="col-span-3 flex flex-col justify-center overflow-hidden">
                                    <div className="font-medium text-gray-900 text-sm truncate" title={p.name}>
                                        {p.name}
                                    </div>
                                    <div className="text-xs text-gray-500 font-mono mt-0.5">ID: #{p.id}</div>
                                </div>
                                <div className="col-span-2 flex flex-col items-end justify-center">
                                    <div className="font-semibold text-sm text-blue-600 mx-auto text-center">
                                        {formatCurrency(p.price || 0)}
                                    </div>
                                    <div className="text-xs text-gray-500 line-through mx-auto text-center">
                                        {formatCurrency(p.origin_price || 0)}
                                    </div>
                                </div>
                                <div className="col-span-2 text-center flex flex-col justify-center">
                                    <div
                                        className={`font-bold text-base ${
                                            p.stock_qty <= p.low_stock_threshold && p.status === 1 ? 'text-red-600' : 'text-gray-900'
                                        }`}
                                    >
                                        {p.stock_qty || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">/ {p.low_stock_threshold || 0}</div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <ProductStatus
                                        status={p.status}
                                        stock_qty={p.stock_qty}
                                        low_stock_threshold={p.low_stock_threshold}
                                    />
                                </div>
                                <div className="col-span-2 text-right">
                                    <div className="text-sm text-gray-500 flex flex-col items-end">
                                        <span className="font-medium text-gray-700 mx-auto">
                                            {formatDateTime(p.updated_at)}
                                        </span>
                                        <span className="text-[10px] text-gray-400 mx-auto">
                                            ({formatDateTime(p.created_at)}: Created)
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1 flex items-center justify-center">
                                    <ActionsDropdown
                                        onViewDetail={() => handleViewDetail(p)}
                                        onUpdateStock={() => handleUpdateStock(p)}
                                        onDelete={() => handleDeleteClick(p)}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FiShoppingBag className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-gray-900 font-medium">Không tìm thấy sản phẩm nào</h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-6 mb-2">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50"
                    >
                        «
                    </button>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50"
                    >
                        ‹
                    </button>
                    {pages().map((p, i) =>
                        p === '...' ? (
                            <span key={i} className="px-3 py-2">…</span>
                        ) : (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(p)}
                                className={`px-3 py-2 border rounded-lg transition-colors ${
                                    currentPage === p ? 'bg-indigo-500 text-white' : 'hover:bg-gray-50'
                                }`}
                            >
                                {p}
                            </button>
                        )
                    )}
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50"
                    >
                        ›
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50"
                    >
                        »
                    </button>
                </div>
            </div>

            {/* Alert hiển thị khi có thông báo */}
            {alert.show && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    duration={2500}
                    onClose={() => setAlert({ show: false, message: '', type: 'success' })}
                />
            )}

            {/* Các Modal */}
            <ProductDetailModal
                productId={selectedProduct?.id}
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setTimeout(() => setSelectedProduct(null), 300)
                }}
            />
            <UpdateStockModal
                productId={selectedProduct?.id}
                isOpen={isUpdateModalOpen}
                onClose={() => {
                    setIsUpdateModalOpen(false)
                    setTimeout(() => setSelectedProduct(null), 300)
                }}
                onUpdateSuccess={handleUpdateSuccess}
            />
            <CreateProductModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateSuccess={handleCreateSuccess}
            />

            {/* Modal Xác nhận xóa */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setProductToDelete(null)
                }}
                onConfirm={handleConfirmDelete}
                productName={productToDelete?.name || ''}
            />
        </div>
    )
}

const formatCurrency = amount => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount)
}

const formatDateTime = isoString => {
    if (!isoString) return 'N/A'
    const date = new Date(isoString)
    const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    const day = date.toLocaleDateString('vi-VN')
    return `${time} ${day}`
}

export default ProductTable