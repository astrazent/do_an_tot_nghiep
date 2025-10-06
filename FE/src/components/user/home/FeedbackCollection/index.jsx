import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import FeedbackCard from '~/components/shared/FeedbackCard'

//Import Swiper & SCSS styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './feedbackCollection.scss'

const FeedbackCollection = ({
    title = 'Cảm nhận của khách hàng',
    feedbackItems = [],
    backgroundColor = 'bg-gray-100',
}) => {
    const displayItems = feedbackItems.slice(0, 3)

    if (!feedbackItems || feedbackItems.length === 0) {
        return null
    }

    return (
        <section className={`${backgroundColor} py-16`}>
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex-1 h-px bg-green-500 max-w-32"></div>

                        <h2 className="text-3xl font-bold text-green-800 uppercase whitespace-nowrap">
                            {title}
                        </h2>

                        <div className="flex-1 h-px bg-green-500 max-w-32"></div>
                    </div>
                </div>

                <div className="relative swiper-container-wrapper">
                    {feedbackItems.length > 3 ? (
                        <Swiper
                            spaceBetween={30}
                            slidesPerView={1}
                            navigation={true}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            loop={true}
                            breakpoints={{
                                768: { slidesPerView: 2, spaceBetween: 20 },
                                1024: { slidesPerView: 3, spaceBetween: 30 },
                            }}
                            modules={[Navigation, Pagination, Autoplay]}
                            className="customer-feedback-swiper"
                        >
                            {feedbackItems.map(item => (
                                <SwiperSlide key={item.id}>
                                    <div className="flex justify-center items-center h-full p-2">
                                        <FeedbackCard
                                            avatar={item.avatar}
                                            name={item.name}
                                            location={item.location}
                                            feedback={item.feedback}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {displayItems.map(item => (
                                <FeedbackCard
                                    key={item.id}
                                    avatar={item.avatar}
                                    name={item.name}
                                    location={item.location}
                                    feedback={item.feedback}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default FeedbackCollection
