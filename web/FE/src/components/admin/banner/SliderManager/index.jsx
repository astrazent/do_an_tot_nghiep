import React, { useState, useEffect, useRef } from 'react'
import {
    FiMoreVertical,
    FiChevronDown,
    FiSearch,
    FiFilter,
    FiPlus,
    FiEye,
    FiEdit3,
    FiTrash2,
    FiRefreshCw,
    FiChevronsLeft,
    FiChevronLeft,
    FiChevronRight,
    FiChevronsRight,
} from 'react-icons/fi'

import { getListSlider, deleteSlider } from '~/services/admin/slideAdminService'
import EditSliderModal from '../EditSliderModal'
import CreateSliderModal from '../CreateSliderModal'
import Alert from '~/components/shared/Alert' 

/* ====================== HELPER ====================== */
const formatDate = (dateString) => {
    if (!dateString || dateString === 'null') return '—'
    return new Date(dateString).toLocaleDateString('vi-VN')
}

/* ====================== UI COMPONENTS ====================== */
const SliderStatus = ({ status }) => {
    const isActive = status === 1 || status === '1'
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
            {isActive ? 'Hiển thị' : 'Ẩn'}
        </span>
    )
}

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

    const options = [
        { key: '', label: 'Tất cả trạng thái' },
        { key: '1', label: 'Hiển thị' },
        { key: '0', label: 'Ẩn' },
    ]

    return (
        <div className="relative w-full" ref={ref}>
            <div
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:border-indigo-400 transition-colors text-sm text-gray-700"
            >
                <span className="truncate">{options.find(o => o.key === value)?.label || 'Tất cả trạng thái'}</span>
                <FiChevronDown className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl">
                    {options.map(item => (
                        <div
                            key={item.key}
                            onClick={() => { onChange(item.key); setOpen(false) }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${value === item.key ? 'bg-indigo-50 text-indigo-600 font-medium' : 'hover:bg-gray-50 text-gray-600'}`}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// Modal xác nhận xóa (tương tự các file trước)
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, sliderName }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Xác nhận xóa Banner
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Bạn có chắc chắn muốn xóa Banner 
                    <span className="font-medium text-red-600"> "{sliderName || 'không tên'}"</span>?
                    <br />
                    Hành động này không thể hoàn tác.
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
                        <FiTrash2 className="w-4 h-4" />
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    )
}

// Actions Dropdown (giống UsersTable, ProductTable)
const ActionsDropdown = ({ slider, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
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
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden">
                    <button
                        onClick={() => { window.open(slider.image_url, '_blank'); setOpen(false) }}
                        className="w-full px-4 py-3 text-left hover:bg-indigo-50 text-sm text-gray-700 flex items-center gap-3"
                    >
                        <FiEye className="text-indigo-500" /> Xem ảnh
                    </button>

                    <div className="h-px bg-gray-100 mx-3"></div>

                    <button
                        onClick={() => { onEdit(slider); setOpen(false) }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 text-sm text-blue-600 flex items-center gap-3"
                    >
                        <FiEdit3 /> Chỉnh sửa
                    </button>

                    <div className="h-px bg-gray-100 mx-3"></div>

                    <button
                        onClick={() => { onDelete(slider); setOpen(false) }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3"
                    >
                        <FiTrash2 /> Xóa banner
                    </button>
                </div>
            )}
        </div>
    )
}

/* ====================== PHÂN TRANG ====================== */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null

    const pageNumbers = []
    const maxVisible = 7

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
    } else {
        if (currentPage <= 4) {
            pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages)
        } else if (currentPage >= totalPages - 3) {
            pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
            pageNumbers.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
        }
    }

    return (
        <div className="flex items-center justify-center gap-1 py-4">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"><FiChevronsLeft className="w-5 h-5" /></button>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"><FiChevronLeft className="w-5 h-5" /></button>

            {pageNumbers.map((page, i) =>
                page === '...' ? <span key={i} className="px-3 py-2 text-gray-500">…</span> : (
                    <button
                        key={i}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${currentPage === page ? 'bg-indigo-600 text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`}
                    >
                        {page}
                    </button>
                )
            )}

            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"><FiChevronRight className="w-5 h-5" /></button>
            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"><FiChevronsRight className="w-5 h-5" /></button>
        </div>
    )
}

