import React from 'react'
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
    { value: 400 },
    { value: 300 },
    { value: 600 },
    { value: 450 },
    { value: 700 },
    { value: 350 },
    { value: 800 },
    { value: 500 },
    { value: 650 },
    { value: 430 },
    { value: 750 },
    { value: 550 },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800 text-white p-2 rounded-md shadow-lg">
                <p className="text-sm">{`series-1: ${payload[0].value}`}</p>
            </div>
        )
    }
    return null
}

const TotalRevenue = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">$346,042k</h3>
                <p className="text-sm text-gray-400">Got From 1456 customers</p>
            </div>
            <div className="h-40 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="revenueGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#FFC0CB"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#FFC0CB"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#F472B6"
                            fill="url(#revenueGradient)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default TotalRevenue
