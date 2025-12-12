import React from 'react'
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts'

const formatNumber = value => {
    return new Intl.NumberFormat('en-US').format(value)
}

const realtimeData = Array.from({ length: 40 }, (_, index) => ({
    users:
        index > 35 && index < 38
            ? Math.floor(Math.random() * 10) + 60
            : Math.floor(Math.random() * 15) + 80,
}))

const RealtimeActivity = () => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md font-sans w-full mx-auto">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Hoạt động theo thời gian thực
                    </h3>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
                        TRỰC TIẾP
                    </span>
                </div>
                <p className="text-sm font-medium text-gray-500">
                    {formatNumber(1247)} người đang truy cập
                </p>
            </div>

            <div className="w-full h-40 my-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={realtimeData}
                        margin={{ top: 80, right: 0, left: 0, bottom: 0 }}
                    >
                        <XAxis
                            axisLine={false}
                            tickLine={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                            tick={false}
                            height={10}
                        />
                        <Area
                            type="monotone"
                            dataKey="users"
                            stroke="#f97316"
                            strokeWidth={2}
                            fillOpacity={0}
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="flex justify-around items-center text-center pt-4">
                <div>
                    <p className="text-3xl font-bold text-indigo-600">
                        {formatNumber(8452)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                        Số lượt xem trang
                    </p>
                </div>
                <div>
                    <p className="text-3xl font-bold text-teal-600">
                        {formatNumber(2931)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Phiên làm việc</p>
                </div>
            </div>
        </div>
    )
}

export default RealtimeActivity
