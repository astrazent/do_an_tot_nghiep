import React from 'react'
import CustomCircularProgressbar from '~/components/admin/revenue/CustomCircularProgressbar'

const PromotionRevenueCharts = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full font-sans h-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-12">
                Doanh thu theo chương trình Khuyến mãi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
                <CustomCircularProgressbar
                    percentage={76}
                    title="Doanh thu từ Coupon"
                    gradientId="couponGradient"
                    gradientFrom="#2FFF63"
                    gradientTo="#6DFFCE"
                />

                <CustomCircularProgressbar
                    percentage={48}
                    title="KM theo Sản phẩm"
                    gradientId="productGradient"
                    gradientFrom="#FF6D8D"
                    gradientTo="#FFA07A"
                />
            </div>
        </div>
    )
}

export default PromotionRevenueCharts
