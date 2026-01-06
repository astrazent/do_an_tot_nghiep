// ~/pages/admin/coupon/AdminCouponManagement.jsx
import React, { useState, useEffect, useRef } from 'react'
import {
    FaEllipsisV,
    FaSearch,
    FaTimes,
    FaPlus,
    FaTicketAlt,
    FaCalendarAlt,
    FaMoneyBillWave,
    FaPercentage,
    FaEye,
    FaEdit,
    FaTrashAlt,
} from 'react-icons/fa'
import {
    getListCoupon,
    deleteCoupon,
} from '../../../services/admin/couponAdminService'
import Alert from '~/components/shared/Alert'
import CouponCreateModal from '~/components/admin/coupon/CouponCreateModal'
import CouponEditModal from '~/components/admin/coupon/CouponEditModal'
import CouponDetailModal from '~/components/admin/coupon/CouponDetailModal'
import ConfirmDeleteModal from '~/components/admin/coupon/ConfirmDeleteModal'

// Format ngày giờ
const formatDateTime = dateString => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const time = date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    })
    const day = date.toLocaleDateString('vi-VN')
    return `${time} ${day}`
}

// Skeleton Row
const SkeletonRow = () => (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="col-span-3">
            <div className="h-4 bg-gray-200 rounded w-4/5"></div>
        </div>
        <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
        <div className="col-span-2">
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="col-span-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="col-span-1">
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="col-span-1 flex justify-center">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
    </div>
)

