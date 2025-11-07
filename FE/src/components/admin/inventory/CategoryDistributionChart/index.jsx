import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const CategoryDistributionRechart = ({ data }) => {
    const COLORS = [
        '#3B82F6',
        '#8B5CF6',
        '#EC4899',
        '#F59E0B',
        '#10B981',
        '#6366F1',
        '#D946EF',
        '#F97316',
        '#06B6D4',
    ]

    const totalValue = (data ?? []).reduce((acc, item) => acc + item.value, 0)

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
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Phân bố sản phẩm theo danh mục
            </h2>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            innerRadius={70}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {(data ?? []).map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={(value, name) => [
                                `${value} mục`,
                                'Số lượng',
                            ]}
                            labelFormatter={() => 'Chi tiết danh mục'}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4">
                <ul>
                    {(data ?? []).map((item, index) => (
                        <li
                            key={item.name}
                            className="flex justify-between items-center py-2 border-b last:border-0 border-gray-200"
                        >
                            <div className="flex items-center">
                                <span
                                    className="w-3 h-3 rounded-full mr-3"
                                    style={{
                                        backgroundColor:
                                            COLORS[index % COLORS.length],
                                    }}
                                ></span>
                                <span className="text-gray-700">
                                    {item.name}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="font-semibold text-gray-800">
                                    {((item.value / totalValue) * 100).toFixed(
                                        0
                                    )}
                                    %
                                </span>
                                <span className="text-gray-500 ml-4 w-6 inline-block">
                                    {item.value}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default CategoryDistributionRechart
