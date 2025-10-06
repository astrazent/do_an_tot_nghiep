import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const TextSlider = () => {
    const textList = [
        'CHẢ CỐM HÀ NỘI',
        'ĐẶC SẢN VÂN ĐÌNH',
        'GÀ Ủ MUỐI NGUYÊN CON',
        'KHUYẾN MÃI ĐẶC BIỆT',
        'SẢN PHẨM MỚI',
        'CHÂN VỊT RÚT XƯƠNG Ủ MUỐI',
        'CHẢ CHÌA HẢI PHÒNG',
    ]

    return (
        <div className="overflow-hidden h-8 w-max">
            {' '}
            <Swiper
                direction="vertical"
                loop={true}
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                speed={500}
                modules={[Autoplay]}
                slidesPerView={1}
                className="h-8"
            >
                {textList.map((text, index) => (
                    <SwiperSlide key={index} className="h-12">
                        <div className="mt-1.5">
                            {' '}
                            <a
                                href="#"
                                className="text-xs hover:text-green-400"
                            >
                                {text}
                            </a>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default TextSlider
