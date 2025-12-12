import React, { useState, useMemo } from 'react'
import {
    useUpdateCommentReaction,
    useCommentReactions,
} from '~/hooks/user/useCommentReaction'
import { useQueryClient } from '@tanstack/react-query'
import {
    FaStar,
    FaCheckCircle,
    FaThumbsUp,
    FaThumbsDown,
    FaChevronLeft,
    FaChevronRight,
} from 'react-icons/fa'

const CommentItem = ({
    id,
    product_id,
    author,
    avatar,
    rating,
    date,
    isVerified,
    comment,
    images,
    likes,
    dislikes,
    slug,
    userReaction,
}) => {
    const queryClient = useQueryClient()

    const currentUser = { id: 1 }

    const { mutate: updateReaction } = useUpdateCommentReaction(slug, {
        onMutate: async newReactionData => {
            const { comment_id, reaction: newReaction } = newReactionData
            const queryKey = ['comment-reactions', currentUser.id, product_id]

            await queryClient.cancelQueries({ queryKey })
            const previousReactions = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey, oldData => {
                if (!oldData || !oldData.data) return oldData

                const updatedReactions = [...oldData.data]
                const existingIndex = updatedReactions.findIndex(
                    r => r.comment_id === comment_id
                )

                if (newReaction === null) {
                    if (existingIndex > -1) {
                        updatedReactions.splice(existingIndex, 1)
                    }
                } else if (existingIndex > -1) {
                    updatedReactions[existingIndex].reaction = newReaction
                } else {
                    updatedReactions.push({
                        user_id: currentUser.id,
                        comment_id: comment_id,
                        reaction: newReaction,
                    })
                }

                return { ...oldData, data: updatedReactions }
            })

            return { previousReactions }
        },
        onError: (err, newReaction, context) => {
            const queryKey = ['comment-reactions', currentUser.id, product_id]
            if (context?.previousReactions) {
                queryClient.setQueryData(queryKey, context.previousReactions)
            }
        },
        onSettled: () => {
            const queryKey = ['comment-reactions', currentUser.id, product_id]
            queryClient.invalidateQueries({ queryKey })
        },
    })

    const handleReaction = reactionType => {
        if (!currentUser) return

        const newReaction = reactionType

        updateReaction({
            user_id: currentUser.id,
            product_id: product_id,
            comment_id: id,
            reaction: newReaction,
        })
    }

    const isLiked = userReaction === 'like'
    const isDisliked = userReaction === 'dislike'

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
                                <span>Đã mua 1 sản phẩm</span>
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
                        {images.slice(0, 2).map((imgUrl, idx) => (
                            <img
                                key={idx}
                                src={imgUrl}
                                alt={`Hình ảnh bình luận ${idx + 1}`}
                                className="w-20 h-20 object-cover rounded"
                            />
                        ))}
                        {images.length > 2 && (
                            <div className="w-20 h-20 flex items-center justify-center bg-gray-200 text-gray-700 rounded text-sm font-semibold">
                                +{images.length - 2}
                            </div>
                        )}
                    </div>
                )}
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                    <button
                        className={`flex items-center gap-1 ${isLiked ? 'text-blue-600 font-bold' : 'hover:text-blue-600'}`}
                        onClick={() => handleReaction('like')}
                    >
                        <FaThumbsUp /> {likes}
                    </button>
                    <button
                        className={`flex items-center gap-1 ${isDisliked ? 'text-red-600 font-bold' : 'hover:text-red-600'}`}
                        onClick={() => handleReaction('dislike')}
                    >
                        <FaThumbsDown /> {dislikes}
                    </button>
                </div>
            </div>
        </div>
    )
}

const CommentList = ({ comments = [], slug }) => {
    const [currentPage, setCurrentPage] = useState(1)
    const commentsPerPage = 5
    const currentUser = { id: 1 }
    const product_id = comments.length > 0 ? comments[0].product_id : null

    const { data: reactionsData } = useCommentReactions(
        { user_id: currentUser?.id, product_id: product_id },
        {
            enabled: !!currentUser?.id && !!product_id,
        }
    )

    const reactionsMap = useMemo(() => {
        if (!reactionsData?.data) {
            return new Map()
        }
        return reactionsData.data.reduce((map, reaction) => {
            map.set(reaction.comment_id, reaction.reaction)
            return map
        }, new Map())
    }, [reactionsData])

    if (comments.length === 0) {
        return (
            <div className="mt-8 pt-8 border-t border-gray-300 text-center text-gray-500">
                <p>Không có bình luận nào phù hợp với bộ lọc này.</p>
            </div>
        )
    }

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
    }

    return (
        <div className="mt-8 border-t border-gray-300 pt-2">
            {currentComments.map((comment, index) => (
                <CommentItem
                    key={`${comment.id}-${index}`}
                    {...comment}
                    slug={slug}
                    userReaction={reactionsMap.get(comment.id)}
                />
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

const PageComment = ({ comments, slug }) => {
    return (
        <div className="container mx-auto p-4">
            <CommentList comments={comments} slug={slug} />
        </div>
    )
}

export default PageComment
