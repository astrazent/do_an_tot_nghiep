import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Chờ xử lý', value: 4, color: '#f0ad4e' },
    { name: 'Đã giao', value: 5, color: '#0275d8' },
    { name: 'Đang vận chuyển', value: 4, color: '#5bc0de' },
    { name: 'Đang xử lý', value: 5, color: '#5cb85c' },
    { name: 'Đã hủy', value: 2, color: '#d9534f' },
]

const legendData = [
    { name: 'Chờ xử lý', percentage: '20%', value: 4 },
    { name: 'Đang xử lý', percentage: '25%', value: 5 },
    { name: 'Đang vận chuyển', percentage: '20%', value: 4 },
    { name: 'Đã giao', percentage: '25%', value: 5 },
    { name: 'Đã hủy', percentage: '10%', value: 2 },
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.6
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="font-semibold text-sm"
        >
            {`${(percent * 100).toFixed(1)}%`}
        </text>
    )
}

const OrderStatus = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md font-sans w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trạng thái đơn hàng
            </h2>

            <div style={{ width: '100%', height: 200 }} className="mb-6">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            startAngle={90}
                            endAngle={450}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="space-y-3">
                {legendData.map(item => (
                    <div
                        key={item.name}
                        className="flex justify-between items-center text-gray-600"
                    >
                        <span>{item.name}</span>
                        <span className="font-medium text-gray-800">
                            <span className="text-gray-500">
                                {item.percentage}
                            </span>
                            <span className="ml-4">{item.value}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default OrderStatus
