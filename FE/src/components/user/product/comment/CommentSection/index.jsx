import React from 'react'
import {
    FaStar,
    FaThumbsUp,
    FaThumbsDown,
    FaRobot,
    FaStarHalf,
} from 'react-icons/fa'
import plusIcon from '~/assets/icon/stuff/positive.png'
import minusIcon from '~/assets/icon/stuff/negative.png'
import PageComment from '../CommentList'

const reviewData = {
    averageRating: 4.7,
    totalReviews: 283,
    ratingDistribution: [
        { stars: 5, count: 236 },
        { stars: 4, count: 32 },
        { stars: 3, count: 6 },
        { stars: 2, count: 4 },
        { stars: 1, count: 5 },
    ],
    aiSummary: {
        product: {
            positive: [
                'Chất lượng giấy tốt, sách đẹp, trình bày rõ ràng.',
                'Nội dung sách hay, bổ ích, ý nghĩa.',
                'Sản phẩm đúng mô tả, không lỗi phông chữ.',
            ],
            negative: [
                'Một số nội dung không hấp dẫn, lan man, không như mong đợi.',
            ],
            positiveCount: 24,
            negativeCount: 6,
        },
        service: {
            positive: [
                'Giao hàng nhanh, đúng hẹn.',
                'Đóng gói cẩn thận, kỹ càng.',
                'Nhân viên giao hàng thân thiện, nhiệt tình.',
            ],
            negative: [],
            positiveCount: 20,
            negativeCount: 0,
        },
    },
    filters: [
        'Mới nhất',
        'Có hình ảnh',
        'Đã mua hàng',
        '5 sao',
        '4 sao',
        '3 sao',
        '2 sao',
        '1 sao',
    ],
}

const StarRating = ({ rating }) => {
    const totalStars = 5
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0)

    return (
        <div className="flex items-center">
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={`full-${i}`} className="text-yellow-500" />
            ))}

            {halfStar && <FaStarHalf className="text-yellow-500" />}

            {[...Array(emptyStars)].map((_, i) => (
                <FaStar key={`empty-${i}`} className="text-gray-300" />
            ))}
        </div>
    )
}

const CommentSection = () => {
    const {
        averageRating,
        totalReviews,
        ratingDistribution,
        aiSummary,
        filters,
    } = reviewData

    const maxCount = Math.max(...ratingDistribution.map(item => item.count), 1)

    return (
        <div className="pt-8 border-t">
            <h2 className="text-xl font-bold mb-10 flex items-center uppercase">
                <span className="w-1 h-6 bg-green-600 mr-2 inline-block"></span>
                Tổng quan đánh giá
            </h2>
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl font-bold">
                            {averageRating}
                        </div>
                        <div>
                            <StarRating rating={averageRating} />
                            <p className="text-gray-600 text-sm">
                                ({totalReviews} đánh giá)
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2 w-3/4">
                        {ratingDistribution.map(item => (
                            <div
                                key={item.stars}
                                className="flex items-center gap-2 text-sm"
                            >
                                <span className="flex items-center">
                                    {item.stars}{' '}
                                    <FaStar className="text-yellow-500 ml-1" />
                                </span>
                                <div className="flex-grow bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{
                                            width: `${(item.count / maxCount) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="w-8 text-right text-gray-600">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <FaRobot className="text-green-600" />
                        Trợ lý AI tổng hợp từ các đánh giá mới nhất
                    </h3>
                    <div className="text-sm space-y-4">
                        <div>
                            <p className="font-semibold">
                                Về sản phẩm:{' '}
                                <span className="font-normal text-gray-600">
                                    ({aiSummary.product.positiveCount} tích cực,{' '}
                                    {aiSummary.product.negativeCount} tiêu cực)
                                </span>
                            </p>
                            <ul className="mt-1 list-inside">
                                {aiSummary.product.positive.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start text-green-700"
                                    >
                                        <img
                                            src={plusIcon}
                                            alt="Plus"
                                            className="w-4 h-4 mr-2 mt-1"
                                        />
                                        <span className="text-gray-800">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                                {aiSummary.product.negative.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start text-red-600"
                                    >
                                        <img
                                            src={minusIcon}
                                            alt="Minus"
                                            className="w-4 h-4 mr-2 mt-1"
                                        />
                                        <span className="text-gray-800">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p className="font-semibold">
                                Về dịch vụ:{' '}
                                <span className="font-normal text-gray-600">
                                    ({aiSummary.service.positiveCount} tích cực,{' '}
                                    {aiSummary.service.negativeCount} tiêu cực)
                                </span>
                            </p>
                            <ul className="mt-1 list-inside">
                                {aiSummary.service.positive.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start text-green-700"
                                    >
                                        <img
                                            src={plusIcon}
                                            alt="Plus"
                                            className="w-4 h-4 mr-2 mt-1"
                                        />
                                        <span className="text-gray-800">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                                {aiSummary.service.negative.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start text-red-600"
                                    >
                                        <img
                                            src={minusIcon}
                                            alt="Minus"
                                            className="w-4 h-4 mr-2 mt-1"
                                        />
                                        <span className="text-gray-800">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button
                            style={{ border: '1px solid #d1d5db' }}
                            className="p-2 rounded-md hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors duration-200"
                        >
                            <FaThumbsUp />
                        </button>
                        <button
                            style={{ border: '1px solid #d1d5db' }}
                            className="p-2 rounded-md hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors duration-200"
                        >
                            <FaThumbsDown />
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Lọc theo</h3>
                <div className="flex flex-wrap gap-2">
                    {filters.map((filter, i) => (
                        <button
                            key={i}
                            style={{ border: '1px solid #d1d5db' }}
                            className="px-4 py-2 rounded-full text-sm hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <PageComment />
        </div>
    )
}

export default CommentSection
