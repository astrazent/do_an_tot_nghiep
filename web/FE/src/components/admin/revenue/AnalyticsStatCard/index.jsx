import React from 'react'
import { HiArrowUp, HiArrowDown } from 'react-icons/hi'

const AnalyticsStatCard = ({
    title,
    value,
    icon,
    iconBgColor,
    iconColor,
    percentageChange,
}) => {
    const isPositive = percentageChange >= 0
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
    const ChangeIcon = isPositive ? HiArrowUp : HiArrowDown

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-gray-200 mt-1">
                        {value}
                    </p>
                    <div className="flex items-center mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <ChangeIcon className={`w-4 h-4 ${changeColor}`} />
                        <span className={`ml-1 font-semibold ${changeColor}`}>
                            {isPositive ? '+' : ''}
                            {percentageChange.toFixed(1)}%
                        </span>
                        <span className="ml-1">from last month</span>
                    </div>
                </div>

                <div className={`p-3 rounded-lg ${iconBgColor}`}>
                    {React.cloneElement(icon, {
                        className: `w-6 h-6 ${iconColor}`,
                    })}
                </div>
            </div>
        </div>
    )
}

export default AnalyticsStatCard
