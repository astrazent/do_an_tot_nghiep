import React from 'react'
import { LineChart, Line, XAxis, ResponsiveContainer } from 'recharts'

const data = [
    { name: '1', uv: 2000 },
    { name: '2', uv: 3000 },
    { name: '3', uv: 2500 },
    { name: '4', uv: 3200 },
    { name: '5', uv: 1800 },
    { name: '6', uv: 2800 },
    { name: '7', uv: 2400 },
    { name: '8', uv: 2200 },
    { name: '9', uv: 1500 },
    { name: '10', uv: 2600 },
    { name: '11', uv: 2800 },
]

const SaleThisMonth = () => {
    return (
        <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md h-full">
            <h2 className="text-3xl font-bold">34,042</h2>
            <p className="text-blue-200">Sales this month</p>
            <div className="h-40 mt-4 -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'white', fontSize: 12 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="uv"
                            stroke="white"
                            strokeWidth={3}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SaleThisMonth
