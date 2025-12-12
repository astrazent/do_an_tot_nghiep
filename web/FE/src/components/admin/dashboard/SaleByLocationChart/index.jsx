import React, { useState } from 'react'
import { ResponsiveContainer, Treemap } from 'recharts'

const vietnamSalesData = [
    { name: 'TP. Hồ Chí Minh', size: 32 },
    { name: 'Hà Nội', size: 25 },
    { name: 'Đà Nẵng', size: 18 },
    { name: 'Hải Phòng', size: 15 },
    { name: 'Bình Dương', size: 12 },
    { name: 'Đồng Nai', size: 11 },
    { name: 'Cần Thơ', size: 9.5 },
    { name: 'Khánh Hòa', size: 8.5 },
    { name: 'Bắc Ninh', size: 7 },
    { name: 'Quảng Ninh', size: 6.5 },
    { name: 'Thanh Hóa', size: 5.5 },
    { name: 'Vũng Tàu', size: 4.5 },
]

const COLORS = ['#738FA7', '#C3D2B3']

const CustomizedContent = ({
    root,
    depth,
    x,
    y,
    width,
    height,
    index,
    name,
    size,
    hoveredIndex,
    setHoveredIndex,
}) => {
    const canDisplayText = width > 80 && height > 40
    const isHovered = hoveredIndex === index

    return (
        <g
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
        >
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                style={{
                    fill: isHovered ? '#4A6D8C' : COLORS[index % COLORS.length],
                    stroke: '#fff',
                    strokeWidth: 2,
                    transition: 'all 0.2s ease',
                }}
            />
            {canDisplayText && (
                <text
                    x={x + width / 2}
                    y={y + height / 2 + 7}
                    textAnchor="middle"
                    fill={isHovered ? '#FFD700' : '#FFFFFF'}
                    fontSize={14}
                    fontWeight="bold"
                    stroke="none"
                    style={{
                        pointerEvents: 'none',
                        transition: 'fill 0.2s ease',
                    }}
                >
                    <tspan x={x + width / 2} dy="-1.2em">
                        {name}
                    </tspan>
                    {size != null && (
                        <tspan x={x + width / 2} dy="1.2em">
                            {Number(size).toLocaleString()}
                        </tspan>
                    )}
                </text>
            )}
        </g>
    )
}

const SalesByLocationChart = () => {
    const [hoveredIndex, setHoveredIndex] = useState(null)

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:border dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Doanh thu theo khu vực (triệu đồng)
            </h3>
            <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={vietnamSalesData}
                        dataKey="size"
                        ratio={4 / 3}
                        stroke="#fff"
                        content={props => (
                            <CustomizedContent
                                {...props}
                                hoveredIndex={hoveredIndex}
                                setHoveredIndex={setHoveredIndex}
                            />
                        )}
                        isAnimationActive={false}
                    />
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default SalesByLocationChart
