import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const promoData = [
    { name: 'Mã giảm giá trực tiếp', count: 8, color: '#4f46e5' },
    { name: 'Mã BOGO (Mua 1 tặng 1)', count: 6, color: '#10b981' },
    { name: 'Mã miễn phí vận chuyển', count: 6, color: '#06b6d4' },
    { name: 'Mã quà tặng kèm', count: 5, color: '#6366f1' },
]

const totalUsage = promoData.reduce((sum, item) => sum + item.count, 0)

const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="font-bold text-sm"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

const PromoCodeDistribution = () => {
    return (
        <div className="bg-white p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Tỉ lệ sử dụng mã khuyến mãi
            </h2>
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Tooltip
                            formatter={(value, name) => [`${value} lượt`, name]}
                            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                        />
                        <Pie
                            data={promoData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="count"
                        >
                            {promoData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    stroke={entry.color}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
                {promoData.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center text-sm"
                    >
                        <div className="flex items-center">
                            <span
                                className="h-3 w-3 rounded-full mr-3"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="text-gray-600">{item.name}</span>
                        </div>
                        <div className="font-semibold text-gray-800">
                            <span className="text-gray-500 mr-4">
                                {((item.count / totalUsage) * 100).toFixed(1)}%
                            </span>
                            <span>{item.count}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PromoCodeDistribution
