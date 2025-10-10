import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

const data = [
    { name: 'Jan', value: 0 },
    { name: 'Feb', value: 30000 },
    { name: 'Mar', value: 50000 },
    { name: 'Apr', value: 42000 },
    { name: 'May', value: 48000 },
    { name: 'Jun', value: 25000 },
    { name: 'Jul', value: 60000 },
    { name: 'Aug', value: 40000 },
    { name: 'Sep', value: 38000 },
    { name: 'Oct', value: 40000 },
]

const Overview = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                    Overview
                </h3>
                <button className="text-gray-400 hover:text-gray-600">
                    <HiOutlineDotsHorizontal size={24} />
                </button>
            </div>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient
                                id="colorValue"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#FF8A8A"
                                    stopOpacity={0.4}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#FF8A8A"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis
                            tickFormatter={value => `${value / 1000}K`}
                            tick={{ fontSize: 12 }}
                        />
                        <Tooltip />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#F472B6"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default Overview
