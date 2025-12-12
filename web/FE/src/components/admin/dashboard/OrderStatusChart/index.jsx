import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { getOrderCountByStatus } from '~/services/admin/dashboardAdminService'

const COLORS = ['#FBBF24', '#818CF8', '#F87171', '#A78BFA', '#34D399']

const STATUS_LABELS = {
    pending: 'Chờ xử lý',
    confirmed: 'Đã xác nhận',
    canceled: 'Đã huỷ',
    refunded: 'Hoàn tiền',
    completed: 'Hoàn tất',
}

const OrderStatusChart = ({ dateRange }) => {
    const [chartData, setChartData] = useState([])

    const fetchData = async () => {
        const res = await getOrderCountByStatus(dateRange)

        const formatted = res.data.map(item => ({
            name: STATUS_LABELS[item.status_code] || item.status_code,
            value: item.total_orders,
        }))

        setChartData(formatted)
    }

    useEffect(() => {
        fetchData()
    }, [dateRange])

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:border dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Tỷ lệ đơn hàng theo trạng thái
            </h3>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={100}
                            dataKey="value"
                            paddingAngle={1}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* LEGEND */}
            <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mt-4">
                {chartData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {entry.name} ({entry.value})
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrderStatusChart
