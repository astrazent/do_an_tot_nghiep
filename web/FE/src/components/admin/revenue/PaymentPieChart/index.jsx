import React, { useEffect, useState } from 'react'
import { getRevenueByPaymentMethod } from '~/services/admin/RevenueService'

const COLORS = [
    { bg: 'bg-teal-500', hex: '#14b8a6' },
    { bg: 'bg-indigo-500', hex: '#6366f1' },
    { bg: 'bg-rose-500', hex: '#f43f5e' },
    { bg: 'bg-orange-500', hex: '#f97316' },
    { bg: 'bg-yellow-500', hex: '#eab308' },
    { bg: 'bg-green-500', hex: '#178b41ff' },
]

const LegendItem = ({ name, percentage, revenue, color }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-3 ${color}`}></span>
            <span className="text-gray-700">{name}</span>
        </div>
        <div className="text-right">
            <p className="font-semibold text-gray-800">{percentage}%</p>
            <p className="text-sm text-gray-500">
                {Number(revenue).toLocaleString('vi-VN')} đ
            </p>
        </div>
    </div>
)

const PaymentPieChart = ({ dateRange }) => {
    const [chartData, setChartData] = useState([])
    const [gradientStyle, setGradientStyle] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getRevenueByPaymentMethod({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                })

                const apiData = res.data

                const formatted = apiData.map((item, i) => ({
                    name: item.payment_method,
                    percentage: Number(item.percent),
                    revenue: Number(item.total_revenue),
                    color: COLORS[i % COLORS.length].bg,
                    hexColor: COLORS[i % COLORS.length].hex,
                }))

                setChartData(formatted)

                // === CREATE CONIC GRADIENT BASED ON API ===
                let currentStart = 0
                const gradientParts = formatted.map(item => {
                    const start = currentStart
                    const end = currentStart + item.percentage
                    currentStart = end

                    return `${item.hexColor} ${start}% ${end}%`
                })

                setGradientStyle(`conic-gradient(${gradientParts.join(',')})`)
            } catch (error) {
                console.error('Lỗi load PaymentPieChart:', error)
            }
        }

        fetchData()
    }, [dateRange])

    if (!chartData.length)
        return (
            <div className="bg-white p-6 rounded-lg shadow-md w-full h-[380px] flex items-center justify-center">
                <p>Đang tải...</p>
            </div>
        )

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans h-[380px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Doanh thu theo phương thức thanh toán
            </h2>

            <div className="flex flex-col md:flex-row md:items-center">
                <div className="relative w-48 h-48 mb-8 md:mb-0 md:mr-8 flex-shrink-0">
                    <div
                        className="w-full h-full rounded-full"
                        style={{ background: gradientStyle }}
                    ></div>
                </div>

                <div className="w-full md:flex-1 space-y-4 max-h-[260px] overflow-y-auto pr-2 scrollbar-thin">
                    {chartData.map(item => (
                        <LegendItem
                            key={item.name}
                            name={item.name}
                            percentage={item.percentage}
                            revenue={item.revenue}
                            color={item.color}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PaymentPieChart
