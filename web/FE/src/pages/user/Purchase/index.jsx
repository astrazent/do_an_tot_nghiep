import React, { useState } from 'react'
import {
    FiCheckCircle,
    FiClock,
    FiTruck,
    FiList,
    FiX,
    FiShoppingBag,
} from 'react-icons/fi'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import ConfirmModal from '~/components/shared/ConfirmModal'

import { deleteTransactionByUserAndTrackingNumber } from '~/services/user/transactionService'

import OrderDetailModal from '~/components/user/purchase/OrderDetailModal'
import ActionDropdown from '~/components/user/purchase/ActionDropdown'
import { formatCurrency } from '~/utils/formatCurrency'
import { useAlert } from '~/contexts/AlertContext'
import { useCurrentUser } from '~/hooks/user/useUser'
import { useTransactionsByUser } from '~/hooks/user/useTransaction'

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'Hoàn thành':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    <FiCheckCircle className="mr-1" size={14} /> {status}
                </span>
            )
        case 'Chờ xác nhận':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                    <FiClock className="mr-1" size={14} /> {status}
                </span>
            )
        case 'Đang vận chuyển':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-100 text-sky-800">
                    <FiTruck className="mr-1" size={14} /> {status}
                </span>
            )
        case 'Đã hủy':
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                    <FiX className="mr-1" size={14} /> {status}
                </span>
            )
        default:
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {status}
                </span>
            )
    }
}

const EmptyState = () => (
    <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <FiShoppingBag className="h-20 w-20 text-gray-300" />
            <h3 className="mt-3 text-lg font-semibold text-gray-700">
                Bạn chưa có đơn hàng nào
            </h3>
            <p className="mt-1.5 text-xs text-gray-500">
                Tất cả đơn hàng của bạn trong mục này sẽ được hiển thị ở đây.
            </p>
        </div>
    </div>
)

const transformApiData = apiData => {
    if (!apiData) return []
    const statusMapping = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đang vận chuyển',
        shipped: 'Đang vận chuyển',
        delivered: 'Hoàn thành',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy',
    }
    const createProductSummary = items => {
        if (!items || items.length === 0) return 'Không có sản phẩm'
        const maxItemsToShow = 2
        let summary = items
            .slice(0, maxItemsToShow)
            .map(item => `${item.name} x${item.qty_total}`)
            .join(', ')
        if (items.length > maxItemsToShow) {
            summary += `... (+${items.length - maxItemsToShow} sản phẩm khác)`
        }
        return summary
    }
    return apiData.map(order => ({
        ...order,
        id: order.id.toString(),
        productSummary: createProductSummary(order.items),
        total: formatCurrency(order.amount),
        status:
            statusMapping[order.shipment_status] ||
            statusMapping[order.status] ||
            'Không xác định',
        date: new Date(order.created_at).toLocaleDateString('vi-VN'),
        time: new Date(order.created_at).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        }),
    }))
}

