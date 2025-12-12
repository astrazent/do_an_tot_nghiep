import React, { useState, useEffect } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Area,
    LabelList,
    Tooltip,
} from 'recharts'
import { getSoldProductChartByYear } from '~/services/admin/productAdminService'

// Component nhãn tùy chỉnh (giữ nguyên đẹp như cũ)
const CustomizedLabel = (props) => {
    const { x, y, value } = props
    const yOffset = y - 10

    return (
        <g>
            <rect
                x={x - 20}
                y={yOffset - 18}
                width="40"
                height="24"
                fill="#9333EA"
                rx="6"
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
    const [year, setYear] = useState(new Date().getFullYear()) // Năm hiện tại mặc định
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Danh sách năm để chọn (ví dụ 5 năm gần nhất)
    const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

    // Hàm lấy dữ liệu từ API
    const fetchData = async (selectedYear) => {
        setLoading(true)
        setError(null)
        try {
            console.log('Lấy dữ liệu cho năm:', selectedYear)
            const rawData = await getSoldProductChartByYear(selectedYear)

            // Chuyển đổi dữ liệu từ API thành định dạng cho Recharts
            // API trả về: [{ month: "01", total_sold: 123 }, ...]
            const formattedData = rawData.data.map((item) => ({
                month: `Tháng ${parseInt(item.month, 10)}`, // Hiển thị "Tháng 1", "Tháng 2"...
                sales: Number(item.total_sold) || 0,
            }))

            // Đảm bảo luôn có 12 tháng (nếu có tháng không có dữ liệu thì = 0)
            const fullYearData = Array.from({ length: 12 }, (_, i) => {
                const monthStr = `Tháng ${i + 1}`
                const existing = formattedData.find((d) => d.month === monthStr)
                return existing || { month: monthStr, sales: 0 }
            })

            setData(fullYearData)
        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu doanh số:', err)
            setError('Không thể tải dữ liệu doanh số. Vui lòng thử lại.')
            setData([])
        } finally {
            setLoading(false)
        }
    }

    // Gọi API khi năm thay đổi
    useEffect(() => {
        fetchData(year)
    }, [year])

    return (
        <div className="bg-white rounded-xl shadow-md p-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-gray-800">
                    Doanh số sản phẩm đã bán theo năm
                </h2>

                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-gray-600">Chọn năm:</label>
                    <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="px-5 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2"
                        disabled={loading}
                    >
                        {years.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            )}

            {error && (
                <div className="text-center text-red-500 py-8">
                    {error}
                </div>
            )}

            {!loading && !error && data.length > 0 && (
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
                            margin={{ top: 40, right: 30, left: 20, bottom: 20 }}
                        >
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#9333EA" stopOpacity={0.6} />
                                    <stop offset="100%" stopColor="#9333EA" stopOpacity={0} />
                                </linearGradient>

                                <filter id="shadow">
                                    <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#9333EA" floodOpacity="0.4" />
                                </filter>
                            </defs>

                            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5e7eb" />

                            <XAxis
                                dataKey="month"
                                tick={{ fill: '#6b7280', fontSize: 13 }}
                                axisLine={false}
                                tickLine={false}
                            />

                            <YAxis
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                axisLine={false}
                                tickLine={false}
                                label={{
                                    value: 'Số lượng sản phẩm bán ra',
                                    angle: -90,
                                    position: 'insideLeft',
                                    style: { fill: '#6b7280', fontSize: 14 },
                                }}
                            />

                            <Tooltip
                                contentStyle={{ backgroundColor: '#f4f6f9ff', border: 'none', borderRadius: '8px' }}
                                labelStyle={{ color: '#121213ff' }}
                                formatter={(value) => [`${value} sản phẩm`, 'Đã bán']}
                            />

                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="none"
                                fill="url(#salesGradient)"
                            />

                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#9333EA"
                                strokeWidth={4}
                                dot={{ fill: '#9333EA', r: 6 }}
                                activeDot={{ r: 10, strokeWidth: 3, fill: '#fff', stroke: '#9333EA' }}
                                filter="url(#shadow)"
                            >
                                <LabelList content={<CustomizedLabel />} position="top" />
                            </Line>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}

            {!loading && !error && data.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                    Không có dữ liệu doanh số cho năm {year}
                </div>
            )}
        </div>
    )
}

export default SalesPerformanceChart