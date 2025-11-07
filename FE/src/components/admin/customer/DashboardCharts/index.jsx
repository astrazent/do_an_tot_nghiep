import React, { useState } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'

const RoundedBar = props => {
    const { fill, x, y, width, height } = props
    const radius = 8

    return (
        <g>
            <path
                d={`M${x},${y + height} 
           L${x},${y + radius} 
           Q${x},${y} ${x + radius},${y} 
           L${x + width - radius},${y} 
           Q${x + width},${y} ${x + width},${y + radius} 
           L${x + width},${y + height} 
           Z`}
                fill={fill}
            />
        </g>
    )
}

const RegistrationTrendsRecharts = () => {
    const monthlyData = Array.from({ length: 30 }, (_, i) => ({
        name: `${i + 1}`,
        users: Math.floor(Math.random() * 45) + 5,
    }))

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Biểu đồ lượng truy cập
                </h3>
            </div>
            <div className="flex-grow">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={monthlyData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 10 }}
                            interval={4}
                        />
                        <YAxis hide={true} axisLine={false} tickLine={false} />
                        <Tooltip
                            cursor={{ fill: 'rgba(243, 244, 246, 0.5)' }}
                            contentStyle={{
                                borderRadius: '8px',
                                border: 'none',
                            }}
                        />
                        <Bar
                            dataKey="users"
                            fill="#8b5cf6"
                            shape={<RoundedBar />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

const UserDistributionRecharts = () => {
    const pieData = [
        { name: 'Admin', value: 2 },
        { name: 'Moderator', value: 2 },
        { name: 'User', value: 4 },
    ]
    const COLORS = ['#8b5cf6', '#f97316', '#10b981']

    const ageData = [
        { range: 'Dưới 18', count: 1, color: 'bg-sky-400' },
        { range: '18-24', count: 3, color: 'bg-blue-500' },
        { range: '25-34', count: 3, color: 'bg-indigo-500' },
        { range: 'Trên 35', count: 1, color: 'bg-violet-600' },
    ]

    const genderData = [
        { type: 'Nam', count: 5, color: 'bg-cyan-500' },
        { type: 'Nữ', count: 3, color: 'bg-pink-500' },
    ]

    const totalAgeUsers = ageData.reduce((sum, item) => sum + item.count, 0)
    const totalGenderUsers = genderData.reduce(
        (sum, item) => sum + item.count,
        0
    )

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Phân loại người dùng
            </h3>

            <div>
                <h4 className="font-medium text-gray-600 mb-3">Theo vai trò</h4>
                <div style={{ width: '100%', height: 160 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={0}
                                dataKey="value"
                                stroke="#ffffff"
                                strokeWidth={4}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '8px',
                                    border: 'none',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-6">
                <h4 className="font-medium text-gray-600 mb-3">Theo độ tuổi</h4>
                <div className="space-y-3 text-sm">
                    {ageData.map(age => {
                        const percentage =
                            totalAgeUsers > 0
                                ? (age.count / totalAgeUsers) * 100
                                : 0

                        return (
                            <div
                                key={age.range}
                                className="flex justify-between items-center"
                            >
                                <span className="text-gray-700">
                                    {age.range}
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-1.5 bg-gray-200 rounded-full">
                                        <div
                                            className={`h-1.5 rounded-full ${age.color}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="w-4 text-right font-medium text-gray-800">
                                        {age.count}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="font-medium text-gray-600 mb-3">
                    Theo giới tính
                </h4>
                <div className="space-y-3 text-sm">
                    {genderData.map(gender => {
                        const percentage =
                            totalGenderUsers > 0
                                ? (gender.count / totalGenderUsers) * 100
                                : 0

                        return (
                            <div
                                key={gender.type}
                                className="flex justify-between items-center"
                            >
                                <span className="text-gray-700">
                                    {gender.type}
                                </span>
                                <div className="flex items-center gap-3">
                                    <div className="w-24 h-1.5 bg-gray-200 rounded-full">
                                        <div
                                            className={`h-1.5 rounded-full ${gender.color}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="w-4 text-right font-medium text-gray-800">
                                        {gender.count}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

const DashboardRecharts = () => {
    return (
        <div className="bg-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RegistrationTrendsRecharts />
                </div>
                <div className="lg:col-span-1">
                    <UserDistributionRecharts />
                </div>
            </div>
        </div>
    )
}

export default DashboardRecharts
