import React, { useMemo, useState, useEffect } from 'react'
import {
    FaStar,
    FaStarHalf,
    FaRobot,
    FaThumbsUp,
    FaThumbsDown,
} from 'react-icons/fa'
import plusIcon from '~/assets/icon/stuff/positive.png'
import minusIcon from '~/assets/icon/stuff/negative.png'
import PageComment from '../CommentList'
import { useCommentsByProductSlug } from '~/hooks/user/useComment'
import { usePostCommentAI } from '~/hooks/user/useAI'
import { useCurrentUser } from '~/hooks/user/useUser'
import { usePostAIFeedbackByProductSlug } from '~/hooks/user/useAIFeedback'

import { useTransactionByEmailAndSlug } from '~/hooks/user/useTransaction'

import CommentForm from '../CommentForm'
import { useAlert } from '~/contexts/AlertContext'

const filters = [
    'Mới nhất',
    'Có hình ảnh',
    '5 sao',
    '4 sao',
    '3 sao',
    '2 sao',
    '1 sao',
]

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

const CommentSection = ({ slug }) => {
    const { data: rawData, isLoading, isError } = useCommentsByProductSlug(slug)
    const [activeFilter, setActiveFilter] = useState('Mới nhất')
    const [aiSummaryData, setAiSummaryData] = useState(null)
    const { showAlert } = useAlert()
    const [voted, setVoted] = useState(null)
    const [feedbackId, setFeedbackId] = useState(null)
    const { user, isAuthenticated } = useCurrentUser()
    const { mutate: postAIFeedback, isPending: isPostingFeedback } =
        usePostAIFeedbackByProductSlug()

    const [showReviewForm, setShowReviewForm] = useState(false)

    const { data: transactionData, isSuccess: transactionIsSuccess } =
        useTransactionByEmailAndSlug(isAuthenticated ? user.email : null, slug)

    const hasPurchased = useMemo(() => {
        return (
            transactionIsSuccess &&
            Array.isArray(transactionData) &&
            transactionData.length > 0
        )
    }, [transactionIsSuccess, transactionData])

    const {
        mutate: summarizeAI,
        data: aiSummaryResult,
        isPending: isAiSummarizing,
        isError: aiError,
    } = usePostCommentAI(slug)

    const comments = useMemo(() => {
        if (Array.isArray(rawData)) {
            return rawData
        }
        return rawData?.data || []
    }, [rawData])

    useEffect(() => {
        if (showReviewForm) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }

        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [showReviewForm])

    useEffect(() => {
        if (comments && comments.length > 0 && !aiSummaryData) {
            summarizeAI(comments)
        }
    }, [comments, summarizeAI, aiSummaryData])

    useEffect(() => {
        if (aiSummaryResult?.data?.summary) {
            setAiSummaryData(aiSummaryResult.data.summary)
        }
    }, [aiSummaryResult])

    const formattedComments = useMemo(() => {
        if (!comments || comments.length === 0) return []
        return comments.map(comment => {
            const apiBaseUrl =
                import.meta.env.VITE_API_BACKEND || 'http://localhost:2082'
            const absoluteAvatarUrl = comment.avatar_url
                ? comment.avatar_url.startsWith('http')
                    ? comment.avatar_url
                    : `${apiBaseUrl}${comment.avatar_url}`
                : 'https://i.pravatar.cc/150?u=default-user'

            return {
                id: comment.id,
                user_id: comment.user_id,
                product_id: comment.product_id,
                rating: comment.rate,
                comment: comment.content,
                date: new Date(comment.created_at).toLocaleDateString('vi-VN'),
                author: comment.full_name || 'Người dùng ẩn danh',
                avatar: absoluteAvatarUrl,
                likes: comment.likes || 0,
                dislikes: comment.dislikes || 0,
                isVerified: true,
                images: comment.images || [],
            }
        })
    }, [comments])

    const filteredComments = useMemo(() => {
        switch (activeFilter) {
            case 'Mới nhất':
                return formattedComments
            case 'Có hình ảnh':
                return formattedComments.filter(
                    c => c.images && c.images.length > 0
                )
            case '5 sao':
                return formattedComments.filter(c => c.rating === 5)
            case '4 sao':
                return formattedComments.filter(c => c.rating === 4)
            case '3 sao':
                return formattedComments.filter(c => c.rating === 3)
            case '2 sao':
                return formattedComments.filter(c => c.rating === 2)
            case '1 sao':
                return formattedComments.filter(c => c.rating === 1)
            default:
                return formattedComments
        }
    }, [formattedComments, activeFilter])

    const reviewStats = useMemo(() => {
        if (!comments || comments.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: [
                    { stars: 5, count: 0 },
                    { stars: 4, count: 0 },
                    { stars: 3, count: 0 },
                    { stars: 2, count: 0 },
                    { stars: 1, count: 0 },
                ],
            }
        }

        const totalReviews = comments.length
        const ratingSum = comments.reduce(
            (sum, comment) => sum + comment.rate,
            0
        )
        const averageRating =
            totalReviews > 0
                ? parseFloat((ratingSum / totalReviews).toFixed(1))
                : 0

        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        comments.forEach(c => {
            if (distribution[c.rate] !== undefined) {
                distribution[c.rate]++
            }
        })

        const ratingDistribution = Object.keys(distribution)
            .map(key => ({
                stars: parseInt(key),
                count: distribution[key],
            }))
            .sort((a, b) => b.stars - a.stars)

        return { averageRating, totalReviews, ratingDistribution }
    }, [comments])

    const handleFeedback = voteType => {
        if (isPostingFeedback) {
            return
        }
        const isUndoAction = voted === voteType
        const previousVote = voted
        setVoted(isUndoAction ? null : voteType)

        const payload = {
            id: null,
            slug,
            vote: voteType === 'up' ? 1 : 0,
            voter_id: null,
        }
        if (isAuthenticated) {
            payload.voter_id = user.user_id
        }

        if (feedbackId) {
            payload.id = feedbackId
        }

        if (isUndoAction && !feedbackId) {
            console.error(
                'Không thể undo khi chưa có feedback ID. Hoàn tác UI.'
            )
            setVoted(previousVote)
            return
        }
        postAIFeedback(payload, {
            onSuccess: response => {
                if (isUndoAction) {
                    setFeedbackId(null)
                } else {
                    const newId = response?.data?.id
                    if (newId) {
                        setFeedbackId(newId)
                    }
                }
            },
            onError: error => {
                console.error('Hành động thất bại, hoàn tác UI.', error)
                setVoted(previousVote)
                showAlert('Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.', {
                    type: 'error',
                    duration: 3000,
                })
            },
        })
    }

    const { averageRating, totalReviews, ratingDistribution } = reviewStats

    if (isLoading) {
        return <div className="pt-8 border-t">Đang tải đánh giá...</div>
    }

    if (isError) {
        return (
            <div className="pt-8 border-t text-red-500">
                Lỗi khi tải đánh giá.
            </div>
        )
    }

    if (totalReviews === 0) {
        return (
            <div className="pt-8 border-t">
                <h2 className="text-xl font-bold mb-4 flex items-center uppercase">
                    <span className="w-1 h-6 bg-green-600 mr-2 inline-block"></span>
                    Đánh giá sản phẩm
                </h2>
                <p className="text-gray-600">
                    Chưa có đánh giá nào cho sản phẩm này.
                </p>
                {}
                {}
                {isAuthenticated && hasPurchased && (
                    <div className="mt-6">
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Hãy là người đầu tiên đánh giá
                        </button>
                    </div>
                )}
                {showReviewForm && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                        onClick={() => setShowReviewForm(false)}
                    >
                        <div onClick={e => e.stopPropagation()}>
                            {' '}
                            {}
                            <CommentForm
                                productSlug={slug}
                                onClose={() => setShowReviewForm(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="pt-8 border-t">
            <h2 className="text-xl font-bold mb-10 flex items-center uppercase">
                <span className="w-1 h-6 bg-green-600 mr-2 inline-block"></span>
                Tổng quan đánh giá
            </h2>
            <div className="flex flex-col md:flex-row gap-8">
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
                    <div className="mt-4 space-y-2 w-full lg:w-3/4">
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
                                            width: `${(item.count / totalReviews) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="w-8 text-right text-gray-600">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                    </div>

                    {isAuthenticated && hasPurchased && (
                        <div className="mt-6">
                            {}
                            <button
                                onClick={() => setShowReviewForm(true)}
                                className="bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            >
                                Viết đánh giá của bạn
                            </button>
                            {}
                        </div>
                    )}
                    {showReviewForm && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                            onClick={() => setShowReviewForm(false)}
                        >
                            <div onClick={e => e.stopPropagation()}>
                                {' '}
                                {}
                                <CommentForm
                                    productSlug={slug}
                                    onClose={() => setShowReviewForm(false)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full md:w-1/2">
                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                        <FaRobot className="text-green-600" />
                        Trợ lý AI tổng hợp
                    </h3>

                    {isAiSummarizing && (
                        <div className="p-4 border rounded-lg bg-gray-50 text-sm text-gray-600">
                            <p>
                                AI đang phân tích và tổng hợp từ các đánh giá
                                mới nhất, vui lòng đợi trong giây lát...
                            </p>
                        </div>
                    )}

                    {aiError && (
                        <div className="p-4 border rounded-lg bg-red-50 text-sm text-red-700">
                            <p>
                                Rất tiếc, đã xảy ra lỗi khi tổng hợp đánh giá
                                bằng AI. Vui lòng thử lại sau.
                            </p>
                        </div>
                    )}

                    {aiSummaryData && !isAiSummarizing && !aiError && (
                        <div className="transition-opacity duration-500 ease-in-out">
                            <div className="text-sm space-y-4">
                                <div>
                                    <p className="font-semibold">
                                        Về sản phẩm:
                                        <span className="font-normal text-gray-600">
                                            {' '}
                                            (
                                            {
                                                aiSummaryData.product
                                                    .positiveCount
                                            }{' '}
                                            tích cực,{' '}
                                            {
                                                aiSummaryData.product
                                                    .negativeCount
                                            }{' '}
                                            tiêu cực)
                                        </span>
                                    </p>
                                    <ul className="mt-1 list-inside">
                                        {aiSummaryData.product.positive.map(
                                            (item, i) => (
                                                <li
                                                    key={`prod-pos-${i}`}
                                                    className="flex items-start text-green-700"
                                                >
                                                    <img
                                                        src={plusIcon}
                                                        alt="Plus"
                                                        className="w-4 h-4 mr-2 mt-1 flex-shrink-0"
                                                    />
                                                    <span className="text-gray-800">
                                                        {item}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                        {aiSummaryData.product.negative.map(
                                            (item, i) => (
                                                <li
                                                    key={`prod-neg-${i}`}
                                                    className="flex items-start text-red-600"
                                                >
                                                    <img
                                                        src={minusIcon}
                                                        alt="Minus"
                                                        className="w-4 h-4 mr-2 mt-1 flex-shrink-0"
                                                    />
                                                    <span className="text-gray-800">
                                                        {item}
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                                {(aiSummaryData.service.positive.length > 0 ||
                                    aiSummaryData.service.negative.length >
                                        0) && (
                                    <div>
                                        <p className="font-semibold">
                                            Về dịch vụ:
                                            <span className="font-normal text-gray-600">
                                                {' '}
                                                (
                                                {
                                                    aiSummaryData.service
                                                        .positiveCount
                                                }{' '}
                                                tích cực,{' '}
                                                {
                                                    aiSummaryData.service
                                                        .negativeCount
                                                }{' '}
                                                tiêu cực)
                                            </span>
                                        </p>
                                        <ul className="mt-1 list-inside">
                                            {aiSummaryData.service.positive.map(
                                                (item, i) => (
                                                    <li
                                                        key={`serv-pos-${i}`}
                                                        className="flex items-start text-green-700"
                                                    >
                                                        <img
                                                            src={plusIcon}
                                                            alt="Plus"
                                                            className="w-4 h-4 mr-2 mt-1 flex-shrink-0"
                                                        />
                                                        <span className="text-gray-800">
                                                            {item}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                            {aiSummaryData.service.negative.map(
                                                (item, i) => (
                                                    <li
                                                        key={`serv-neg-${i}`}
                                                        className="flex items-start text-red-600"
                                                    >
                                                        <img
                                                            src={minusIcon}
                                                            alt="Minus"
                                                            className="w-4 h-4 mr-2 mt-1 flex-shrink-0"
                                                        />
                                                        <span className="text-gray-800">
                                                            {item}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button
                                    title="Hữu ích"
                                    onClick={() => handleFeedback('up')}
                                    disabled={isPostingFeedback}
                                    style={{ border: '1px solid #d1d5db' }}
                                    className={`p-2 rounded-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                                        voted === 'up'
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                                    }`}
                                >
                                    <FaThumbsUp />
                                </button>
                                <button
                                    title="Không hữu ích"
                                    onClick={() => handleFeedback('down')}
                                    disabled={isPostingFeedback}
                                    style={{ border: '1px solid #d1d5db' }}
                                    className={`p-2 rounded-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                                        voted === 'down'
                                            ? 'bg-red-600 text-white border-red-600'
                                            : 'hover:bg-red-50 hover:text-red-600 hover:border-red-300'
                                    }`}
                                >
                                    <FaThumbsDown />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Lọc theo</h3>
                <div className="flex flex-wrap gap-2">
                    {filters.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`px-4 py-2 rounded-full text-sm !border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                    ${
                        activeFilter === filter
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 !border-gray-300 hover:bg-green-50 hover:text-green-700 hover:border-green-400'
                    }`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
            </div>

            <PageComment comments={filteredComments} slug={slug} />
        </div>
    )
}

export default CommentSection
