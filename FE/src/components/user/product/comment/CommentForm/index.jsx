import React, { useState } from 'react'
import { AiFillStar, AiOutlineStar } from 'react-icons/ai'
import { FiCamera } from 'react-icons/fi'
import { useAlert } from '~/contexts/AlertContext'

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

const CommentForm = ({ productSlug, onClose }) => {
    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)
    const [comment, setComment] = useState('')
    const { showAlert } = useAlert()

    const handleSubmit = () => {
        if (rating === 0) {
            showAlert('Vui lòng chọn số sao để đánh giá chất lượng sản phẩm.', {
                type: 'error',
                duration: 3000,
            })
            return
        }

        const reviewData = {
            slug: productSlug,
            rating: rating,
            content: comment,
        }

        console.log('Dữ liệu đánh giá sẽ được gửi đi:', reviewData)

        showAlert('Cảm ơn bạn đã gửi đánh giá!', {
            type: 'success',
            duration: 3000,
        })
        onClose()
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
                    placeholder="Hãy chia sẻ những trải nghiệm của bạn về sản phẩm..."
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
                    className="bg-green-600 text-white px-8 py-2 rounded hover:bg-green-600"
                >
                    Hoàn Thành
                </button>
            </div>
        </div>
    )
}

export default CommentForm
