//src/components/HotTopics.jsx
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './hotTopic.scss'

const HotTopicItem = ({ article }) => (
    <div className="group cursor-pointer">
        <div className="overflow-hidden rounded-md">
            <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-auto object-cover aspect-[4/3]"
            />
        </div>
        <h3 className="mt-2 font-bold text-gray-800 group-hover:text-green-600">
            {article.title}
        </h3>
    </div>
)

const HotTopic = ({ articles }) => {
    return (
        <section className="my-8">
            <div className="border-b-2 border-green-600 mb-4 inline-block">
                <h2 className="text-lg font-bold text-white bg-green-600 px-4 py-1 uppercase">
                    Bài viết nổi bật
                </h2>
            </div>

            <div className="relative hot-topic-swiper overflow-hidden w-full !max-w-[700px] mx-auto">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={16}
                    slidesPerView={2}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 4 },
                    }}
                    className="pb-8"
                >
                    {articles.map(article => (
                        <SwiperSlide key={article.id}>
                            <HotTopicItem article={article} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    )
}

export default HotTopic