const Purchase = () => {
    const [activeTab, setActiveTab] = useState('Tất cả')
    const [selectedOrder, setSelectedOrder] = useState(null)
    const { showAlert } = useAlert()
    const { user, loading: userLoading } = useCurrentUser()
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [orderToCancel, setOrderToCancel] = useState(null)

    const {
        data: transactions,
        isLoading: transactionsIsLoading,
        isError,
    } = useTransactionsByUser(user?.user_id)
    const isLoading = userLoading || transactionsIsLoading

    const { mutate: cancelOrderMutation, isLoading: isCancelling } =
        useMutation({
            mutationFn: ({ userId, trackingNumber }) =>
                deleteTransactionByUserAndTrackingNumber(
                    userId,
                    trackingNumber
                ),
            onSuccess: (data, variables) => {
                showAlert(
                    `Đơn hàng #${variables.trackingNumber} đã được huỷ thành công!`,
                    { type: 'success' }
                )
                if (user?.user_id) {
                    queryClient.invalidateQueries([
                        'transactions',
                        user.user_id,
                    ])
                }
            },
            onError: (error, variables) => {
                console.error('Lỗi khi huỷ đơn hàng:', error)
                showAlert(
                    `Đã xảy ra lỗi khi huỷ đơn hàng #${variables.trackingNumber}.`,
                    { type: 'error' }
                )
            },
        })

    const handleCancelOrder = order => {
        if (isCancelling) return
        if (!user?.user_id || !order.tracking_number) {
            showAlert('Không thể huỷ đơn hàng do thiếu thông tin.', {
                type: 'error',
            })
            return
        }

        setOrderToCancel(order)
        setIsModalOpen(true)
    }

    const handleConfirmDelete = () => {
        if (!orderToCancel || !user?.user_id) return

        cancelOrderMutation({
            userId: user.user_id,
            trackingNumber: orderToCancel.tracking_number,
        })

        setIsModalOpen(false)
        setOrderToCancel(null)
    }

    const tabs = ['Tất cả', 'Chờ xác nhận', 'Đang vận chuyển', 'Hoàn thành']
    const tabIcons = {
        'Tất cả': <FiList className="mr-1.5" />,
        'Chờ xác nhận': <FiClock className="mr-1.5" />,
        'Đang vận chuyển': <FiTruck className="mr-1.5" />,
        'Hoàn thành': <FiCheckCircle className="mr-1.5" />,
    }

    const transformedOrders = transformApiData(transactions || [])

    const filteredOrders = transformedOrders.filter(order => {
        if (activeTab === 'Tất cả') return true
        return order.status === activeTab
    })

    const getCount = status => {
        if (status === 'Tất cả') return transformedOrders.length
        return transformedOrders.filter(order => order.status === status).length
    }

    const handleViewDetails = order => {
        setSelectedOrder(order)
    }

    return (
        <div className="min-h-[70vh] p-4 font-sans">
            <h1 className="text-3xl font-bold text-gray-800">
                Quản lý Đơn hàng
            </h1>

            {}
            <div className="flex items-center space-x-1 mt-2 mb-4">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center px-3 py-1.5 text-xs font-semibold transition-colors duration-200 ${
                            activeTab === tab
                                ? 'text-emerald-600 border-b-2 border-emerald-600'
                                : 'text-gray-500 hover:text-emerald-600'
                        }`}
                    >
                        {tabIcons[tab]}
                        {tab}
                        {getCount(tab) > 0 && (
                            <span
                                className={`ml-1.5 text-[10px] font-bold rounded-full px-1.5 py-0.5 ${
                                    activeTab === tab
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-gray-200 text-gray-700'
                                }`}
                            >
                                {getCount(tab)}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {}
            <div className="bg-white shadow-sm rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                STT
                            </th>
                            <th className="px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Mã theo dõi
                            </th>
                            <th className="px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Sản phẩm
                            </th>
                            <th className="px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Tổng tiền
                            </th>
                            <th className="px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Trạng thái
                            </th>
                            <th className="px-4 py-2 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Ngày đặt
                            </th>
                            <th className="px-4 py-2 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                Hành động
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="text-center py-16">
                                    <div className="flex justify-center items-center">
                                        <FiClock className="animate-spin h-8 w-8 text-gray-500" />
                                        <span className="ml-3 text-gray-600">
                                            Đang tải đơn hàng...
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-16 text-red-600"
                                >
                                    Đã xảy ra lỗi khi tải đơn hàng.
                                </td>
                            </tr>
                        ) : filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                                    onClick={() => handleViewDetails(order)}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-xs font-medium text-gray-800">
                                        #{order.tracking_number}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-gray-700 max-w-[200px] break-words whitespace-normal">
                                            {order.productSummary}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-xs text-gray-900 font-semibold">
                                            {order.total}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500">
                                        <div>{order.date}</div>
                                        <div className="text-[11px]">
                                            {order.time}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-xs font-medium">
                                        <ActionDropdown
                                            order={order}
                                            onViewDetails={handleViewDetails}
                                            onCancel={handleCancelOrder}
                                            isCancelling={isCancelling}
                                            buttonClassName="!text-xs !font-bold"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">
                                    <div className="flex justify-center items-center py-16">
                                        <EmptyState />
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {}
            <OrderDetailModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
            />

            <ConfirmModal
                isOpen={isModalOpen}
                message={`Bạn có chắc chắn muốn huỷ đơn hàng #${orderToCancel?.tracking_number} không?`}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setIsModalOpen(false)
                    setOrderToCancel(null)
                }}
            />
        </div>
    )
}

export default Purchase
