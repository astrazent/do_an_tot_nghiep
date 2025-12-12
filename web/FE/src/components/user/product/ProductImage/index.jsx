import React, { useState, useEffect } from 'react'
import { FaChevronLeft, FaChevronRight, FaPlay } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import CssImageZoom from '~/components/shared/CssImageZoom'
import { useProductBySlug } from '~/hooks/user/useProduct'

import videoFile from '~/assets/video/food-review.mp4'
import videoThumb from '~/assets/video/video-thumb.png'
const ProductImage = ({ slug }) => {
    const [currentMedia, setCurrentMedia] = useState(null)
    const [showControls, setShowControls] = useState(false)
    const { data: product, isLoading, isError, error } = useProductBySlug(slug)
    const placeholderImg =
        'https://img.freepik.com/free-vector/illustration-gallery-icon_53876-27002.jpg?semt=ais_hybrid&w=740&q=80'

    const mediaItems = React.useMemo(() => {
        if (!product?.images || product.images.length === 0) {
            return [
                { type: 'video', src: videoFile, thumbnail: videoThumb },
                { type: 'image', src: placeholderImg },
            ]
        }

        const productImages = product.images.map(src => ({
            type: 'image',
            src,
        }))

        return [
            { type: 'video', src: videoFile, thumbnail: videoThumb },
            ...productImages,
        ]
    }, [product])

    useEffect(() => {
        if (mediaItems.length > 0) {
            setCurrentMedia(mediaItems[0])
        }
    }, [mediaItems])

    if (isLoading) return <div>Đang tải hình ảnh...</div>
    if (isError)
        return (
            <div className="text-red-500">
                Lỗi tải hình: {error.message || 'Không xác định'}
            </div>
        )

    return (
        <div className="w-full">
            <div className="mb-4 aspect-square flex items-center justify-center relative bg-gray-200 border border-gray-300 w-full rounded-xl overflow-hidden">
                {!currentMedia ? (
                    <div className="text-gray-400 text-sm">
                        Đang tải hình...
                    </div>
                ) : currentMedia.type === 'image' ? (
                    <CssImageZoom src={currentMedia.src} zoomLevel={2.5} />
                ) : (
                    <video
                        src={currentMedia.src}
                        muted
                        autoPlay
                        loop
                        className="w-full h-full object-contain"
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
                    ${
                        currentMedia?.src === item.src
                            ? 'border-green-500'
                            : 'border-transparent'
                    }`}
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
