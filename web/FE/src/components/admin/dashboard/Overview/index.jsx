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
    const [revenueData, setRevenueData] = useState(Array(12).fill(0))

    // GỌN GÀNG – Fetch API
    const fetchDashboard = async () => {
        try {
            const res = await getYearRevenue()

            const formatted =
                res?.data?.map(item => Number(item.total_revenue)) || []
            const padded = [...formatted]

            // Đảm bảo luôn có đủ 12 tháng
            while (padded.length < 12) padded.push(0)

            setRevenueData(padded)
        } catch (error) {
            console.error('Lỗi tải doanh thu năm:', error)
        }
    }

    useEffect(() => {
        fetchDashboard()
    }, [])

    // Chuẩn hóa dữ liệu theo 12 tháng
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
                <button className="text-gray-400 hover:text-gray-600">
                    <HiOutlineDotsHorizontal size={24} />
                </button>
            </div>

            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 20, left: 11, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorValue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#4ADE80"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#4ADE80"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        {/* Tooltip hiển thị VND */}
                        <Tooltip
                            formatter={value =>
                                value.toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND',
                                })
                            }
                        />

                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />

                        {/* Y-axis format tiền */}
                        <YAxis
                            tickFormatter={value =>
                                value.toLocaleString('vi-VN')
                            }
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
