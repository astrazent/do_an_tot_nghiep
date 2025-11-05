import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { NavLink } from 'react-router-dom'

import { useHotProducts } from '~/hooks/user/useProduct'

const TextSlider = () => {
    // data ở đây sẽ là toàn bộ object response từ API
    const { data: apiResponse, isLoading } = useHotProducts(8)

    // Trích xuất mảng hotProducts từ object response
    // Sử dụng optional chaining (?.) để tránh lỗi nếu apiResponse hoặc data chưa tồn tại
    const hotProducts = apiResponse?.data?.hotProducts || []

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-8">
                <p className="text-xs text-gray-400">Đang tải...</p>
            </div>
        )
    }

    return (
        <div className="overflow-hidden h-8 w-max">
            <Swiper
                direction="vertical"
                loop={true}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                speed={500}
                modules={[Autoplay]}
                slidesPerView={1}
                className="h-8"
            >
                {/* Bây giờ hotProducts đã là mảng đúng và có thể map qua */}
                {hotProducts.map((product) => (
                    <SwiperSlide key={product.id} className="h-12">
                        <div className="mt-1.5">
                            <NavLink
                                to={`/product/${product.slug}`}
                                className="text-xs hover:text-green-400"
                            >
                                {product.name.toUpperCase()}
                            </NavLink>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default TextSlider