import React from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts'

const data = [
    { month: 'Jan', users: 120 },
    { month: 'Feb', users: 210 },
    { month: 'Mar', users: 180 },
    { month: 'Apr', users: 260 },
    { month: 'May', users: 320 },
    { month: 'Jun', users: 290 },
]

const PromoUsersBarChart = () => (
    <div className="w-full h-full bg-white p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-3 text-center">
            Số người dùng mã khuyến mãi
        </h2>

        <div className="flex justify-center items-center w-full h-[320px]">
            <ResponsiveContainer width="90%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey="users"
                        fill="#8884d8"
                        name="Người dùng"
                        radius={[8, 8, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
)

export default PromoUsersBarChart