/* ====================== MAIN COMPONENT ====================== */
const SliderManager = () => {
    const [sliders, setSliders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Modal states
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedSlider, setSelectedSlider] = useState(null)

    // Delete modal states
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [sliderToDelete, setSliderToDelete] = useState(null)
    const [deletingId, setDeletingId] = useState(null)

    // Alert state
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type })
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 2500)
    }

    /* ================== LOAD SLIDER ================== */
    const fetchSliders = async () => {
        try {
            setLoading(true)
            setError(null)
            const result = await getListSlider()
            if (result?.data) setSliders(result.data)
        } catch (err) {
            setError('Không thể tải danh sách slider')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSliders()
    }, [])

    // Reset trang khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1)
    }, [search, statusFilter, dateFrom, dateTo])

    /* ================== EDIT SLIDER ================== */
    const handleEdit = (slider) => {
        setSelectedSlider(slider)
        setIsEditModalOpen(true)
    }

    const handleUpdateSuccess = (updatedSlider) => {
        setSliders(prev => prev.map(s => s.id === updatedSlider.id ? updatedSlider : s))
        setIsEditModalOpen(false)
        setSelectedSlider(null)
        showAlert('Cập nhật slider thành công!', 'success')
    }

    /* ================== DELETE SLIDER ================== */
    const handleDeleteClick = (slider) => {
        setSliderToDelete(slider)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!sliderToDelete) return

        setDeletingId(sliderToDelete.id)
        try {
            await deleteSlider(sliderToDelete.id)
            setSliders(prev => prev.filter(s => s.id !== sliderToDelete.id))
            showAlert('Xóa slider thành công!', 'success')
        } catch (err) {
            console.error(err)
            showAlert('Xóa slider thất bại!', 'error')
        } finally {
            setDeletingId(null)
            setIsDeleteModalOpen(false)
            setSliderToDelete(null)
        }
    }

    /* ================== FILTER ================== */
    const filtered = sliders.filter(s => {
        const matchesSearch =
            s.name?.toLowerCase().includes(search.toLowerCase()) ||
            String(s.id).includes(search)

        const matchesStatus = statusFilter === '' || String(s.status) === statusFilter

        const startDate = s.start_date && s.start_date !== 'null' ? s.start_date.split('T')[0] : null
        const endDate = s.end_date && s.end_date !== 'null' ? s.end_date.split('T')[0] : null

        const matchesFrom = !dateFrom || (startDate && startDate >= dateFrom)
        const matchesTo = !dateTo || (endDate && endDate <= dateTo)

        return matchesSearch && matchesStatus && matchesFrom && matchesTo
    })

    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const endIndex = Math.min(currentPage * itemsPerPage, totalItems)
    const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    /* ================== RENDER ================== */
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Banner</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Hiển thị {startIndex}–{endIndex} trong tổng số {totalItems} banner
                    </p>
                </div>

                <div className="flex gap-3">

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                    >
                        <FiPlus className="text-xl" /> Thêm banner mới
                    </button>
                </div>
            </div>

            {/* Alert */}
            {alert.show && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    duration={2500}
                    onClose={() => setAlert({ show: false, message: '', type: 'success' })}
                />
            )}

            {/* Filter Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <FiFilter className="text-indigo-500" /> Bộ lọc tìm kiếm
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm tên slider hoặc ID..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <DropdownStatus value={statusFilter} onChange={setStatusFilter} />

                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <span className="text-gray-400">→</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                </div>

                {(dateFrom || dateTo) && (
                    <div className="text-xs text-gray-600">
                        Đang lọc theo thời gian:
                        {dateFrom ? ` từ ${new Date(dateFrom).toLocaleDateString('vi-VN')}` : ''}
                        {dateFrom && dateTo ? ' → ' : ''}
                        {dateTo ? ` đến ${new Date(dateTo).toLocaleDateString('vi-VN')}` : ''}

                        <button
                            onClick={() => { setDateFrom(''); setDateTo('') }}
                            className="ml-3 text-indigo-600 hover:underline"
                        >
                            Xóa lọc ngày
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-4">Banner</div>
                    <div className="col-span-2">Liên kết</div>
                    <div className="col-span-2 text-center">Trạng thái</div>
                    <div className="col-span-2 text-center">Thời gian</div>
                    <div className="col-span-1 text-center">Thứ tự</div>
                    <div className="col-span-1 text-center">Hành động</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {loading ? (
                        [...Array(itemsPerPage)].map((_, i) => (
                            <div key={i} className="grid grid-cols-12 gap-4 px-6 py-4 animate-pulse">
                                <div className="col-span-4 flex items-center gap-3">
                                    <div className="w-16 h-10 bg-gray-200 rounded-lg"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-4 bg-gray-200 rounded w-48"></div>
                                        <div className="h-3 bg-gray-200 rounded w-32"></div>
                                    </div>
                                </div>

                                <div className="col-span-2"><div className="h-4 bg-gray-200 rounded w-32"></div></div>
                                <div className="col-span-2 text-center"><div className="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div></div>
                                <div className="col-span-2 text-center"><div className="h-4 bg-gray-200 rounded w-36 mx-auto"></div></div>
                                <div className="col-span-1 text-center"><div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div></div>
                                <div className="col-span-1 text-center"><div className="h-6 w-6 bg-gray-200 rounded-full mx-auto"></div></div>
                            </div>
                        ))
                    ) : currentItems.length === 0 ? (
                        <div className="py-12 text-center text-gray-500">Không tìm thấy banner nào</div>
                    ) : (
                        currentItems.map(slider => (
                            <div
                                key={slider.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/80 transition-colors"
                            >
                                <div className="col-span-4 flex items-center gap-3 min-w-0">
                                    <img
                                        src={slider.image_url}
                                        alt={slider.name}
                                        className="w-16 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 text-sm truncate">
                                            {slider.name || 'Không có tên'}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">ID: #{slider.id}</div>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <a
                                        href={slider.link_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-indigo-600 hover:underline text-sm truncate block"
                                    >
                                        {slider.link_url || '—'}
                                    </a>
                                </div>

                                <div className="col-span-2 text-center">
                                    <SliderStatus status={slider.status} />
                                </div>

                                <div className="col-span-2 text-center text-xs text-gray-600">
                                    <div>{formatDate(slider.start_date)}</div>
                                    <div>{formatDate(slider.end_date)}</div>
                                </div>

                                <div className="col-span-1 text-center font-semibold text-gray-700">
                                    {slider.sort_order || '-'}
                                </div>

                                <div className="col-span-1 flex justify-center">
                                    {deletingId === slider.id ? (
                                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <ActionsDropdown
                                            slider={slider}
                                            onEdit={handleEdit}
                                            onDelete={handleDeleteClick}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Modal Thêm Slider */}
            <CreateSliderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={(newSlider) => {
                    setSliders(prev => [newSlider, ...prev])
                    setIsCreateModalOpen(false)
                    showAlert('Thêm slider mới thành công!', 'success')
                }}
            />

            {/* Modal Chỉnh sửa Slider */}
            <EditSliderModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedSlider(null)
                }}
                onSuccess={handleUpdateSuccess}
                slider={selectedSlider}
            />

            {/* Modal Xác nhận xóa */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setSliderToDelete(null)
                }}
                onConfirm={handleConfirmDelete}
                sliderName={sliderToDelete?.name || 'không tên'}
            />
        </div>
    )
}

export default SliderManager