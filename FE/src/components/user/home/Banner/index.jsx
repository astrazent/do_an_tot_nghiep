import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import './banner.scss'

import slide1 from '~/assets/image/shared/layout/banner/banner_1.jpg'
import slide2 from '~/assets/image/shared/layout/banner/banner_2.png'
import slide3 from '~/assets/image/shared/layout/banner/banner_3.png'

const Banner = () => {
    const slides = [
        {
            id: 1,
            image: slide1,
            title: 'ĐẶC SẢN VỊT VÂN ĐÌNH',
        },
        {
            id: 2,
            image: slide2,
            title: 'COMBO RUỐC',
        },
        {
            id: 3,
            image: slide3,
            title: 'NEM LỤI',
        },
    ]
    return (
        <>
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
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-cover object-center"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </>
    )
}

export default Banner
