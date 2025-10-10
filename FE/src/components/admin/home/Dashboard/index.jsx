import React from 'react'
import Header from './Header'
import StatCard from './StatCard'
import ChartCard from './ChartCard'
import TopAgents from './TopAgents'

// Để vẽ biểu đồ, bạn cần một thư viện như 'recharts' hoặc 'chart.js'
// npm install recharts
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts'

// Dữ liệu mẫu
const salesData = [
    { name: '1', value: 60 },
    { name: '2', value: 80 },
    { name: '3', value: 70 },
    { name: '4', value: 90 },
    { name: '5', value: 60 },
    { name: '6', value: 118 },
    { name: '7', value: 100 },
    { name: '8', value: 110 },
    { name: '9', value: 40 },
    { name: '10', value: 75 },
]

const overviewData = [
    { name: 'Jan', value: 10000 },
    { name: 'Feb', value: 45000 },
    { name: 'Mar', value: 55000 },
    { name: 'Apr', value: 48000 },
    { name: 'May', value: 60000 },
    { name: 'Jun', value: 40000 },
    { name: 'Jul', value: 65000 },
    { name: 'Aug', value: 50000 },
    { name: 'Sep', value: 45000 },
    { name: 'Oct', value: 48000 },
]

const Dashboard = () => {
    return (
        <div>
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sales This Month */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-blue-600 text-white p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold">34,042</h3>
                    <p className="text-blue-200">Sales this month</p>
                    <div className="h-40 mt-4 -ml-6 -mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="white"
                                    strokeWidth={3}
                                    dot={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#333',
                                        border: 'none',
                                    }}
                                    labelStyle={{ color: 'white' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Overview Chart */}
                <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-800">Overview</h3>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={overviewData}>
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={value => `${value / 1000}K`}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#ef4444"
                                    fill="#fee2e2"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Agents */}
                <div className="col-span-1 bg-white p-6 rounded-lg">
                    <TopAgents />
                </div>
            </div>

            {/* Dãy các Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                <StatCard
                    title="Total Income"
                    value="$6,458.00"
                    icon="dollar-green"
                />
                <StatCard
                    title="Spending Income"
                    value="$4,329.00"
                    icon="dollar-blue"
                />
                <StatCard title="Total Sales" value="5,215" icon="sales" />
                <StatCard title="Total Clients" value="489" icon="clients" />
                <StatCard
                    title="Total Revenue"
                    value="$68,125"
                    icon="revenue"
                />
                <StatCard
                    title="Total Customers"
                    value="526"
                    icon="customers"
                />
            </div>

            {/* Các biểu đồ còn lại */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg">
                    {/* Total Revenue Chart */}
                </div>
                <div className="bg-white p-6 rounded-lg">
                    {/* History Chart */}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
