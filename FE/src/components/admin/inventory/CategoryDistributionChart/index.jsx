import React, { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getProductStockByCategory } from '~/services/admin/productAdminService'

const CategoryDistributionChart = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    // Gọi API lấy tồn kho theo danh mục
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await getProductStockByCategory()
                const rawData = response.data
                const formattedData = rawData.map(item => ({
                    name: item.category_name,
                    value: Number(item.total_stock) || 0,
                }))
                formattedData.sort((a, b) => b.value - a.value)

                setData(formattedData)
            } catch (err) {
                console.error('Lỗi tải dữ liệu phân bố danh mục:', err)
                setError('Không thể tải dữ liệu tồn kho')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Tính tổng để hiển thị % trong legend
    const totalValue = data.reduce((acc, item) => acc + item.value, 0)

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

        return percent > 0.05 ? (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontWeight="bold"
            >
                {(percent * 100).toFixed(0)}%
            </text>
        ) : null
    }

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded mx-auto"></div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-red-600 font-medium">
                {error}
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                Chưa có sản phẩm trong kho
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full mx-auto h-full">
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
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            formatter={value => `${value} sản phẩm`}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legend đẹp */}
            <div className="mt-6 space-y-2.5">
                {data.map((item, index) => (
                    <div
                        key={item.name}
                        className="flex items-center justify-between py-2.5"
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div
                                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                                style={{
                                    backgroundColor:
                                        COLORS[index % COLORS.length],
                                }}
                            />
                            <span className="text-gray-700 text-base font-medium truncate">
                                {item.name}
                            </span>
                        </div>

                        <div className="text-right">
                            <span className="font-bold text-base text-gray-900">
                                {totalValue > 0
                                    ? ((item.value / totalValue) * 100).toFixed(
                                          0
                                      )
                                    : 0}
                                %
                            </span>
                            <span className="text-gray-500 text-sm ml-2.5">
                                ({item.value})
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategoryDistributionChart
