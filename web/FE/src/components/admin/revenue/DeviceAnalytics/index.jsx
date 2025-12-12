import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const DesktopIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
    </svg>
)
const MobileIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
    </svg>
)
const TabletIcon = ({ className }) => (
    <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            transform="rotate(90 12 12)"
        />
    </svg>
)

const deviceData = [
    {
        name: 'Máy tính để bàn',
        users: '31.247 người dùng',
        percentage: 68.4,
        color: '#6366F1',
        icon: <DesktopIcon className="w-5 h-5 text-indigo-500" />,
    },
    {
        name: 'Điện thoại di động',
        users: '11.327 người dùng',
        percentage: 24.8,
        color: '#14B8A6',
        icon: <MobileIcon className="w-5 h-5 text-teal-500" />,
    },
    {
        name: 'Máy tính bảng',
        users: '3.098 người dùng',
        percentage: 6.8,
        color: '#F97316',
        icon: <TabletIcon className="w-5 h-5 text-orange-500" />,
    },
]

const DeviceStatBar = ({ name, users, percentage, color, icon }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-bold text-gray-800">{name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-600">
                    {percentage}%
                </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="h-2 rounded-full"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
            </div>

            <p className="text-sm text-gray-500 mt-1">{users}</p>
        </div>
    )
}

const DeviceAnalytics = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md font-sans w-full h-full mx-auto">
            <div className="mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                    Phân tích thiết bị
                </h2>
            </div>

            <div className="flex justify-center mb-6">
                <div className="w-30 h-30">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={deviceData}
                                dataKey="percentage"
                                innerRadius={35}
                                outerRadius={50}
                                paddingAngle={2}
                            >
                                {deviceData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="space-y-6">
                {deviceData.map(device => (
                    <DeviceStatBar
                        key={device.name}
                        name={device.name}
                        users={device.users}
                        percentage={device.percentage}
                        color={device.color}
                        icon={device.icon}
                    />
                ))}
            </div>
        </div>
    )
}

export default DeviceAnalytics
