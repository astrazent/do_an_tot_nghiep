import React from 'react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'

const data = [
    { name: 'Mon', Orders: 12, Revenue: 1200 },
    { name: 'Tue', Orders: 19, Revenue: 1900 },
    { name: 'Wed', Orders: 15, Revenue: 1500 },
    { name: 'Thu', Orders: 27, Revenue: 2700 },
    { name: 'Fri', Orders: 24, Revenue: 2400 },
    { name: 'Sat', Orders: 32, Revenue: 3200 },
    { name: 'Sun', Orders: 28, Revenue: 2800 },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-white rounded-lg shadow-lg">
                <p className="label text-gray-700">{`${label}`}</p>
                <p className="intro text-blue-500">{`Orders : ${payload[0].value}`}</p>
                <p className="text-green-500">{`Revenue : $${payload[1].value}`}</p>
            </div>
        )
    }

    return null
}

const OrderTrends = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md font-sans w-full h-full">
            <div className="flex justify-between items-center mb-15">
                <h2 className="text-xl font-semibold text-gray-800">
                    Order Trends
                </h2>
            </div>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart
                        data={data}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            stroke="#8884d8"
                            axisLine={false}
                            tickLine={false}
                            domain={[10, 35]}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#82ca9d"
                            axisLine={false}
                            tickLine={false}
                            domain={[1000, 3500]}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={36} />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="Orders"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.3}
                        />
                        <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="Revenue"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.3}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default OrderTrends
