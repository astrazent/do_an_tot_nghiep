import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from 'recharts'

const shippingRevenueData = [
    { name: 'Giao hàng Nhanh', revenue: 45500000, color: '#2DD4BF' },
    { name: 'Giao hàng Tiết kiệm', revenue: 32800000, color: '#60A5FA' },
    { name: 'Hỏa tốc', revenue: 28200000, color: '#FBBF24' },
    { name: 'Nhận tại cửa hàng', revenue: 15100000, color: '#F472B6' },
    { name: 'Đối tác khác', revenue: 8900000, color: '#A78BFA' },
]
import { formatCurrency } from '~/utils/formatCurrency'

const formatYAxis = value => `${value / 1000000}tr`

const CustomLegend = () => {
    return (
        <div className="flex flex-col space-y-2 ml-4">
            {shippingRevenueData.map(item => (
                <div key={item.name} className="flex items-center space-x-2">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                    ></span>
                    <span className="text-gray-700 text-sm">{item.name}</span>
                </div>
            ))}
        </div>
    )
}

const ShippingRevenueChart = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Doanh thu theo Phương thức Giao hàng
            </h3>
            <div className="flex">
                <div className="flex-1 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={shippingRevenueData}
                            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                strokeOpacity={0.3}
                            />
                            <XAxis
                                dataKey="name"
                                tick={false}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                tickFormatter={formatYAxis}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                                contentStyle={{
                                    background: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '0.5rem',
                                }}
                                formatter={value =>
                                    `${formatCurrency(value)} ₫`
                                }
                            />
                            <Bar
                                dataKey="revenue"
                                radius={[8, 8, 0, 0]}
                                isAnimationActive={false}
                                fill="#000"
                                shape={props => {
                                    const { x, y, width, height, index } = props
                                    const fillColor =
                                        shippingRevenueData[index].color
                                    return (
                                        <rect
                                            x={x}
                                            y={y}
                                            width={width}
                                            height={height}
                                            fill={fillColor}
                                            rx={8}
                                        />
                                    )
                                }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <CustomLegend />
            </div>
        </div>
    )
}

export default ShippingRevenueChart
