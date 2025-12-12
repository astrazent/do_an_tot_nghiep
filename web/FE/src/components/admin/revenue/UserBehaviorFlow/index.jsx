import React from 'react'

const chartData = [
    {
        label: 'Thực phẩm khác',
        value: 45672,
        displayValue: '45.672',
        color: 'bg-blue-500',
    },
    {
        label: 'Hải sản',
        value: 32148,
        displayValue: '32.148',
        color: 'bg-slate-700',
    },
    {
        label: 'Ruốc',
        value: 18934,
        displayValue: '18.934',
        color: 'bg-slate-700',
    },
    {
        label: 'Sản phẩm từ gà',
        value: 12567,
        displayValue: '12.567',
        color: 'bg-slate-700',
    },
    {
        label: 'Các loại hạt',
        value: 8234,
        displayValue: '8.234',
        color: 'bg-slate-700',
    },
    {
        label: 'Sản phẩm từ vịt',
        value: 4512,
        displayValue: '4.512',
        color: 'bg-slate-700',
    },
    {
        label: 'Sản phẩm từ cá',
        value: 12567,
        displayValue: '12.567',
        color: 'bg-slate-700',
    },
    {
        label: 'Sản phẩm từ heo',
        value: 8234,
        displayValue: '8.234',
        color: 'bg-slate-700',
    },
    {
        label: 'Sản phẩm từ ngan',
        value: 4512,
        displayValue: '4.512',
        color: 'bg-slate-700',
    },
]

const MAX_VALUE = 50000

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

const UserBehaviorFlow = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Doanh thu theo danh mục sản phẩm
            </h2>

            <div className="space-y-5">
                {chartData.map(item => {
                    const barWidthPercentage = (item.value / MAX_VALUE) * 100

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
                {['0K', '10K', '20K', '30K', '40K', '50K'].map(label => (
                    <span key={label} className="text-xs text-gray-500">
                        {label}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default UserBehaviorFlow
