import React, { useEffect, useState } from 'react'
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
import { getYearRevenueAndOrders } from '~/services/admin/RevenueService'

const formatMoney = tickItem =>
    `${(tickItem / 1_000_000).toLocaleString('vi-VN')}M₫`

const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
]

const RevenueAnalyticsChart = () => {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [chartData, setChartData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getYearRevenueAndOrders({
                    year: selectedYear,
                })

                const formatted = res.data.map(item => ({
                    name: monthNames[item.month - 1],
                    revenue: Number(item.total_revenue), // vnđ
                    orders: Number(item.total_orders), // đơn hàng
                }))

                setChartData(formatted)
            } catch (err) {
                console.error('Lỗi lấy phân tích doanh thu:', err)
            }
        }

        fetchData()
    }, [selectedYear])

    // tạo danh sách 6 năm gần nhất
    const yearOptions = []
    for (let y = currentYear; y >= currentYear - 5; y--) {
        yearOptions.push(y)
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Phân tích doanh thu theo năm
                </h3>

                <div className="relative">
                    <select
                        className="appearance-none border px-4 py-2 pr-10 rounded-xl 
                   bg-white dark:bg-gray-700 dark:text-gray-100 
                   border-gray-300 dark:border-gray-600
                   shadow-sm cursor-pointer hover:border-blue-500
                   transition-all"
                        value={selectedYear}
                        onChange={e => setSelectedYear(Number(e.target.value))}
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>
                                Năm {year}
                            </option>
                        ))}
                    </select>

                    {/* Icon lịch */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 
                   text-gray-500 dark:text-gray-300 pointer-events-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                </div>
            </div>

            {/* BIỂU ĐỒ */}
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{ top: 30, right: 40, left: 0, bottom: 0 }}
                    >
                        {/* MÀU ĐỒ THỊ */}
                        <defs>
                            <linearGradient
                                id="revColor"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#2563EB"
                                    stopOpacity={0.25}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#2563EB"
                                    stopOpacity={0}
                                />
                            </linearGradient>

                            <linearGradient
                                id="orderColor"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#10B981"
                                    stopOpacity={0.25}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#10B981"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        {/* LƯỚI */}
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            strokeOpacity={0.2}
                        />

                        {/* TRỤC X */}
                        <XAxis
                            dataKey="name"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            className="dark:fill-gray-400"
                        />

                        {/* TRỤC Y TRÁI — DOANH THU */}
                        <YAxis
                            yAxisId="left"
                            tickFormatter={formatMoney}
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            className="dark:fill-gray-400"
                        />

                        {/* TRỤC Y PHẢI — SỐ ĐƠN HÀNG */}
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fontSize: 12 }}
                            className="dark:fill-gray-400"
                        />

                        {/* TOOLTIP */}
                        <Tooltip
                            formatter={(value, name) => {
                                if (name === 'revenue')
                                    return `${(value / 1_000_000).toLocaleString('vi-VN')}M₫`
                                return `${value} đơn`
                            }}
                            contentStyle={{
                                background: 'white',
                                borderRadius: '0.5rem',
                                border: '1px solid #e5e7eb',
                            }}
                        />

                        <Legend
                            iconType="circle"
                            verticalAlign="top"
                            height={30}
                        />

                        {/* VẼ ĐƯỜNG DOANH THU */}
                        <Area
                            type="monotone"
                            yAxisId="left"
                            dataKey="revenue"
                            stroke="#2563EB"
                            fill="url(#revColor)"
                            strokeWidth={2}
                            name="Doanh thu"
                        />

                        {/* VẼ ĐƯỜNG SỐ ĐƠN HÀNG */}
                        <Area
                            type="monotone"
                            yAxisId="right"
                            dataKey="orders"
                            stroke="#10B981"
                            fill="url(#orderColor)"
                            strokeWidth={2}
                            name="Số đơn hàng"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default RevenueAnalyticsChart
