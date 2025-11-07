import React from 'react'

const revenueData = [
    {
        name: 'Trang web',
        percentage: '42.3%',
        revenue: '193.140.000 ₫',
        color: 'bg-blue-500',
    },
    {
        name: 'Mạng xã hội',
        percentage: '16.4%',
        revenue: '74.900.000 ₫',
        color: 'bg-orange-500',
    },
    {
        name: 'Đối tác liên kết',
        percentage: '9.5%',
        revenue: '43.490.000 ₫',
        color: 'bg-red-500',
    },
]

const LegendItem = ({ name, percentage, revenue, color }) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center">
            <span className={`w-3 h-3 rounded-full mr-3 ${color}`}></span>
            <span className="text-gray-700">{name}</span>
        </div>
        <div className="text-right">
            <p className="font-semibold text-gray-800">{percentage}</p>
            <p className="text-sm text-gray-500">{revenue}</p>
        </div>
    </div>
)

const RevenueByChannel = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Doanh thu theo kênh
            </h2>

            <div className="flex flex-col md:flex-row md:items-center">
                <div className="relative w-64 h-64 mb-8 md:mb-0 md:mr-8 flex-shrink-0">
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background: `conic-gradient(
                                #007bff 0% 42.3%,
                                #fd7e14 42.3% 58.7%,
                                #dc3545 58.7% 68.2%
                            )`,
                        }}
                    ></div>
                    <div className="absolute top-1/2 left-1/2 w-3/5 h-3/5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                </div>

                <div className="w-full md:flex-1 space-y-4">
                    {revenueData.map(item => (
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
