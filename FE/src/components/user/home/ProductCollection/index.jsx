import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import ProductCard from '~/components/shared/ProductCard'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './productCollection.scss'

const ProductCollection = ({
    title = 'Sản phẩm',
    products = [],
    backgroundColor = 'bg-white',
    autoPlay = true,
}) => {
    const displayProducts = products.slice(0, 4)

    if (!products || products.length === 0) {
        return null
    }

    return (
        <section
            className={`${backgroundColor} ${title ? 'pt-16 pb-5' : 'pb-5'}`}
        >
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-800 uppercase">
                        {title}
                    </h2>
                    {title && (
                        <div className="mt-2 w-24 h-1 bg-green-500 mx-auto"></div>
                    )}
                </div>

                <div className="relative swiper-container-wrapper">
                    {products.length > 4 ? (
                        <Swiper
                            spaceBetween={1}
                            slidesPerView={'auto'}
                            navigation={true}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            autoplay={
                                autoPlay
                                    ? {
                                          delay: 4000,
                                          disableOnInteraction: false,
                                      }
                                    : false
                            }
                            loop={true}
                            breakpoints={{
                                640: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                                1280: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                            modules={[Navigation, Pagination, Autoplay]}
                            className="newest-products-swiper"
                            onSwiper={swiper => {
                                const el = swiper.el
                                el.addEventListener('mouseenter', () =>
                                    swiper.autoplay.stop()
                                )
                                el.addEventListener('mouseleave', () =>
                                    swiper.autoplay.start()
                                )
                            }}
                        >
                            {products.map(product => (
                                <SwiperSlide key={product.id}>
                                    <div className="flex justify-center items-center h-full">
                                        <ProductCard
                                            image={product.image}
                                            name={product.name}
                                            price={product.price}
                                            oldPrice={product.oldPrice}
                                            ocop={product.ocop}
                                            rating={product.rating}
                                            reviewCount={product.reviewCount}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {displayProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    oldPrice={product.oldPrice}
                                    ocop={product.ocop}
                                    rating={product.rating}
                                    reviewCount={product.reviewCount}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ProductCollection
