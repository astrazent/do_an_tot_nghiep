import React, { useEffect, useState } from 'react'
import StatusPill from '../StatusPill'
import dayjs from 'dayjs'
import { getListTransaction } from '~/services/admin/adminOrderService'

const RecentOrdersTable = () => {
    const [orders, setOrders] = useState([])

    const fetchOrders = async () => {
        try {
            // Lấy 5 đơn hàng gần nhất
            const res = await getListTransaction({ limit: 5, offset: 0 })

            // Format dữ liệu cho bảng
            const formatted = res.data.map(item => ({
                customer: item.deli_name,
                amount: Number(item.amount),
                status: item.status, // dùng trực tiếp cho StatusPill
                date: dayjs(item.created_at).format('DD/MM/YYYY'),
            }))

            setOrders(formatted)
        } catch (err) {
            console.error('Lỗi lấy transaction:', err)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:border dark:border-gray-700 h-full">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Các đơn hàng gần đây
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-700/50">
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-500 uppercase">
                                Khách hàng
                            </th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-500 uppercase">
                                Tổng tiền
                            </th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-500 uppercase">
                                Trạng thái
                            </th>
                            <th className="p-3 text-sm font-semibold tracking-wide text-left text-gray-500 uppercase">
                                Ngày đặt
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {orders.map((order, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    {order.customer}
                                </td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                    {new Intl.NumberFormat('vi-VN').format(order.amount)} đ
                                </td>
                                <td className="p-3 text-sm">
                                    <StatusPill status={order.status} />
                                </td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                    {order.date}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default RecentOrdersTable
