import React from 'react'
import StatusPill from '../StatusPill'

const recentOrdersData = [
    {
        customer: 'John Doe',
        amount: 480.66,
        status: 'Shipped',
        date: '8/10/2025',
    },
    {
        customer: 'Sarah Wilson',
        amount: 155.07,
        status: 'Cancelled',
        date: '6/10/2025',
    },
    {
        customer: 'John Doe',
        amount: 482.53,
        status: 'Shipped',
        date: '8/10/2025',
    },
    {
        customer: 'Bob Brown',
        amount: 470.51,
        status: 'Shipped',
        date: '7/10/2025',
    },
    {
        customer: 'Bob Brown',
        amount: 109.88,
        status: 'Pending',
        date: '8/10/2025',
    },
]

const RecentOrdersTable = () => {
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
                        {recentOrdersData.map((order, index) => (
                            <tr
                                key={index}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    {order.customer}
                                </td>
                                <td className="p-3 text-sm text-gray-700 dark:text-gray-300">
                                    ${order.amount.toFixed(2)}
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
