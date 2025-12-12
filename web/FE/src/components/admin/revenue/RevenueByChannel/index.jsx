import React, { useEffect, useState } from 'react'
import { getNewVsReturningRevenue } from '~/services/admin/RevenueService'

const LegendItem = ({ name, percentage, revenue, color }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-3 ${color}`}></span>
            <span className="text-gray-700">{name}</span>
        </div>
        <div className="text-right">
            <p className="font-semibold text-gray-800">{percentage}%</p>
            <p className="text-sm text-gray-500">
                {Number(revenue).toLocaleString('vi-VN')} ₫
            </p>
        </div>
    </div>
)

const RevenueByChannel = ({ dateRange }) => {
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getNewVsReturningRevenue({
                    startDate: dateRange.startDate,
                    endDate: dateRange.endDate,
                })

                const apiData = res.data

                const formatted = [
                    {
                        name: 'Khách mới',
                        percentage: parseFloat(apiData.new_customer.percent),
                        revenue: apiData.new_customer.revenue,
                        color: 'bg-blue-500',
                    },
                    {
                        name: 'Khách cũ',
                        percentage: parseFloat(
                            apiData.returning_customer.percent
                        ),
                        revenue: apiData.returning_customer.revenue,
                        color: 'bg-orange-500',
                    },
                ]

                setData(formatted)
            } catch (e) {
                console.error('Lỗi load doanh thu khách mới vs khách cũ:', e)
            }
        }

        fetchData()
    }, [dateRange])

    if (!data) return <p>Đang tải dữ liệu...</p>

    // tạo gradient động
    const newPercent = data[0].percentage
    const returningPercent = data[1].percentage

    const gradient = `
        conic-gradient(
            #007bff 0% ${newPercent}%,
            #fd7e14 ${newPercent}% 100%
        )
    `

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Doanh thu khách mới vs khách cũ
            </h2>

            <div className="flex flex-col md:flex-row md:items-center">
                <div className="relative w-64 h-64 mb-8 md:mb-0 md:mr-8 flex-shrink-0">
                    <div
                        className="w-full h-full rounded-full"
                        style={{ background: gradient }}
                    ></div>

                    <div className="absolute top-1/2 left-1/2 w-3/5 h-3/5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="w-full md:flex-1 space-y-4">
                    {data.map(item => (
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

export default RevenueByChannel
