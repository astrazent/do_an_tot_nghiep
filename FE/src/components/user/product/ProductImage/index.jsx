import React, { useState } from 'react'
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa'

//Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
//Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
//import required modules
import { Navigation } from 'swiper/modules'
//Import component CssImageZoom
import CssImageZoom from '~/components/shared/CssImageZoom'

//Import trực tiếp các ảnh/video
import videoFile from '~/assets/video/food-review.mp4'
import videoThumb from '~/assets/video/video-thumb.png'
import img1 from '~/assets/image/shared/product/dong-tao-u-muoi.png'
import img2 from '~/assets/image/shared/product/cha-ca-thac-lac-hau-giang.jpg'
import img3 from '~/assets/image/shared/product/cha-ca-thac-lac-tuoi-tam-gia-vi.png'
import img4 from '~/assets/image/shared/product/dac-san-cha-sun.jpg'
import img5 from '~/assets/image/shared/product/dac-san-van-dinh-vit-u-xi-dau.jpg'
import img6 from '~/assets/image/shared/product/dong-tao-u-muoi.png'
import img7 from '~/assets/image/shared/product/khau-nhuc-lang-son.jpg'

//Dữ liệu media
const mediaItems = [
    { type: 'video', src: videoFile, thumbnail: videoThumb },
    { type: 'image', src: img1 },
    { type: 'image', src: img2 },
    { type: 'image', src: img3 },
    { type: 'image', src: img4 },
    { type: 'image', src: img5 },
    { type: 'image', src: img6 },
    { type: 'image', src: img7 },
]

const ProductImage = () => {
    const [currentMedia, setCurrentMedia] = useState(mediaItems[0])
    const [showControls, setShowControls] = useState(false)
    return (
        <div className="w-full">
            <div className="mb-4 aspect-square flex items-center justify-center relative bg-gray-200 border border-gray-300 w-full">
                {currentMedia.type === 'image' ? (
                    <CssImageZoom src={currentMedia.src} zoomLevel={2.5} />
                ) : (
                    <video
                        src={currentMedia.src}
                        muted
                        autoPlay
                        loop
                        className="w-full h-full object-contain rounded-2xl"
                        controls={showControls}
                        onClick={() => setShowControls(true)}
                    />
                )}
            </div>

            <div className="relative flex items-center px-8">
                <div
                    id="prev-thumbnail"
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                >
                    <div className="bg-white rounded-full p-2 shadow-md">
                        <FaChevronLeft className="text-green-600" />
                    </div>
                </div>

                <Swiper
                    modules={[Navigation]}
                    spaceBetween={10}
                    slidesPerView={5}
                    slidesPerGroup={5}
                    navigation={{
                        nextEl: '#next-thumbnail',
                        prevEl: '#prev-thumbnail',
                    }}
                    className="w-full"
                >
                    {mediaItems.map((item, idx) => (
                        <SwiperSlide
                            key={idx}
                            onClick={() => setCurrentMedia(item)}
                            className="cursor-pointer"
                        >
                            <div
                                className={`relative rounded-md border-2 p-1 transition-colors flex items-center justify-center
        ${currentMedia.src === item.src ? 'border-green-500' : 'border-transparent'}`}
                            >
                                <img
                                    src={
                                        item.type === 'video'
                                            ? item.thumbnail
                                            : item.src
                                    }
                                    alt={`Thumbnail ${idx + 1}`}
                                    className="w-full h-full object-contain aspect-square rounded-sm"
                                />
                                {item.type === 'video' && (
                                    <div className="absolute flex items-center justify-center inset-0">
                                        <div className="bg-black/70 rounded-full p-2 border border-white flex items-center justify-center">
                                            <FaPlay className="text-white text-xs" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div
                    id="next-thumbnail"
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer"
                >
                    <div className="bg-white rounded-full p-2 shadow-md">
                        <FaChevronRight className="text-green-600" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductImage
