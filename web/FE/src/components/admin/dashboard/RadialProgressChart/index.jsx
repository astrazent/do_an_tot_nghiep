import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const RadialProgressChart = ({
    value,
    label,
    color = '#F87171',
    trackColor = '#F3F4F6',
    size = 160,
}) => {
    const data = [
        { name: 'Completed', value: value },
        { name: 'Remaining', value: 100 - value },
    ]

    const PIE_COLORS = [color, 'transparent']

    const innerRadius = (size / 2) * 0.7
    const outerRadius = (size / 2) * 0.88
    const fontSize = size / 4.5

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative" style={{ width: size, height: size }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={[{ value: 100 }]}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            fill={trackColor}
                            startAngle={90}
                            endAngle={450}
                            isAnimationActive={false}
                        />

                        <Pie
                            data={data}
                            dataKey="value"
                            cx="50%"
                            cy="50%"
                            innerRadius={innerRadius}
                            outerRadius={outerRadius}
                            startAngle={90}
                            endAngle={450}
                            cornerRadius={10}
                            fill="transparent"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={PIE_COLORS[index]}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span
                        className="font-bold"
                        style={{ color: color, fontSize: fontSize }}
                    >
                        {value}
                    </span>
                </div>
            </div>

            {label && <p className="mt-4 text-gray-600 text-sm">{label}</p>}
        </div>
    )
}

export default RadialProgressChart
