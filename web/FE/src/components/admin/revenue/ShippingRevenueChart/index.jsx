import React, { useEffect, useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'
import { getRevenueByShipmentMethod } from '~/services/admin/RevenueService'
import { formatCurrency } from '~/utils/formatCurrency'

const COLOR_MAP = {
    GHTK: '#2DD4BF',
    'Viettel Post': '#60A5FA',
    GHN: '#FBBF24',
    'Nhận tại cửa hàng': '#F472B6',
    'Đối tác khác': '#A78BFA',
}

const formatYAxis = value => `${value / 1000000}tr`

const ShippingRevenueChart = ({ dateRange }) => {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getRevenueByShipmentMethod({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                })

                const apiData = res.data.map(item => ({
                    name: item.shipment_name,
                    revenue: Number(item.total_revenue),
                    color: COLOR_MAP[item.shipment_name] || '#60A5FA',
                }))

                setData(apiData)
            } catch (error) {
                console.error('Lỗi load shipment chart:', error)
            }
        }

        fetchData()
    }, [dateRange])

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Doanh thu theo Phương thức Giao hàng
            </h3>

            <div className="flex">
                <div className="flex-1 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
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
                                shape={props => {
                                    const { x, y, width, height, index } = props
                                    const fillColor = data[index]?.color
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

                <div className="flex flex-col space-y-2 ml-6">
                    {data.map(item => (
                        <div
                            key={item.name}
                            className="flex items-center space-x-2"
                        >
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            <span className="text-gray-700 text-sm">
                                {item.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ShippingRevenueChart
