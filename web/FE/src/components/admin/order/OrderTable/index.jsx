import React, { useState, useEffect, useRef } from 'react'
import {
    FiClock,
    FiCheckCircle,
    FiXCircle,
    FiMoreVertical,
    FiPackage,
    FiChevronRight,
    FiChevronDown,
    FiSearch,
    FiFilter,
    FiShoppingCart,
    FiX
} from 'react-icons/fi'

import OrderDetailPopup from '../OrderDetailPopup'
import {
    getListTransaction,
    updateTransaction,
    getDetailTransaction,
} from '../../../../services/admin/adminOrderService'

import { formatCurrency } from '~/utils/formatCurrency'

/* ================================================================
    SKELETON LOADING
================================================================= */
const SkeletonRow = () => (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 animate-pulse">
        <div className="col-span-2"><div className="h-4 bg-gray-200 rounded w-full"></div></div>
        <div className="col-span-2"><div className="h-4 bg-gray-200 rounded w-3/4"></div></div>
        <div className="col-span-2"><div className="h-4 bg-gray-200 rounded w-2/3"></div></div>
        <div className="col-span-2"><div className="h-4 bg-gray-200 rounded w-full"></div></div>
        <div className="col-span-2"><div className="h-6 bg-gray-200 rounded-full w-20"></div></div>
        <div className="col-span-1"><div className="h-4 bg-gray-200 rounded w-full"></div></div>
        <div className="col-span-1 flex justify-center"><div className="h-8 w-8 bg-gray-200 rounded"></div></div>
    </div>
)

