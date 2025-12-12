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
    const { data: slides, isLoading, isError } = useListSlider()

    if (isLoading) {
        return <div className="w-full h-[450px] bg-gray-200 animate-pulse" />
    }

    if (isError || !slides || slides.length === 0) {
        return null
    }

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
                {slides.map(slide => (
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
