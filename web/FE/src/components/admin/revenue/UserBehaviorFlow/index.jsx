import React, { useEffect, useState } from 'react'
import { getRevenueByCategory } from '~/services/admin/RevenueService'


const ChartBar = ({ label, displayValue, width, color }) => (
    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <span className="text-right text-sm text-gray-600 font-medium">
            {label}
        </span>

        <div
            className={`relative h-8 rounded ${color}`}
            style={{ width: `${width}%` }}
        >
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-semibold text-sm">
                {displayValue}
            </span>
        </div>
    </div>
)

const UserBehaviorFlow = ({ dateRange }) => {
    const [chartData, setChartData] = useState([])
    const [maxValue, setMaxValue] = useState(1) // tránh chia cho 0

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getRevenueByCategory({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                })

                const apiData = res.data

                // Lấy giá trị lớn nhất để scale chart
                const dynamicMax = Math.max(
                    ...apiData.map(item => Number(item.total_revenue))
                )

                setMaxValue(dynamicMax)

                const formatted = apiData.map((item, index) => ({
                    label: item.category_name,
                    value: Number(item.total_revenue),
                    displayValue: Number(item.total_revenue).toLocaleString(
                        'vi-VN'
                    ),
                    color: index === 0 ? 'bg-blue-500' : 'bg-slate-700',
                }))

                setChartData(formatted)
            } catch (e) {
                console.error('Lỗi load revenue by category:', e)
            }
        }

        fetchData()
    }, [dateRange])

    if (!chartData.length) return <p>Đang tải dữ liệu...</p>

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Doanh thu theo danh mục sản phẩm
            </h2>

            <div className="space-y-5">
                {chartData.map(item => {
                    const barWidthPercentage = (item.value / maxValue) * 100

                    return (
                        <ChartBar
                            key={item.label}
                            label={item.label}
                            displayValue={item.displayValue}
                            width={barWidthPercentage}
                            color={item.color}
                        />
                    )
                })}
            </div>

            <div className="flex justify-between pl-[156px] mt-4 pt-2 border-t border-gray-200">
                {[0, 0.25, 0.5, 0.75, 1].map(step => (
                    <span key={step} className="text-xs text-gray-500">
                        {(maxValue * step / 1000).toFixed(1)}k
                    </span>
                ))}
            </div>
        </div>
    )
}

export default UserBehaviorFlow
