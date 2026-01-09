import React, { useState, useEffect, useRef, useCallback } from 'react'
import { AiFillStar, AiOutlineStar, AiFillCloseCircle } from 'react-icons/ai'
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

    // State để lưu trữ cả ảnh mới upload và ảnh cũ (dưới dạng URL)
    // Mỗi item sẽ có dạng { id?: number, file?: File, preview: string, url?: string }
    // 'id' sẽ có nếu là ảnh cũ, 'file' sẽ có nếu là ảnh mới upload
    const [images, setImages] = useState([])

    const fileInputRef = useRef(null)

    const { showAlert } = useAlert()
    const { user, isAuthenticated, loading: userLoading } = useCurrentUser()
    const userId = user?.user_id || null

    const { mutate: createComment, isLoading: creating } =
        useCreateCommentByProductSlug(productSlug)
    const { mutate: updateComment, isLoading: updating } =
        useUpdateCommentByProductSlug(productSlug)
    const isLoading = creating || updating

    // Hàm xử lý việc thêm ảnh cũ vào state
    const addExistingImage = useCallback((imageUrl, imageId) => {
        setImages(prevImages => [
            ...prevImages,
            {
                id: imageId, // Lưu ID của ảnh cũ, cần thiết cho việc cập nhật
                url: imageUrl, // URL gốc của ảnh cũ
                preview: imageUrl, // Sử dụng URL gốc làm preview ban đầu
                file: null, // Không có file vật lý cho ảnh cũ
            },
        ])
    }, [])

    // Effect để nạp dữ liệu cũ khi component mount hoặc existingComment thay đổi
    useEffect(() => {
        if (existingComment) {
            setRating(existingComment.rate || 0)
            setComment(existingComment.content || '')

            // Xóa các ảnh cũ đã tồn tại trong state trước khi nạp ảnh mới
            // để tránh trùng lặp nếu existingComment được cập nhật nhiều lần
            setImages([])

            if (existingComment.images && existingComment.images.length > 0) {
                existingComment.images.forEach(imgObj => {
                if (
                    imgObj &&
                    imgObj.id &&
                    typeof imgObj.url === 'string' &&
                    imgObj.url.trim() !== ''
                ) {
                    addExistingImage(imgObj.url, imgObj.id)
                }
                })
            }
        } else {
            // Reset form nếu không có existingComment (ví dụ: khi đóng mở lại form)
            setRating(0)
            setComment('')
            setImages([])
        }
    }, [existingComment, addExistingImage]) // Thêm addExistingImage vào dependency array

    // Cleanup URL preview để tránh rò rỉ bộ nhớ khi component unmount hoặc ảnh thay đổi
    useEffect(() => {
        // Chỉ revokeObjectURL cho các ảnh là preview từ file mới upload
        const newImagePreviews = images
            .filter(img => img.file) // Chỉ những ảnh có 'file' là ảnh mới upload
            .map(img => img.preview)

        return () => {
            newImagePreviews.forEach(url => URL.revokeObjectURL(url))
        }
    }, [images]) // Chạy lại khi images thay đổi

    const handleImageChange = e => {
        const files = Array.from(e.target.files)

        // Lọc ra chỉ những ảnh mới được chọn, giữ lại các ảnh cũ
        const currentNewImages = files.map(file => ({
            file: file,
            preview: URL.createObjectURL(file),
            id: undefined, // Không có ID vì là ảnh mới
            url: undefined, // Không có URL gốc vì là ảnh mới
        }))

        // Kiểm tra tổng số ảnh (ảnh hiện có + ảnh mới chọn)
        if (images.length + currentNewImages.length > 4) {
            showAlert('Bạn chỉ được chọn tối đa 4 hình ảnh.', {
                type: 'error',
                duration: 3000,
            })
            return
        }

        const validImages = []
        for (const fileObj of currentNewImages) {
            const file = fileObj.file
            // Kiểm tra định dạng
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
                showAlert(
                    `File ${file.name} không đúng định dạng cho phép (JPG, PNG).`,
                    {
                        type: 'error',
                        duration: 3000,
                    }
                )
                continue // Bỏ qua file này
            }
            validImages.push(fileObj)
        }

        setImages(prev => [...prev, ...validImages])

        e.target.value = null // Reset input file
    }

    const removeImage = indexToRemove => {
        setImages(prev => {
            const removedImage = prev[indexToRemove]
            const newImages = prev.filter((_, index) => index !== indexToRemove)

            // Chỉ revokeObjectURL nếu là ảnh mới upload (có 'file')
            if (removedImage.file) {
                URL.revokeObjectURL(removedImage.preview)
            }

            return newImages
        })
    }

    const handleSubmit = () => {
        if (!isAuthenticated || !userId) {
            showAlert('Bạn cần đăng nhập để gửi đánh giá.', {
                type: 'error',
                duration: 3000,
            })
            return
        }

        if (!rating || rating === 0) {
            showAlert('Số sao không được để trống.', {
                type: 'error',
                duration: 3000,
            })
            return
        }

        if (!comment || comment.trim() === '') {
            showAlert('Nội dung bình luận không được để trống.', {
                type: 'error',
                duration: 3000,
            })
            return
        }

        const formData = new FormData()
        formData.append('user_id', userId)
        formData.append('rate', rating)
        formData.append('content', comment)

        // Xử lý logic cho UPDATE hoặc CREATE
        if (existingComment) {
            formData.append('id', existingComment.id)
            
            // --- PHẦN THÊM MỚI: Xử lý keep_image_ids ---
            // Lọc ra các ảnh cũ (có thuộc tính id) còn lại trong danh sách images
            const keepImageIds = images
                .filter(img => img.id !== undefined && img.id !== null)
                .map(img => img.id)

            // Append từng ID vào formData
            // Lưu ý: Key thường là 'keep_image_ids[]' cho PHP/Laravel hoặc 'keep_image_ids' cho Node/Java
            // Tùy backend của bạn quy định. Ở đây mình để 'keep_image_ids[]'.
            keepImageIds.forEach(id => {
                formData.append('keep_image_ids[]', id)
            })
            // -------------------------------------------

        } else {
            // Thêm slug cho comment mới
            formData.append('slug', productSlug)
        }

        // Đính kèm các file ảnh MỚI được upload (có thuộc tính file)
        images.forEach((img) => {
            if (img.file) { 
                formData.append('images', img.file)
            }
        })

        const handleSuccess = () => {
            showAlert(
                existingComment
                    ? 'Đã cập nhật đánh giá!'
                    : 'Cảm ơn bạn đã gửi đánh giá!',
                {
                    type: 'success',
                    duration: 3000,
                }
            )
            onCommentSubmitted?.()
            onClose()
        }

        const handleError = err => {
            console.error('Lỗi khi gửi đánh giá:', err)
            showAlert(`Có lỗi xảy ra: ${err?.response?.data?.message || err.message || 'Vui lòng thử lại'}`, {
                type: 'error',
                duration: 3000,
            })
        }

        if (existingComment) {
            updateComment(formData, {
                onSuccess: handleSuccess,
                onError: handleError,
            })
        } else {
            createComment(formData, {
                onSuccess: handleSuccess,
                onError: handleError,
            })
        }
    }

    // Hàm này sẽ render các hình ảnh, phân biệt ảnh cũ và ảnh mới
    const renderImagePreview = (img, index) => (
        <div
            key={index}
            className="relative w-20 h-20 border rounded overflow-hidden group"
        >
            <img
                src={img.preview} // img.preview luôn tồn tại, là URL của ảnh (cũ hoặc mới)
                alt="preview"
                className="w-full h-full object-cover"
            />
            <button
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 text-red-500 bg-white rounded-full shadow-md hover:text-red-700 transition"
                style={{ padding: 0 }}
            >
                <AiFillCloseCircle className="w-5 h-5" />
            </button>
        </div>
    )

    return (
        <div className="bg-white p-6 md:p-8 max-w-2xl w-full mx-auto font-sans rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
            <h1 className="text-2xl font-bold mb-4">
                {existingComment ? 'Sửa Đánh Giá Sản Phẩm' : 'Đánh Giá Sản Phẩm'}
            </h1>

            <div className="flex items-center mb-6">
                {/* Thay thế bằng ảnh sản phẩm thực tế nếu có */}
                <img
                    src="https://via.placeholder.com/60"
                    alt="Product"
                    className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4 text-gray-600">
                    <p className="font-medium">Sản phẩm:</p>
                    <p>{productSlug}</p>
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
                            ? '' // Không hiển thị placeholder nếu đang sửa
                            : 'Hãy chia sẻ những trải nghiệm của bạn về sản phẩm...'
                    }
                ></textarea>

                {/* Khu vực hiển thị ảnh preview */}
                {images.length > 0 && (
                    <div className="flex gap-4 mt-4 flex-wrap">
                        {images.map(renderImagePreview)}
                    </div>
                )}
            </div>

            <div className="flex space-x-4 my-6">
                {/* Input file ẩn */}
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    multiple
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                />

                <button
                    onClick={() => fileInputRef.current.click()}
                    style={{
                        border: '2px solid #16a34a',
                        padding: '0.375rem 0.5rem',
                        borderRadius: '2px',
                    }}
                    className={`
                        flex items-center gap-1
                        bg-green-100/50
                        text-green-700 text-sm font-medium
                        hover:bg-green-100
                        transition
                    `}
                    // Disable nút nếu đã đủ 4 ảnh (tổng cả cũ và mới)
                    disabled={images.length >= 4}
                >
                    <FiCamera className="w-4 h-4" />
                    Thêm Hình ảnh ({images.length}/4)
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