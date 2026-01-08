import React, { useState, useEffect } from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { getYearRevenue } from '../../../../services/admin/dashboardAdminService'

const Overview = () => {
    // Năm hiện tại (2026 theo ngày hiện tại)
    const currentYear = new Date().getFullYear() // 2026
    const years = []
    for (let y = currentYear; y >= 2021; y--) {
        years.push(y)
    }

    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [revenueData, setRevenueData] = useState(Array(12).fill(0))
    const [loading, setLoading] = useState(false)

    // Fetch dữ liệu theo năm được chọn
    const fetchDashboard = async (year) => {
        setLoading(true)
        try {
            // Giả sử API của bạn nhận tham số năm: getYearRevenue(year)
            const res = await getYearRevenue(year)

            const formatted =
                res?.data?.map(item => Number(item.total_revenue)) || []
            const padded = [...formatted]

            // Đảm bảo luôn có đủ 12 tháng
            while (padded.length < 12) padded.push(0)
            // Nếu API trả về nhiều hơn 12 tháng (hiếm), cắt bớt
            if (padded.length > 12) padded.length = 12

            setRevenueData(padded)
        } catch (error) {
            console.error(`Lỗi tải doanh thu năm ${year}:`, error)
            setRevenueData(Array(12).fill(0)) // fallback về 0 nếu lỗi
        } finally {
            setLoading(false)
        }
    }

    // Load lần đầu và khi thay đổi năm
    useEffect(() => {
        fetchDashboard(selectedYear)
    }, [selectedYear])

    // Chuẩn hóa dữ liệu cho biểu đồ
    const data = [
        { name: 'Jan', value: revenueData[0] },
        { name: 'Feb', value: revenueData[1] },
        { name: 'Mar', value: revenueData[2] },
        { name: 'Apr', value: revenueData[3] },
        { name: 'May', value: revenueData[4] },
        { name: 'Jun', value: revenueData[5] },
        { name: 'Jul', value: revenueData[6] },
        { name: 'Aug', value: revenueData[7] },
        { name: 'Sep', value: revenueData[8] },
        { name: 'Oct', value: revenueData[9] },
        { name: 'Nov', value: revenueData[10] },
        { name: 'Dec', value: revenueData[11] },
    ]

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Doanh thu tổng quan
                </h3>

                <div className="flex items-center gap-4">
                    {/* Select năm */}
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        disabled={loading}
                        className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {years.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    <button className="text-gray-400 hover:text-gray-600">
                        <HiOutlineDotsHorizontal size={24} />
                    </button>
                </div>
            </div>

            {/* Hiển thị loading nếu cần */}
            {loading && (
                <div className="text-center text-gray-500 mb-2">Đang tải...</div>
            )}

            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 20, left: 11, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <Tooltip
                            formatter={(value) =>
                                value.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })
                            }
                        />

                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis
                            tickFormatter={(value) => value.toLocaleString('vi-VN')}
                            tick={{ fontSize: 12 }}
                        />

                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#22C55E"
                            fill="url(#colorValue)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Overview