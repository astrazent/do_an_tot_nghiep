import React from 'react'

const StatCard = ({
    title,
    value,
    change,
    changeType,
    icon,
    iconBgColor,
    children,
}) => {
    const isPositive = changeType === 'positive'
    const changeColor = isPositive ? 'text-green-500' : 'text-red-500'

    const UpArrow = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
        </svg>
    )

    const DownArrow = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
        </svg>
    )

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                {change && (
                    <div
                        className={`mt-2 flex items-center text-sm ${changeColor}`}
                    >
                        {changeType === 'positive' ? (
                            <UpArrow />
                        ) : (
                            <DownArrow />
                        )}
                        <span className="ml-1 font-semibold">{change}</span>
                    </div>
                )}
                {children && !change && <div className="mt-2">{children}</div>}
            </div>
            <div className={`p-3 rounded-lg ${iconBgColor}`}>{icon}</div>
        </div>
    )
}

export default StatCard
