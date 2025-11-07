import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts'

const userGrowthData = [
    { name: 'Day 24', users: 62 },
    { name: 'Day 25', users: 98 },
    { name: 'Day 26', users: 28 },
    { name: 'Day 27', users: 68 },
    { name: 'Day 28', users: 86 },
    { name: 'Day 29', users: 76 },
    { name: 'Day 30', users: 60 },
]

const UserGrowthChart = () => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:border dark:border-gray-700 h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Số lượng người dùng mới (7 ngày gần nhất)
            </h3>
            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={userGrowthData}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            strokeOpacity={0.3}
                        />
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            className="dark:fill-gray-400"
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12, fill: '#6B7280' }}
                            className="dark:fill-gray-400"
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                            contentStyle={{
                                background: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '0.5rem',
                            }}
                        />
                        <Bar
                            dataKey="users"
                            fill="#818CF8"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default UserGrowthChart
