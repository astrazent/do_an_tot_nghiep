import React from 'react'

const revenueData = [
    {
        name: 'Website',
        percentage: '42.3%',
        revenue: '193,140,000 ₫',
        color: 'bg-teal-500',
        hexColor: '#14b8a6',
    },
    {
        name: 'Social Media',
        percentage: '16.4%',
        revenue: '74,900,000 ₫',
        color: 'bg-indigo-500',
        hexColor: '#6366f1',
    },
    {
        name: 'Affiliate',
        percentage: '9.5%',
        revenue: '43,490,000 ₫',
        color: 'bg-rose-500',
        hexColor: '#f43f5e',
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

const PaymentPieChart = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans h-[380px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-15">
                Doanh thu theo phương thức thanh toán
            </h2>

            <div className="flex flex-col md:flex-row md:items-center">
                <div className="relative w-48 h-48 mb-8 md:mb-0 md:mr-8 flex-shrink-0">
                    <div
                        className="w-full h-full rounded-full"
                        style={{
                            background: `conic-gradient(
                                ${revenueData[0].hexColor} 0% 54.25%,   
                                ${revenueData[1].hexColor} 54.25% 75.8%, 
                                ${revenueData[2].hexColor} 75.8% 100%
                            )`,
                        }}
                    ></div>
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

export default PaymentPieChart
