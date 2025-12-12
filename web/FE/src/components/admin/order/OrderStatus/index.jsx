import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { getDetailStatusOfTransaction } from '../../../../services/admin/adminOrderService'

const RADIAN = Math.PI / 180

// Label giữa mỗi phần của PieChart
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    if (percent === 0) return null // Ẩn label 0%

    // Căn label giữa slice
    const radius = innerRadius + (outerRadius - innerRadius) * 0.55
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="#ffffff"
            fontSize={13}
            fontWeight="600"
            textAnchor="middle"
            dominantBaseline="central"
        >
            {(percent * 100).toFixed(1) + '%'}
        </text>
    )
}

const OrderStatus = () => {
    const [chartData, setChartData] = useState([])
    const [legendData, setLegendData] = useState([])

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const res = await getDetailStatusOfTransaction()
            const data = res.data

            // Dữ liệu cho biểu đồ (lọc giá trị = 0)
            const pie = [
                {
                    name: 'Chờ xử lý',
                    value: data.pending.count,
                    color: '#f0ad4e',
                },
                {
                    name: 'Đã xác nhận',
                    value: data.confirmed.count,
                    color: '#5cb85c',
                },
                {
                    name: 'Đã hủy',
                    value: data.canceled.count,
                    color: '#d9534f',
                },
                {
                    name: 'Đã hoàn tiền',
                    value: data.refunded.count,
                    color: '#5bc0de',
                },
                {
                    name: 'Hoàn thành',
                    value: data.completed.count,
                    color: '#0275d8',
                },
            ].filter(item => item.value > 0)

            // Legend giữ nguyên đầy đủ
            const legend = [
                {
                    name: 'Chờ xử lý',
                    percentage: data.pending.percent,
                    value: data.pending.count,
                },
                {
                    name: 'Đã xác nhận',
                    percentage: data.confirmed.percent,
                    value: data.confirmed.count,
                },
                {
                    name: 'Đã hủy',
                    percentage: data.canceled.percent,
                    value: data.canceled.count,
                },
                {
                    name: 'Đã hoàn tiền',
                    percentage: data.refunded.percent,
                    value: data.refunded.count,
                },
                {
                    name: 'Hoàn thành',
                    percentage: data.completed.percent,
                    value: data.completed.count,
                },
            ]

            setChartData(pie)
            setLegendData(legend)
        } catch (error) {
            console.error('Lỗi lấy dữ liệu trạng thái đơn hàng:', error)
        }
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md font-sans w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Trạng thái đơn hàng
            </h2>

            {/* Biểu đồ donut */}
            <div style={{ width: '100%', height: 220 }} className="mb-6">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={35} // tăng độ dày vòng trong
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                            startAngle={90}
                            endAngle={450}
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="space-y-3">
                {legendData.map(item => (
                    <div
                        key={item.name}
                        className="flex justify-between items-center text-gray-600"
                    >
                        <span>{item.name}</span>
                        <span className="font-medium text-gray-800">
                            <span className="text-gray-500">
                                {item.percentage}%
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
