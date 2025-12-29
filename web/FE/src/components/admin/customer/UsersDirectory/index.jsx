import React, { useState, useEffect, useRef } from 'react'
import {
    FiMoreVertical,
    FiChevronDown,
    FiSearch,
    FiFilter,
    FiMail,
    FiSmartphone,
    FiMapPin,
    FiTrash2,
    FiEye,
} from 'react-icons/fi'

import { getListUser, deleteUser } from '~/services/admin/userAdminService'
import UserProfileModal from '../UserProfileModal'
import Alert from '~/components/shared/Alert'

// Skeleton Loading Row (giữ nguyên)
const SkeletonRow = () => (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="col-span-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
        </div>
        <div className="col-span-3 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="col-span-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="col-span-2 flex justify-center">
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
        <div className="col-span-2 flex justify-center">
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
    </div>
)

// Status Badge (giữ nguyên)
const UserStatus = ({ status }) => {
    const config =
        status === 1
            ? {
                  label: 'Hoạt động',
                  bg: 'bg-emerald-50',
                  text: 'text-emerald-700',
                  border: 'border-emerald-100',
                  dot: 'bg-emerald-500',
              }
            : {
                  label: 'Ngừng hoạt động',
                  bg: 'bg-slate-100',
                  text: 'text-slate-600',
                  border: 'border-slate-200',
                  dot: 'bg-slate-400',
              }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${config.dot}`}></span>
            {config.label}
        </span>
    )
}

// Dropdown Status (giữ nguyên)
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
        { key: 1, label: 'Hoạt động' },
        { key: 0, label: 'Ngừng hoạt động' },
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

// Actions Dropdown (thêm onDelete)
const ActionsDropdown = ({ onViewDetail, onDelete }) => {
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
                            onDelete()
                            setOpen(false)
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-red-50 text-sm text-red-600 flex items-center gap-3 transition-colors"
                    >
                        <FiTrash2 /> Xóa người dùng
                    </button>
                </div>
            )}
        </div>
    )
}

// Modal xác nhận xóa (tương tự ProductTable)
const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, userName }) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Xác nhận xóa người dùng
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                    Bạn có chắc chắn muốn xóa người dùng 
                    <span className="font-medium text-red-600"> "{userName}"</span>?
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

const UsersTable = () => {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)

    // Filters
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    // Pagination
    const [limit, setLimit] = useState(100)
    const [offset, setOffset] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const displayPerPage = 10

    // Modal chi tiết
    const [selectedUserId, setSelectedUserId] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Modal xóa
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState(null)
    const [deletingId, setDeletingId] = useState(null) // Loading khi xóa

    // Alert state
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' })

    const showAlert = (message, type = 'success') => {
        setAlert({ show: true, message, type })
        setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 2500)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setTimeout(() => setSelectedUserId(null), 200)
    }

    // Fetch Data
    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true)
            try {
                const res = await getListUser({ limit, offset })
                setUsers(res.data || [])
            } catch (error) {
                console.error('Lỗi tải danh sách người dùng:', error)
                showAlert('Không thể tải danh sách người dùng.', 'error')
            } finally {
                setTimeout(() => setIsLoading(false), 300)
            }
        }
        fetchUsers()
    }, [limit, offset, refreshKey])

    const handleDeleteClick = user => {
        setUserToDelete(user)
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        if (!userToDelete) return

        setDeletingId(userToDelete.id)
        try {
            await deleteUser({ userId: userToDelete.id })
            showAlert('Xóa người dùng thành công!', 'success')
            setRefreshKey(prev => prev + 1)
        } catch (error) {
            console.error('Lỗi xóa người dùng:', error)
            showAlert('Không thể xóa người dùng. Vui lòng thử lại.', 'error')
        } finally {
            setDeletingId(null)
            setIsDeleteModalOpen(false)
            setUserToDelete(null)
        }
    }

    // Filter Logic
    const filtered = users.filter(u => {
        const normalize = str =>
            str
                ?.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
        const searchLower = normalize(search)
        const matchSearch =
            normalize(u.full_name)?.includes(searchLower) ||
            normalize(u.email)?.includes(searchLower)
        const matchStatus =
            statusFilter !== '' ? u.status === Number(statusFilter) : true
        const createdDate = u.created_at?.split('T')[0]
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
        if (totalPages <= 5)
            return [...Array(totalPages).keys()].map(i => i + 1)
        if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages]
        if (currentPage >= totalPages - 2)
            return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
    }

    return (
        <div className="space-y-6 fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Quản lý Người dùng
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Xem và quản lý danh sách khách hàng
                    </p>
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

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-4 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc email..."
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

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pb-4">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-2">Họ và tên</div>
                    <div className="col-span-3">Liên hệ</div>
                    <div className="col-span-2">Địa chỉ</div>
                    <div className="col-span-2 text-center">Trạng thái</div>
                    <div className="col-span-2 text-center">Ngày tham gia</div>
                    <div className="col-span-1 text-center">Thao tác</div>
                </div>

                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        [...Array(displayPerPage)].map((_, i) => (
                            <SkeletonRow key={i} />
                        ))
                    ) : currentUsers.length > 0 ? (
                        currentUsers.map(u => (
                            <div
                                key={u.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/80 transition-colors group"
                            >
                                <div className="col-span-2 flex items-center gap-3 overflow-hidden">
                                    <img
                                        src={
                                            u.avatar_url ||
                                            `https://ui-avatars.com/api/?name=${u.full_name}&background=random`
                                        }
                                        alt=""
                                        className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0"
                                    />
                                    <div className="truncate">
                                        <div
                                            className="font-medium text-gray-900 text-sm truncate"
                                            title={u.full_name}
                                        >
                                            {u.full_name}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-3 flex flex-col justify-center gap-1 overflow-hidden">
                                    <div
                                        className="flex items-center gap-2 text-sm text-gray-600 truncate"
                                        title={u.email}
                                    >
                                        <FiMail className="text-gray-400 flex-shrink-0" />{' '}
                                        {u.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <FiSmartphone className="text-gray-400 flex-shrink-0" />{' '}
                                        {u.phone || '---'}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <div className="flex items-start gap-2">
                                        <FiMapPin
                                            className="text-gray-400 mt-0.5 flex-shrink-0"
                                            size={12}
                                        />
                                        <span
                                            className="text-sm text-gray-600 line-clamp-2"
                                            title={`${u.address}, ${u.city}`}
                                        >
                                            {u.address ? (
                                                `${u.address}, ${u.city}`
                                            ) : (
                                                <span className="italic text-gray-400">
                                                    Chưa cập nhật
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-2 text-center">
                                    <UserStatus status={u.status} />
                                </div>
                                <div className="col-span-2 text-center justify-between pl-4">
                                    <div className="text-xs text-gray-500 flex flex-col text-center">
                                        <span className="font-medium text-gray-700">
                                            {u.created_at
                                                ? new Date(u.created_at).toLocaleDateString('vi-VN')
                                                : ''}
                                        </span>
                                        <span className="text-[10px]">
                                            {u.created_at
                                                ? new Date(u.created_at).toLocaleTimeString('vi-VN', {
                                                      hour: '2-digit',
                                                      minute: '2-digit',
                                                  })
                                                : ''}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-1 flex items-center justify-center">
                                    {deletingId === u.id ? (
                                        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <ActionsDropdown
                                            onViewDetail={() => {
                                                setSelectedUserId(u.id)
                                                setIsModalOpen(true)
                                            }}
                                            onDelete={() => handleDeleteClick(u)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FiSearch className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-gray-900 font-medium">
                                Không tìm thấy kết quả
                            </h3>
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

            {/* Modals */}
            <UserProfileModal
                userId={selectedUserId}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />

            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setUserToDelete(null)
                }}
                onConfirm={handleConfirmDelete}
                userName={userToDelete?.full_name || ''}
            />
        </div>
    )
}

export default UsersTable