// Action Dropdown với nút Xem chi tiết
const ActionDropdown = ({ coupon, onView, onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handleClickOutside = e => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
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
                    <button
                        onClick={() => {
                            onView(coupon)
                            setIsOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-green-50 text-sm text-gray-700 flex items-center gap-3"
                    >
                        <FaEye className="text-green-500" /> Xem chi tiết
                    </button>
                    <button
                        onClick={() => {
                            onEdit(coupon)
                            setIsOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-blue-50 text-sm text-gray-700 flex items-center gap-3"
                    >
                        <FaEdit className="text-blue-500" /> Chỉnh sửa
                    </button>
                    <div className="h-px bg-gray-100 mx-3"></div>
                    <button
                        onClick={() => {
                            onDelete(coupon)
                            setIsOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3"
                    >
                        <FaTrashAlt className="text-red-500" /> Xóa mã giảm giá
                    </button>
                </div>
            )}
        </div>
    )
}

const AdminCouponManagement = () => {
    const [coupons, setCoupons] = useState([])
    const [filteredCoupons, setFilteredCoupons] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
    const [selectedCoupon, setSelectedCoupon] = useState(null)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [deletingId, setDeletingId] = useState(null)

    // Alert
    const [alert, setAlert] = useState({
        show: false,
        message: '',
        type: 'success',
    })
    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type })
        setTimeout(
            () => setAlert({ show: false, message: '', type: 'success' }),
            3000
        )
    }

    // Modal xóa
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [couponToDelete, setCouponToDelete] = useState(null)

    const itemsPerPage = 10

    useEffect(() => {
        const fetchCoupons = async () => {
            setIsLoading(true)
            try {
                const res = await getListCoupon()
                const list = res.data || res || []
                setCoupons(list)
                setFilteredCoupons(list)
            } catch (err) {
                setError('Không thể tải danh sách mã giảm giá')
            } finally {
                setIsLoading(false)
            }
        }
        fetchCoupons()
    }, [refreshTrigger])

    useEffect(() => {
        let result = coupons
        if (searchTerm) {
            result = result.filter(
                c =>
                    c.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.description
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase())
            )
        }
        setFilteredCoupons(result)
        setCurrentPage(1)
    }, [searchTerm, coupons])

    const handleView = coupon => {
        setSelectedCoupon(coupon)
        setIsDetailModalOpen(true)
    }

    const handleEdit = coupon => {
        setSelectedCoupon(coupon)
        setIsEditModalOpen(true)
    }

    const handleDeleteClick = coupon => {
        setCouponToDelete(coupon)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!couponToDelete) return
        setDeletingId(couponToDelete.id)
        try {
            await deleteCoupon({ couponId: couponToDelete.id })
            showAlert('Xóa mã giảm giá thành công!', 'success')
            setRefreshTrigger(prev => prev + 1)
        } catch (err) {
            showAlert(
                err.response?.data?.message || 'Không thể xóa mã giảm giá',
                'error'
            )
        } finally {
            setDeletingId(null)
            setIsDeleteModalOpen(false)
            setCouponToDelete(null)
        }
    }

    const handleSuccess = (message, type = 'success') => {
        showAlert(message, type)
        setRefreshTrigger(prev => prev + 1)
    }

    const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage)
    const currentItems = filteredCoupons.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const pages = () => {
        if (totalPages <= 5)
            return Array.from({ length: totalPages }, (_, i) => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
        if (currentPage >= totalPages - 2)
            return [
                1,
                '...',
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages,
            ]
        return [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages,
        ]
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý Mã giảm giá
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Tạo và quản lý các mã giảm giá cho khách hàng
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2.5 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-medium shadow-md hover:shadow-lg"
                >
                    <FaPlus className="text-lg" />
                    Tạo mã giảm giá mới
                </button>
            </div>

            {/* Alert */}
            {alert.show && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    duration={3000}
                    onClose={() => setAlert({ show: false })}
                />
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>
                        <FaTimes />
                    </button>
                </div>
            )}

            {/* Tìm kiếm */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <FaSearch className="text-indigo-500" /> Tìm kiếm mã giảm
                    giá
                </div>
                <div className="relative max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm theo mã hoặc mô tả..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <FaTimes />
                        </button>
                    )}
                </div>
            </div>

            {/* Bảng */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-2 text-center">Mã giảm giá</div>
                    <div className="col-span-3 text-center">Mô tả</div>
                    <div className="col-span-2 text-center">Giá trị giảm</div>
                    <div className="col-span-2 text-center">Hiệu lực</div>
                    <div className="col-span-1 text-center">Sử dụng</div>
                    <div className="col-span-1 text-center">Trạng thái</div>
                    <div className="col-span-1 text-center">Thao tác</div>
                </div>

                <div className="divide-y divide-gray-200">
                    {isLoading ? (
                        [...Array(8)].map((_, i) => <SkeletonRow key={i} />)
                    ) : currentItems.length > 0 ? (
                        currentItems.map(coupon => (
                            <div
                                key={coupon.id}
                                className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
                            >
                                {/* Mã giảm giá */}
                                <div className="col-span-2 flex justify-center">
                                    <span className="text-sm font-bold text-gray-900">
                                        {coupon.code}
                                    </span>
                                </div>

                                {/* Mô tả - chữ đen */}
                                <div className="col-span-3 text-sm text-gray-900 px-2">
                                    {coupon.description ? (
                                        coupon.description.length > 60 ? (
                                            coupon.description.slice(0, 60) +
                                            '...'
                                        ) : (
                                            coupon.description
                                        )
                                    ) : (
                                        <span className="text-gray-500 italic">
                                            Không có mô tả
                                        </span>
                                    )}
                                </div>

                                {/* Giá trị giảm - chữ đen, icon nhẹ */}
                                <div className="col-span-2 text-center text-sm font-medium text-gray-900">
                                    {coupon.value <= 100 ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>{coupon.value}%</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2">
                                            <span>
                                                {Number(
                                                    coupon.value
                                                ).toLocaleString('vi-VN')}
                                                đ
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Hiệu lực - chữ đen */}
                                <div className="col-span-2 text-center text-sm text-gray-900">
                                    <div className="flex items-center justify-center gap-1.5">
                                        <FaCalendarAlt className="text-gray-500 text-xs" />
                                        <span>
                                            {new Date(
                                                coupon.start_date
                                            ).toLocaleDateString('vi-VN')}
                                        </span>
                                    </div>
                                    <div className="text-gray-700">
                                        →{' '}
                                        {new Date(
                                            coupon.end_date
                                        ).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>

                                {/* Sử dụng - chữ đen */}
                                <div className="col-span-1 text-center text-sm text-gray-900 font-medium">
                                    {coupon.used_count || 0} / {coupon.quantity}
                                </div>

                                {/* Trạng thái - badge xanh nhạt như ảnh */}
                                <div className="col-span-1 flex justify-center">
                                    {coupon.status === 1 ? (
                                        <span className="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                            Hoạt động
                                        </span>
                                    ) : (
                                        <span className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                            Tắt
                                        </span>
                                    )}
                                </div>

                                {/* Thao tác */}
                                <div className="col-span-1 flex justify-center">
                                    {deletingId === coupon.id ? (
                                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <ActionDropdown
                                            coupon={coupon}
                                            onView={handleView}
                                            onEdit={handleEdit}
                                            onDelete={handleDeleteClick}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <FaTicketAlt className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-gray-900 font-medium">
                                Không tìm thấy mã giảm giá nào
                            </h3>
                            <p className="text-gray-500 text-sm mt-1">
                                Thử thay đổi từ khóa tìm kiếm
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination giữ nguyên */}
                {filteredCoupons.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center gap-2 py-4">
                        {pages().map((p, i) =>
                            p === '...' ? (
                                <span key={i} className="px-3 py-2">
                                    …
                                </span>
                            ) : (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(p)}
                                    className={`px-4 py-2 rounded-lg border transition-colors ${
                                        currentPage === p
                                            ? 'bg-indigo-600 text-white'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>

            {/* Các Modal đã được tách riêng */}
            <CouponCreateModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleSuccess}
            />

            <CouponEditModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false)
                    setSelectedCoupon(null)
                }}
                coupon={selectedCoupon}
                onSuccess={handleSuccess}
            />

            <CouponDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => {
                    setIsDetailModalOpen(false)
                    setSelectedCoupon(null)
                }}
                coupon={selectedCoupon}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setCouponToDelete(null)
                }}
                onConfirm={handleConfirmDelete}
                couponCode={couponToDelete?.code || ''}
            />
        </div>
    )
}

export default AdminCouponManagement
