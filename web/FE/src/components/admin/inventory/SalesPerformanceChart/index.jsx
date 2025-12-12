import React, { useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Area,
    LabelList,
} from 'recharts'

const salesData = {
    '7D': [
        { day: 'Mon', sales: 65 },
        { day: 'Tue', sales: 78 },
        { day: 'Wed', sales: 85 },
        { day: 'Thu', sales: 92 },
        { day: 'Fri', sales: 88 },
        { day: 'Sat', sales: 95 },
        { day: 'Sun', sales: 102 },
    ],
    '30D': [
        { day: 'Week 1', sales: 310 },
        { day: 'Week 2', sales: 340 },
        { day: 'Week 3', sales: 305 },
        { day: 'Week 4', sales: 360 },
    ],
    '90D': [
        { day: 'Jan', sales: 1200 },
        { day: 'Feb', sales: 1350 },
        { day: 'Mar', sales: 1280 },
    ],
}

const CustomizedLabel = props => {
    const { x, y, value } = props

    const yOffset = y - 10

    return (
        <g>
            <rect
                x={x - 15}
                y={yOffset - 18}
                width="30"
                height="20"
                fill="#9333EA"
                rx="4"
            />
            <text
                x={x}
                y={yOffset - 4}
                fill="#fff"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
            >
                {value}
            </text>
        </g>
    )
}

const SalesPerformanceChart = () => {
    const [timeRange, setTimeRange] = useState('7D')
    const data = salesData[timeRange]

    return (
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">
                    Biểu đồ tồn kho
                </h2>
            </div>

            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <LineChart
                        data={data}
                        margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient
                                id="salesGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#9333EA"
                                    stopOpacity={0.6}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#9333EA"
                                    stopOpacity={0}
                                />
                            </linearGradient>

                            <filter
                                id="shadow"
                                x="-50%"
                                y="-50%"
                                width="200%"
                                height="200%"
                            >
                                <feDropShadow
                                    dx="0"
                                    dy="8"
                                    stdDeviation="12"
                                    floodColor="#9333EA"
                                    floodOpacity="0.5"
                                />
                            </filter>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#e5e7eb"
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            dy={10}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            domain={['dataMin - 20', 'dataMax + 10']}
                            label={{
                                value: 'Sales ($1000s)',
                                angle: -90,
                                position: 'insideLeft',
                                fill: '#6b7280',
                                fontSize: 12,
                                dx: -15,
                            }}
                        />

                        <Area
                            type="monotone"
                            dataKey="sales"
                            stroke={false}
                            fill="url(#salesGradient)"
                        />

                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#9333EA"
                            strokeWidth={3}
                            dot={false}
                            activeDot={{ r: 8, strokeWidth: 2, fill: '#fff' }}
                            filter="url(#shadow)"
                        >
                            <LabelList
                                dataKey="sales"
                                content={<CustomizedLabel />}
                            />
                        </Line>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SalesPerformanceChart
