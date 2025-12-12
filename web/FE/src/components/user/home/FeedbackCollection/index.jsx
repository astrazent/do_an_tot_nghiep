import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import FeedbackCard from '~/components/shared/FeedbackCard'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './feedbackCollection.scss'

import damVinhHungAvatar from '~/assets/image/shared/layout/avatar/dam-vinh-hung.png'
import hoaiLinhAvatar from '~/assets/image/shared/layout/avatar/hoai-linh.png'
import ngocTrinhAvatar from '~/assets/image/shared/layout/avatar/ngoc-trinh.png'
import quangLinhAvatar from '~/assets/image/shared/layout/avatar/quang-linh.png'
import thuyTienAvatar from '~/assets/image/shared/layout/avatar/thuy-tien.png'

const customerFeedback = [
    {
        id: 'cfb01',
        name: 'Ca sĩ Đàm Vĩnh Hưng',
        location: 'TP. Hồ Chí Minh',
        avatar: damVinhHungAvatar,
        feedback:
            'Các món đặc sản ở đây rất tinh tế và đặc sắc. Hưng đã dùng để đãi bạn bè trong một buổi tiệc nhỏ và ai cũng phải tấm tắc khen ngợi. Chắc chắn sẽ là khách hàng thân thiết!',
    },
    {
        id: 'cfb02',
        name: 'NSƯT Hoài Linh',
        location: 'TP. Hồ Chí Minh',
        avatar: hoaiLinhAvatar,
        feedback:
            'Mấy món ăn ở đây đậm đà hương vị quê nhà, ăn một miếng là nhớ cả tuổi thơ. Món nào cũng được chế biến kỹ lưỡng, sạch sẽ. Bà con ai muốn ăn đồ ngon thì cứ ghé đây!',
    },
    {
        id: 'cfb03',
        name: 'Người mẫu Ngọc Trinh',
        location: 'TP. Hồ Chí Minh',
        avatar: ngocTrinhAvatar,
        feedback:
            'Dù bận rộn nhưng Trinh vẫn muốn tự tay chuẩn bị bữa ăn ngon cho mình. Các món ăn sẵn ở đây vừa tiện lợi lại vừa ngon miệng, giúp Trinh tiết kiệm được rất nhiều thời gian.',
    },
    {
        id: 'cfb04',
        name: 'Vlogger Quang Linh',
        location: 'Châu Phi & Việt Nam',
        avatar: quangLinhAvatar,
        feedback:
            'Linh đã mang mấy món đặc sản này sang Châu Phi để giới thiệu cho team. Ai cũng thích mê hương vị Việt Nam. Cảm ơn shop đã có những sản phẩm chất lượng.',
    },
    {
        id: 'cfb05',
        name: 'Hoa hậu Thùy Tiên',
        location: 'TP. Hồ Chí Minh',
        avatar: thuyTienAvatar,
        feedback:
            'Tiên rất chú trọng đến những bữa ăn gia đình. Các sản phẩm ở đây không chỉ ngon mà còn đảm bảo vệ sinh, giúp Tiên an tâm chuẩn bị những món ăn ấm cúng cho cả nhà.',
    },
]

const FeedbackCollection = () => {
    const title = 'Cảm nhận của khách hàng'
    const backgroundColor = 'bg-white'

    const displayItems = customerFeedback.slice(0, 3)

    if (!customerFeedback || customerFeedback.length === 0) {
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
                    {customerFeedback.length > 3 ? (
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
                            {customerFeedback.map(item => (
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