/* ================================================================
    DROPDOWN TRẠNG THÁI (CUSTOM SELECT)
================================================================= */
const DropdownStatus = ({ value, onChange }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef()

    const statuses = [
        { key: '', label: 'Tất cả trạng thái' },
        { key: 'pending', label: 'Chờ xử lý' },
        { key: 'confirmed', label: 'Đã xác nhận' },
        { key: 'completed', label: 'Hoàn thành' },
        { key: 'refunded', label: 'Đã hoàn tiền' },
        { key: 'canceled', label: 'Đã hủy' },
    ]

    useEffect(() => {
        const handler = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const label = statuses.find(s => s.key === value)?.label || 'Tất cả trạng thái'

    return (
        <div className="relative w-full" ref={ref}>
            <div
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm cursor-pointer hover:border-indigo-400 transition-colors text-sm text-gray-700"
            >
                <span className="truncate">{label}</span>
                <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </div>

            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl overflow-hidden">
                    {statuses.map(item => (
                        <div
                            key={item.key}
                            onClick={() => {
                                onChange(item.key)
                                setOpen(false)
                            }}
                            className={`px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                                value === item.key 
                                    ? 'bg-indigo-50 text-indigo-600 font-medium' 
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ================================================================
    STATUS BADGE
================================================================= */
const OrderStatus = ({ status }) => {
    const getStyle = () => {
        switch (status) {
            case 'completed':
                return {
                    icon: <FiCheckCircle />,
                    classes: 'bg-emerald-50 text-emerald-700',
                    dot: 'bg-emerald-500',
                    label: 'Hoàn thành'
                }
            case 'pending':
                return {
                    icon: <FiPackage />,
                    classes: 'bg-blue-50 text-blue-700',
                    dot: 'bg-blue-500',
                    label: 'Chờ xử lý'
                }
            case 'confirmed':
                return {
                    icon: <FiClock />,
                    classes: 'bg-indigo-50 text-indigo-700',
                    dot: 'bg-indigo-500',
                    label: 'Đã xác nhận'
                }
            case 'refunded':
                return {
                    icon: <FiClock />,
                    classes: 'bg-purple-50 text-purple-700',
                    dot: 'bg-purple-500',
                    label: 'Đã hoàn tiền'
                }
            case 'canceled':
                return {
                    icon: <FiXCircle />,
                    classes: 'bg-red-50 text-red-700',
                    dot: 'bg-red-500',
                    label: 'Đã hủy'
                }
            default:
                return {
                    icon: <FiClock />,
                    classes: 'bg-gray-100 text-gray-600',
                    dot: 'bg-gray-400',
                    label: status
                }
        }
    }

    const { icon, classes, dot, label } = getStyle()

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dot}`}></span>
            {label}
        </span>
    )
}

/* ================================================================
    ACTIONS DROPDOWN
================================================================= */
const ActionsDropdown = ({ order, onOpenDetails, onUpdateStatus }) => {
    const [open, setOpen] = useState(false)
    const [showStatus, setShowStatus] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = event => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false)
                setShowStatus(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const statuses = [
        { key: 'pending', label: 'Chờ xử lý' },
        { key: 'confirmed', label: 'Đã xác nhận' },
        { key: 'completed', label: 'Hoàn thành' },
        { key: 'refunded', label: 'Đã hoàn tiền' },
        { key: 'canceled', label: 'Đã hủy' },
    ]

    const handleAction = action => {
        action()
        setOpen(false)
        setShowStatus(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => {
                    setOpen(!open)
                    setShowStatus(false)
                }}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-indigo-600 transition-colors"
            >
                <FiMoreVertical className="w-4 h-4" />
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden">
                    <button
                        onClick={() => handleAction(onOpenDetails)}
                        className="w-full px-4 py-3 text-left hover:bg-indigo-50 text-sm text-gray-700 flex items-center gap-3 transition-colors"
                    >
                        <FiPackage className="text-indigo-500"/> Xem chi tiết
                    </button>

                    <button
                        onClick={() => setShowStatus(!showStatus)}
                        className="w-full px-4 py-3 text-sm hover:bg-blue-50 text-gray-700 flex items-center justify-between transition-colors"
                    >
                        <span className="flex items-center gap-3">
                            <FiClock className="text-blue-500"/> Cập nhật trạng thái
                        </span>
                        <FiChevronRight className={`transition-transform ${showStatus ? 'rotate-90' : ''}`} />
                    </button>

                    {showStatus && (
                        <div className="bg-gray-50 border-t border-gray-100">
                            {statuses.map(s => (
                                <button
                                    key={s.key}
                                    onClick={() => handleAction(() => onUpdateStatus(s.key))}
                                    className="w-full px-6 py-2 text-left hover:bg-white text-sm text-gray-600 transition-colors"
                                >
                                    {s.label}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="h-px bg-gray-100"></div>
                    <button className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 text-sm flex items-center gap-3 transition-colors">
                        <FiXCircle className="text-red-500"/> Hủy đơn
                    </button>
                </div>
            )}
        </div>
    )
}

/* ================================================================
    MAIN TABLE
================================================================= */
const OrdersTable = () => {
    const [orders, setOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isPopupOpen, setIsPopupOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // FILTERS
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [dateFrom, setDateFrom] = useState('')
    const [dateTo, setDateTo] = useState('')

    // LIMIT
    const [limit, setLimit] = useState(100)
    const [offset, setOffset] = useState(0)

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    /* ---------------- GET DATA ---------------- */
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const res = await getListTransaction({ limit, offset })
                setOrders(res.data.map(t => ({ raw: t })))
            } catch (error) {
                console.error('Error fetching transactions:', error)
            } finally {
                setTimeout(() => setIsLoading(false), 300)
            }
        }
        fetchData()
    }, [limit, offset])

    /* ---------------- FILTER ---------------- */
    const filtered = orders.filter(o => {
        const t = o.raw
        const searchLower = search.toLowerCase()

        const matchSearch =
            t.tracking_number?.toLowerCase().includes(searchLower) ||
            t.deli_name?.toLowerCase().includes(searchLower)

        const matchStatus = statusFilter ? t.status === statusFilter : true

        const orderDate = t.created_at?.split('T')[0]
        const matchFrom = dateFrom ? orderDate >= dateFrom : true
        const matchTo = dateTo ? orderDate <= dateTo : true

        return matchSearch && matchStatus && matchFrom && matchTo
    })

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const currentOrders = filtered.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )

    const pages = () => {
        if (totalPages <= 5)
            return [...Array(totalPages).keys()].map(i => i + 1)
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

    /* ---------------- RESET FILTERS ---------------- */
    const handleResetFilters = () => {
        setSearch('')
        setStatusFilter('')
        setDateFrom('')
        setDateTo('')
        setCurrentPage(1)
    }

    /* ---------------- DETAIL ---------------- */
    const handleViewDetails = async order => {
        const res = await getDetailTransaction(order.raw.id)
        setSelectedOrder(res.data)
        setIsPopupOpen(true)
    }

    /* ---------------- UPDATE STATUS ---------------- */
    const handleUpdateOrderStatus = async (order, newStatus) => {
        const res = await updateTransaction(order.raw.id, { status: newStatus })
        const updated = res.data

        setOrders(prev =>
            prev.map(o => (o.raw.id === updated.id ? { raw: updated } : o))
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
                    <p className="text-sm text-gray-500 mt-1">Theo dõi và quản lý các đơn hàng của bạn</p>
                </div>
            </div>

            {/* Filter Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold text-sm uppercase tracking-wide">
                    <FiFilter className="text-indigo-500" /> Bộ lọc tìm kiếm
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3 relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tìm mã đơn, người nhận..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <DropdownStatus value={statusFilter} onChange={setStatusFilter} />
                    </div>

                    <div className="md:col-span-2">
                        <input
                            type="date"
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                            value={dateFrom}
                            onChange={e => setDateFrom(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <input
                            type="date"
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                            value={dateTo}
                            onChange={e => setDateTo(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <input
                            type="number"
                            min={1}
                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-600"
                            value={limit}
                            onChange={e => setLimit(Number(e.target.value))}
                            placeholder="Số bản ghi..."
                        />
                    </div>
                </div>
            </div>

            {/* Data Table Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden pb-4">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div className="col-span-2">Mã đơn hàng</div>
                    <div className="col-span-2">Người nhận</div>
                    <div className="col-span-2">Ngày đặt</div>
                    <div className="col-span-2">Tổng tiền</div>
                    <div className="col-span-2">Trạng thái</div>
                    <div className="col-span-1">Vận chuyển</div>
                    <div className="col-span-1 text-center">Thao tác</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        [...Array(itemsPerPage)].map((_, i) => <SkeletonRow key={i} />)
                    ) : currentOrders.length > 0 ? (
                        currentOrders.map(order => (
                            <div
                                key={order.raw.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/80 transition-colors group"
                            >
                                <div className="col-span-2">
                                    <div className="font-medium text-gray-900 text-sm">{order.raw.tracking_number}</div>
                                </div>
                                
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-700 font-medium">{order.raw.deli_name}</div>
                                </div>
                                
                                <div className="col-span-2">
                                    <div className="text-sm text-gray-700">{order.raw.created_at?.split('T')[0]}</div>
                                </div>
                                
                                <div className="col-span-2">
                                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(Number(order.raw.amount))}</div>
                                </div>
                                
                                <div className="col-span-2">
                                    <OrderStatus status={order.raw.status} />
                                </div>

                                <div className="col-span-1">
                                    <div className="text-sm text-gray-600">{order.raw.shipment_status}</div>
                                </div>

                                <div className="col-span-1 flex items-center justify-center">
                                    <ActionsDropdown
                                        order={order}
                                        onOpenDetails={() => handleViewDetails(order)}
                                        onUpdateStatus={newStatus =>
                                            handleUpdateOrderStatus(order, newStatus)
                                        }
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <FiShoppingCart className="text-gray-400 text-2xl" />
                            </div>
                            <h3 className="text-gray-900 font-medium">Không tìm thấy đơn hàng nào</h3>
                            <p className="text-gray-500 text-sm mt-1">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {filtered.length > 0 && (
                    <div className="flex justify-center gap-2 mt-6 mb-2">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(1)}
                            className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            «
                        </button>
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(p => p - 1)}
                            className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50 transition-colors"
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
                                        currentPage === p 
                                            ? "bg-indigo-500 text-white" 
                                            : "hover:bg-gray-50"
                                    }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(p => p + 1)}
                            className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            ›
                        </button>
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(totalPages)}
                            className="px-3 py-2 border rounded-lg disabled:text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            »
                        </button>
                    </div>
                )}
            </div>

            {/* POPUP DETAILS */}
            {isPopupOpen && selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsPopupOpen(false)} 
                    ></div>
                    <div className="relative z-10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl">
                        <OrderDetailPopup
                            order={selectedOrder}
                            onClose={() => setIsPopupOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}

export default OrdersTable
