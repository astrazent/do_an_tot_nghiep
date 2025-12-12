import React from 'react'

const chartData = [
    { label: 'Thực phẩm khác', value: 45672, displayValue: '45.672' },
    { label: 'Hải sản', value: 32148, displayValue: '32.148' },
    { label: 'Ruốc', value: 18934, displayValue: '18.934' },
    { label: 'Sản phẩm từ gà', value: 12567, displayValue: '12.567' },
    { label: 'Các loại hạt', value: 8234, displayValue: '8.234' },
    { label: 'Sản phẩm từ vịt', value: 4512, displayValue: '4.512' },
]

const MAX_VALUE = 50000

const interpolateColor = t => {
    const start = { r: 38, g: 143, b: 255 }
    const end = { r: 38, g: 77, b: 111 }
    const r = Math.round(start.r + (end.r - start.r) * t)
    const g = Math.round(start.g + (end.g - start.g) * t)
    const b = Math.round(start.b + (end.b - start.b) * t)
    return `rgb(${r}, ${g}, ${b})`
}

const ChartBar = ({ label, displayValue, width, color }) => (
    <div className="grid grid-cols-[140px_1fr] items-center gap-4">
        <span className="text-right text-sm text-gray-600 font-medium">
            {label}
        </span>

        <div
            className="relative h-5 rounded"
            style={{
                width: `${width}%`,
                backgroundColor: color,
            }}
        >
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white font-semibold text-sm">
                {displayValue}
            </span>
        </div>
    </div>
)

const UserBehaviorFlowChart = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Doanh thu theo danh mục sản phẩm
            </h2>

            <div className="space-y-4">
                {chartData.map((item, index) => {
                    const barWidthPercentage = (item.value / MAX_VALUE) * 100
                    const t = index / (chartData.length - 1)
                    const color = interpolateColor(t)
                    return (
                        <ChartBar
                            key={item.label}
                            label={item.label}
                            displayValue={item.displayValue}
                            width={barWidthPercentage}
                            color={color}
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

export default UserBehaviorFlowChart
