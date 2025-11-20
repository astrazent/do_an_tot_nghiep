import React, { useState, useEffect } from 'react'
import { ResponsiveContainer, Treemap } from 'recharts'
import { getRevenueByLocation } from '~/services/admin/dashboardAdminService'

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
            style={{ cursor: 'pointer' }}
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
                }}
            />

            {canDisplayText && (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    fill="#fff"
                    fontSize={16}
                    fontWeight="bold"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth={1}
                    paintOrder="stroke"
                >
                    <tspan x={x + width / 2} dy="-0.4em">
                        {name}
                    </tspan>
                    <tspan x={x + width / 2} dy="1.4em">
                        {size}
                    </tspan>
                </text>
            )}
        </g>
    )
}


const SalesByLocationChart = ({ dateRange }) => {
    const [hoveredIndex, setHoveredIndex] = useState(null)
    const [data, setData] = useState([])

    const fetchRevenueData = async () => {
        try {
            const res = await getRevenueByLocation(dateRange)

            const formatted = res.data.map(item => ({
                name: item.city,
                size: Number(item.total_revenue_million),
            }))

            setData(formatted)
        } catch (error) {
            console.error('Lỗi tải revenue by location:', error)
        }
    }

    useEffect(() => {
        fetchRevenueData()
    }, [dateRange])

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm dark:border dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Doanh thu theo khu vực (triệu đồng)
            </h3>

            <div className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <Treemap
                        data={data}
                        dataKey="size"
                        stroke="#fff"
                        ratio={4 / 3}
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
