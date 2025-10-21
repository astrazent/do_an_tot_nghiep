import React, { useState } from 'react'
import {
    FaStar,
    FaCheckCircle,
    FaThumbsUp,
    FaThumbsDown,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa'

import vitUxiDau from '~/assets/image/shared/product/dac-san-van-dinh-vit-u-xi-dau.jpg'
import chaVitThuyManh from '~/assets/image/shared/product/dac-san-van-dinh-cha-vit-thuy-manh.jpg'
import mocVitVanDinh from '~/assets/image/shared/product/dac-san-moc-vit-van-dinh.png'
import chanVitRutXuongUMuoi from '~/assets/image/shared/product/chan-vit-rut-xuong-u-muoi.png'
import chanVitRutXuongUXiDau from '~/assets/image/shared/product/chan-vit-rut-xuong-u-xi-dau.png'
import pateGanVit from '~/assets/image/shared/product/pate-gan-vit.jpg'
import gaDongTaoUMuoi from '~/assets/image/shared/product/dong-tao-u-muoi.png'
import gaUMuoi from '~/assets/image/shared/product/ga-u-muoi.png'
import gaUXiDau from '~/assets/image/shared/product/ga-u-xi-dau.jpg'

const sampleComments = [
    {
        id: 1,
        author: 'Nguyễn Văn An',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        rating: 5,
        date: '20/09/2025',
        isVerified: true,
        comment:
            'Vịt ủ xì dầu rất thơm ngon, thịt mềm và đậm đà. Gia đình tôi rất thích!',
        images: [vitUxiDau, gaUMuoi],
        likes: 15,
        dislikes: 0,
    },
    {
        id: 2,
        author: 'Trần Thị Bích',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
        rating: 4,
        date: '18/09/2025',
        isVerified: true,
        comment:
            'Chả vịt Thủy Mẫn rất ngon, có một vài miếng hơi khô nhưng không đáng kể. Hương vị đặc trưng rất hấp dẫn.',
        images: [chaVitThuyManh],
        likes: 8,
        dislikes: 1,
    },
    {
        id: 3,
        author: 'Lê Minh Cường',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
        rating: 5,
        date: '15/09/2025',
        isVerified: false,
        comment:
            'Quá tuyệt vời! Móc vịt Vân Đình làm rất công phu, hương vị đậm đà. Cảm ơn shop đã mang đến một sản phẩm chất lượng.',
        images: [mocVitVanDinh, gaUMuoi],
        likes: 22,
        dislikes: 0,
    },
    {
        id: 4,
        author: 'Phạm Thuỳ Dung',
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
        rating: 3,
        date: '12/09/2025',
        isVerified: true,
        comment:
            'Chân vịt rút xương ủ muối hơi mặn so với khẩu vị của mình. Bù lại thì chất lượng tốt, đóng gói cẩn thận.',
        images: [chanVitRutXuongUMuoi],
        likes: 2,
        dislikes: 5,
    },
    {
        id: 5,
        author: 'Hoàng Văn Hải',
        avatar: 'https://i.pravatar.cc/150?u=user5',
        rating: 5,
        date: '11/09/2025',
        isVerified: true,
        comment:
            'Dịch vụ 5 sao, đóng gói cẩn thận, chân vịt rút xương ủ xì dầu thơm ngon khó cưỡng.',
        images: [chanVitRutXuongUXiDau],
        likes: 10,
        dislikes: 0,
    },
    {
        id: 6,
        author: 'Đỗ Thị Lan',
        avatar: 'https://i.pravatar.cc/150?u=user6',
        rating: 5,
        date: '10/09/2025',
        isVerified: true,
        comment: 'Pate gan vịt béo ngậy, thơm ngon, ăn với bánh mì rất tuyệt.',
        images: [pateGanVit],
        likes: 5,
        dislikes: 0,
    },
    {
        id: 7,
        author: 'Vũ Minh Tuấn',
        avatar: 'https://i.pravatar.cc/150?u=user7',
        rating: 4,
        date: '09/09/2025',
        isVerified: true,
        comment:
            'Gà Đồng Tào ủ muối giao hàng hơi chậm một chút nhưng chất lượng sản phẩm tốt, thịt chắc ngọt.',
        images: [gaDongTaoUMuoi],
        likes: 3,
        dislikes: 0,
    },
    {
        id: 8,
        author: 'Bùi Thị Hà',
        avatar: 'https://i.pravatar.cc/150?u=user8',
        rating: 5,
        date: '08/09/2025',
        isVerified: true,
        comment: 'Gà ủ muối rất đẹp, thịt thơm ngon, sẽ mua lại ủng hộ shop.',
        images: [gaUMuoi, gaUMuoi],
        likes: 7,
        dislikes: 0,
    },
    {
        id: 9,
        author: 'Ngô Gia Bảo',
        avatar: 'https://i.pravatar.cc/150?u=user9',
        rating: 5,
        date: '07/09/2025',
        isVerified: true,
        comment:
            'Gà ủ xì dầu đã thay đổi quan điểm của tôi về đồ ăn sẵn. Cảm ơn shop!',
        images: [gaUXiDau],
        likes: 30,
        dislikes: 0,
    },
    {
        id: 10,
        author: 'Mai Anh Thư',
        avatar: 'https://i.pravatar.cc/150?u=user10',
        rating: 4,
        date: '06/09/2025',
        isVerified: true,
        comment:
            'Một lựa chọn không tồi cho những ai bận rộn muốn có bữa ăn ngon mà không mất thời gian nấu nướng.',
        images: [vitUxiDau, chaVitThuyManh],
        likes: 6,
        dislikes: 1,
    },
]

const CommentItem = ({
    author,
    avatar,
    rating,
    date,
    isVerified,
    comment,
    images,
    likes,
    dislikes,
}) => {
    return (
        <div className="flex gap-4 py-6 border-b border-gray-300 last:border-b-0">
            <img
                src={avatar}
                alt={author}
                className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-semibold">{author}</p>
                        {isVerified && (
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <FaCheckCircle />
                                <span>Đã mua hàng</span>
                            </p>
                        )}
                    </div>
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <FaStar
                                key={i}
                                className={
                                    i < rating
                                        ? 'text-yellow-500'
                                        : 'text-gray-300'
                                }
                            />
                        ))}
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{date}</p>
                <p className="mt-2 text-gray-800">{comment}</p>
                {images && images.length > 0 && (
                    <div className="mt-2 flex gap-2">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Comment image ${index + 1}`}
                                className="w-20 h-20 rounded-md object-cover cursor-pointer"
                            />
                        ))}
                    </div>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                    <button className="flex items-center gap-1 hover:text-blue-600">
                        <FaThumbsUp /> {likes}
                    </button>
                    <button className="flex items-center gap-1 hover:text-red-600">
                        <FaThumbsDown /> {dislikes}
                    </button>
                </div>
            </div>
        </div>
    )
}

const CommentList = ({ comments }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const commentsPerPage = 5

    const totalComments = comments.length
    const totalPages = Math.ceil(totalComments / commentsPerPage)
    const indexOfLastComment = currentPage * commentsPerPage
    const indexOfFirstComment = indexOfLastComment - commentsPerPage
    const currentComments = comments.slice(
        indexOfFirstComment,
        indexOfLastComment
    )

    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber)
        window.scrollTo(0, 0)
    }

    return (
        <div className="mt-8 border-t border-gray-300 pt-2">
            {currentComments.map(comment => (
                <CommentItem key={comment.id} {...comment} />
            ))}

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-sm text-gray-500">
                    Hiển thị {indexOfFirstComment + 1}-
                    {Math.min(indexOfLastComment, totalComments)} trên{' '}
                    {totalComments} bình luận
                </p>

                {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronLeft className="h-4 w-4" />
                        </button>

                        {[...Array(totalPages).keys()].map(num => (
                            <button
                                key={num + 1}
                                onClick={() => handlePageChange(num + 1)}
                                className={`px-4 py-2 rounded-md text-sm font-medium ${
                                    currentPage === num + 1
                                        ? 'bg-green-600 text-white'
                                        : 'bg-white hover:bg-gray-100'
                                }`}
                            >
                                {num + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FaChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

const PageComment = () => {
    return (
        <div className="container mx-auto p-4">
            <CommentList comments={sampleComments} />
        </div>
    )
}

export default PageComment
