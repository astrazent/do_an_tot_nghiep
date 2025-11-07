import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from 'recharts'

const revenueData = [
    { name: 'Jan 1', revenue: 28000000, profit: 15000000 },
    { name: 'Jan 3', revenue: 32000000, profit: 16000000 },
    { name: 'Jan 5', revenue: 29000000, profit: 14500000 },
    { name: 'Jan 7', revenue: 31000000, profit: 15500000 },
    { name: 'Jan 9', revenue: 30000000, profit: 15000000 },
    { name: 'Jan 11', revenue: 33000000, profit: 16500000 },
    { name: 'Jan 13', revenue: 35000000, profit: 17500000 },
    { name: 'Jan 15', revenue: 37000000, profit: 18500000 },
    { name: 'Jan 17', revenue: 40000000, profit: 20000000 },
    { name: 'Jan 19', revenue: 42000000, profit: 21000000 },
    { name: 'Jan 21', revenue: 45000000, profit: 22500000 },
    { name: 'Jan 23', revenue: 47000000, profit: 23500000 },
    { name: 'Jan 25', revenue: 50000000, profit: 25000000 },
]

const yTicks = [0, 10000000, 20000000, 30000000, 40000000, 50000000]

const formatYAxis = tickItem =>
    `${(tickItem / 1000000).toLocaleString('vi-VN')}M₫`

const RevenueAnalyticsChart = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                Phân tích doanh thu
            </h3>

            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={revenueData}
                        margin={{ top: 60, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorRevenue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#2563EB"
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#2563EB"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorProfit"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#10B981"
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#10B981"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            strokeOpacity={0.2}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            className="dark:fill-gray-400"
                        />
                        <YAxis
                            ticks={yTicks}
                            tickFormatter={formatYAxis}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            className="dark:fill-gray-400"
                        />
                        <Tooltip
                            formatter={value =>
                                `${(value / 1000000).toLocaleString('vi-VN')}M₫`
                            }
                            contentStyle={{
                                background: 'white',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                            }}
                        />
                        <Legend
                            iconType="circle"
                            verticalAlign="top"
                            align="right"
                            wrapperStyle={{ top: 0, right: 0 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#2563EB"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="profit"
                            stroke="#10B981"
                            fillOpacity={1}
                            fill="url(#colorProfit)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default RevenueAnalyticsChart
