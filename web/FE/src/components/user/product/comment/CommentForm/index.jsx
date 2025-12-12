import React, { useState, useEffect } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { FiCamera } from 'react-icons/fi'
import { useAlert } from '~/contexts/AlertContext'
import { useCreateCommentByProductSlug } from '~/hooks/user/useComment'
import { useUpdateCommentByProductSlug } from '~/hooks/user/useComment'
import { useCurrentUser } from '~/hooks/user/useUser'
const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <span
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        className="cursor-pointer transition-transform hover:scale-110"
    >
        {filled ? (
            <AiFillStar className="text-yellow-400 w-8 h-8" />
        ) : (
            <AiOutlineStar className="text-gray-300 w-8 h-8" />
        )}
    </span>
)

const CommentForm = ({
    productSlug,
    onClose,
    onCommentSubmitted,
    existingComment,
}) => {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState('')
    const { showAlert } = useAlert()
    const { user, isAuthenticated, loading: userLoading } = useCurrentUser()
    const userId = user?.user_id || null
    const { mutate: createComment, isLoading: creating } =
        useCreateCommentByProductSlug(productSlug)
    const { mutate: updateComment, isLoading: updating } =
        useUpdateCommentByProductSlug(productSlug)
    const isLoading = creating || updating

    useEffect(() => {
        if (existingComment) {
            setRating(existingComment.rate || 0)
            setComment(existingComment.content || '')
        }
    }, [existingComment])

    const handleSubmit = () => {
        if (!isAuthenticated || !userId) {
            showAlert('Bạn cần đăng nhập để gửi đánh giá.', {
                type: 'error',
                duration: 3000,
            })
            return
        }
        if (rating === 0) {
            showAlert('Vui lòng chọn số sao để đánh giá chất lượng sản phẩm.', {
                type: 'error',
                duration: 3000,
            })
            return
        }

        const payload = {
            user_id: userId,
            rate: rating,
            content: comment,
        }

        if (existingComment) {
            updateComment(payload, {
                onSuccess: () => {
                    showAlert('Đã cập nhật đánh giá!', {
                        type: 'success',
                        duration: 3000,
                    })
                    if (onCommentSubmitted) onCommentSubmitted()
                    onClose()
                },
                onError: err => {
                    showAlert(`Có lỗi xảy ra: ${err.message}`, {
                        type: 'error',
                        duration: 3000,
                    })
                },
            })
        } else {
            createComment(
                { ...payload, slug: productSlug },
                {
                    onSuccess: () => {
                        showAlert('Cảm ơn bạn đã gửi đánh giá!', {
                            type: 'success',
                            duration: 3000,
                        })
                        if (onCommentSubmitted) onCommentSubmitted()
                        onClose()
                    },
                    onError: err => {
                        showAlert(`Có lỗi xảy ra: ${err.message}`, {
                            type: 'error',
                            duration: 3000,
                        })
                    },
                }
            )
        }
    }

    return (
        <div className="bg-white p-6 md:p-8 max-w-2xl w-full mx-auto font-sans rounded-lg shadow-xl">
            <h1 className="text-2xl font-bold mb-4">Đánh Giá Sản Phẩm</h1>

            <div className="flex items-center mb-6">
                <img
                    src="https://via.placeholder.com/60"
                    alt="Product"
                    className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4 text-gray-600">
                    <p>Sản phẩm: {productSlug}</p>
                </div>
            </div>

            <div className="flex items-center mb-6">
                <p className="mr-4 text-lg">Chất lượng sản phẩm</p>
                <div className="flex items-center">
                    {[...Array(5)].map((_, index) => {
                        const ratingValue = index + 1
                        return (
                            <StarIcon
                                key={index}
                                filled={ratingValue <= (hover || rating)}
                                onClick={() => setRating(ratingValue)}
                                onMouseEnter={() => setHover(ratingValue)}
                                onMouseLeave={() => setHover(0)}
                            />
                        )
                    })}
                </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4">
                <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    className="w-full h-32 p-2 outline-none resize-none"
                    placeholder={
                        existingComment
                            ? ''
                            : 'Hãy chia sẻ những trải nghiệm của bạn về sản phẩm...'
                    }
                ></textarea>
            </div>

            <div className="flex space-x-4 my-6">
                <button
                    style={{
                        border: '2px solid #16a34a',
                        padding: '0.375rem 0.5rem',
                        borderRadius: '2px',
                    }}
                    className="
                        flex items-center gap-1
                        bg-green-100/50
                        text-green-700 text-sm font-medium
                        hover:bg-green-100
                        transition
                    "
                >
                    <FiCamera className="w-4 h-4" />
                    Thêm Hình ảnh
                </button>
            </div>

            <div className="flex justify-end items-center space-x-4">
                <button
                    onClick={onClose}
                    className="px-6 py-2 rounded uppercase text-gray-600 hover:bg-gray-100"
                >
                    TRỞ LẠI
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className={`bg-green-600 text-white px-8 py-2 rounded hover:bg-green-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? 'Đang gửi...' : 'Hoàn Thành'}
                </button>
            </div>
        </div>
    )
}

export default CommentForm
