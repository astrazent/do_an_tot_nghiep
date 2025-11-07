import React from 'react'
import { Link } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './banner.scss'

import { useListSlider } from '~/hooks/user/useSlider'

const Banner = () => {
    // 1. Dữ liệu trả về từ hook (biến 'data') giờ đây chính là mảng 'slides'
    const { data: slides, isLoading, isError } = useListSlider()

    // 2. Trạng thái tải vẫn giữ nguyên
    if (isLoading) {
        return (
            <div className="w-full h-[450px] bg-gray-200 animate-pulse" />
        )
    }

    // 3. Điều chỉnh lại điều kiện kiểm tra lỗi hoặc không có dữ liệu
    if (isError || !slides || slides.length === 0) {
        return null // Không hiển thị gì nếu có lỗi hoặc mảng rỗng
    }
    
    // console.log(slides); // Dòng này sẽ in ra trực tiếp mảng slider

    return (
        <div className="w-full">
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="!h-[120%] banner-swiper"
            >
                {/* 4. Logic map không cần thay đổi vì biến 'slides' đã đúng là mảng */}
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <Link to={slide.link_url || '#'}>
                            <img
                                src={slide.image_url}
                                alt={slide.name}
                                className="w-full h-full object-cover object-center"
                            />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Banner