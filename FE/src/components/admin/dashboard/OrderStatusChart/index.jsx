import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const orderStatusData = [
    { name: 'Hoàn tất', value: 700 },
    { name: 'Đang xử lý', value: 150 },
    { name: 'Chờ xử lý', value: 100 },
    { name: 'Đã huỷ', value: 25 },
]

const COLORS = ['#34D399', '#818CF8', '#FBBF24', '#F87171']

const CustomLegend = () => (
    <div className="flex justify-center items-center flex-wrap gap-x-6 gap-y-2 mt-4">
        {orderStatusData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.name}
                </span>
            </div>
        ))}
    </div>
)

const OrderStatusChart = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:border dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Tỷ lệ đơn hàng theo trạng thái
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={orderStatusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            fill="#8884d8"
                            paddingAngle={1}
                            dataKey="value"
                            labelLine={false}
                            label={false}
                        >
                            {orderStatusData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <CustomLegend />
        </div>
    )
}

export default OrderStatusChart
