import React from 'react'

const StatCard = ({
    title,
    value,
    change,
    changeType,
    icon: Icon,
    iconBgColor,
    iconColor,
}) => {
    const isIncrease = changeType === 'increase'
    const changeColor = isIncrease ? 'text-green-500' : 'text-red-500'
    const arrow = isIncrease ? '↑' : '↓'

    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
            <div>
                <p className="text-gray-500 text-sm">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                <p className={`text-xs font-medium ${changeColor}`}>
                    {arrow} {change} from last month
                </p>
            </div>
            <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: iconBgColor }}
            >
                <Icon className="h-6 w-6" style={{ color: iconColor }} />
            </div>
        </div>
    )
}

export default StatCard
