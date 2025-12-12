import React from 'react'

import ProductCard from '~/components/shared/ProductCard'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import './productCollection.scss'

import {
    useNewestProducts,
    usePoultryProducts,
    useSeafoodAndFishProducts,
    usePorkSpecialties,
    useRelatedProducts,
} from '~/hooks/user/useProduct'

const SingleSection = ({
    title,
    products,
    backgroundColor,
    showTitle = true,
    size = 'medium',
}) => {
    const IMAGE_BASE_URL = import.meta.env.VITE_API_BACKEND

    let displayProducts = []
    const MAX_PRODUCTS_TO_SHOW = 10

    if (products && products.coBought && products.sameCategory) {
        const coBoughtProducts = products.coBought || []
        const sameCategoryProducts = products.sameCategory || []

        const combinedList = [...coBoughtProducts]
        const remainingSlots = MAX_PRODUCTS_TO_SHOW - combinedList.length

        if (remainingSlots > 0) {
            const additionalProducts = sameCategoryProducts.slice(
                0,
                remainingSlots
            )
            combinedList.push(...additionalProducts)
        }

        displayProducts = combinedList
    } else if (Array.isArray(products)) {
        displayProducts = products
    }

    if (!displayProducts || displayProducts.length === 0) {
        return null
    }

    return (
        <section
            className={`${backgroundColor} ${showTitle && title ? 'pt-16 pb-5' : 'pb-5'}`}
        >
            <div className="container mx-auto px-4">
                {showTitle && title && (
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-green-800 uppercase">
                            {title}
                        </h2>
                        <div className="mt-2 w-24 h-1 bg-green-500 mx-auto"></div>
                    </div>
                )}

                <div
                    className={`relative swiper-container-wrapper ${size === 'small' ? 'wrapper-size-small' : ''}`}
                >
                    {displayProducts.length > 4 ? (
                        <Swiper
                            spaceBetween={20}
                            slidesPerView={4}
                            navigation={true}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true,
                            }}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            loop={displayProducts.length > 4}
                            breakpoints={{
                                320: { slidesPerView: 2, spaceBetween: 15 },
                                768: { slidesPerView: 3, spaceBetween: 20 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                            modules={[Navigation, Pagination, Autoplay]}
                            className={`newest-products-swiper ${size === 'small' ? 'swiper-size-small' : ''}`}
                        >
                            {displayProducts.map(product => (
                                <SwiperSlide key={product.id}>
                                    <ProductCard
                                        image={
                                            product.image
                                                ? `${IMAGE_BASE_URL}${product.image}`
                                                : null
                                        }
                                        name={product.name}
                                        price={product.price}
                                        oldPrice={product.oldPrice}
                                        ocop={product.ocop}
                                        rating={product.rating}
                                        reviewCount={product.reviewCount}
                                        slug={product.slug}
                                        size={size}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                            {displayProducts.map(product => (
                                <ProductCard
                                    key={product.id}
                                    image={
                                        product.image
                                            ? `${IMAGE_BASE_URL}${product.image}`
                                            : null
                                    }
                                    name={product.name}
                                    price={product.price}
                                    oldPrice={product.oldPrice}
                                    ocop={product.ocop}
                                    rating={product.rating}
                                    reviewCount={product.reviewCount}
                                    slug={product.slug}
                                    size={size}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

const SingleTypeCollection = ({
    useQueryHook,
    hookArgs = [],
    title,
    backgroundColor,
    showTitle = true,
    size = 'medium',
}) => {
    const {
        data: products,
        isLoading,
        isError,
        error,
    } = useQueryHook(...hookArgs)

    if (isLoading)
        return <div className="text-center py-20">Đang tải sản phẩm...</div>
    if (isError)
        return (
            <div className="text-center py-20 text-red-500">
                Lỗi: {error.message}
            </div>
        )

    return (
        <SingleSection
            title={title}
            products={products}
            backgroundColor={backgroundColor}
            showTitle={showTitle}
            size={size}
        />
    )
}

const AllCollections = () => {
    const newestQuery = useNewestProducts(8)
    const seafoodQuery = useSeafoodAndFishProducts(8)
    const poultryQuery = usePoultryProducts(8)
    const porkQuery = usePorkSpecialties(8)

    const queries = [newestQuery, seafoodQuery, poultryQuery, porkQuery]
    const isLoading = queries.some(q => q.isLoading)
    const isError = queries.some(q => q.isError)

    if (isLoading)
        return <div className="text-center py-20">Đang tải sản phẩm...</div>
    if (isError)
        return (
            <div className="text-center py-20 text-red-500">
                Không thể tải dữ liệu sản phẩm.
            </div>
        )

    const sections = [
        {
            id: 'newest',
            title: 'Sản Phẩm Mới Nhất',
            products: newestQuery.data,
            backgroundColor: 'bg-white',
        },
        {
            id: 'seafood',
            title: 'Hải Sản & Các Món Từ Cá',
            products: seafoodQuery.data,
            backgroundColor: 'bg-gray-100',
        },
        {
            id: 'poultry',
            title: 'Các Món Từ Gà & Vịt',
            products: poultryQuery.data,
            backgroundColor: 'bg-white',
        },
        {
            id: 'pork',
            title: 'Đặc Sản Chế Biến Từ Heo',
            products: porkQuery.data,
            backgroundColor: 'bg-gray-100',
        },
    ]

    return (
        <>
            {sections.map(section => (
                <SingleSection
                    key={section.id}
                    title={section.title}
                    products={section.products}
                    backgroundColor={section.backgroundColor}
                />
            ))}
        </>
    )
}

const COLLECTION_CONFIG = {
    newest: {
        useQueryHook: useNewestProducts,
        title: 'Sản Phẩm Mới Nhất',
        backgroundColor: 'bg-white',
        showTitle: true,
    },
    seafoodAndFish: {
        useQueryHook: useSeafoodAndFishProducts,
        title: 'Hải Sản & Các Món Từ Cá',
        backgroundColor: 'bg-gray-100',
        showTitle: true,
    },
    poultry: {
        useQueryHook: usePoultryProducts,
        title: 'Các Món Từ Gà & Vịt',
        backgroundColor: 'bg-white',
        showTitle: true,
    },
    pork: {
        useQueryHook: usePorkSpecialties,
        title: 'Đặc Sản Chế Biến Từ Heo',
        backgroundColor: 'bg-gray-100',
        showTitle: true,
    },
    related: {
        useQueryHook: useRelatedProducts,
        title: 'Có Thể Bạn Sẽ Thích',
        backgroundColor: 'bg-white',
        showTitle: false,
    },
}

const ProductCollection = ({
    type = 'all',
    relatedTo = null,
    size = 'medium',
}) => {
    if (type === 'all') {
        return <AllCollections />
    }

    const config = COLLECTION_CONFIG[type]

    if (!config) {
        console.warn(`ProductCollection type "${type}" is not defined.`)
        return null
    }

    const hookArgs = type === 'related' ? [relatedTo] : [8]

    return (
        <SingleTypeCollection
            useQueryHook={config.useQueryHook}
            hookArgs={hookArgs}
            title={config.title}
            backgroundColor={config.backgroundColor}
            showTitle={config.showTitle}
            size={size}
        />
    )
}

export default ProductCollection
