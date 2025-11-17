import { CommentReactionsModel } from '~/models/commentReactionModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { CommentsModel } from '~/models/commentModel'

const createOrUpdateReactionService = async data => {
    const existingComment = await CommentsModel.getCommentById(data.comment_id)
    if (!existingComment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với id: ${data.comment_id}`
        )
    }

    const reaction = await CommentReactionsModel.createReaction(data)
    return reaction
}

const getReactionByIdService = async reactionId => {
    const reaction = await CommentReactionsModel.getReactionById(reactionId)
    if (!reaction) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy reaction với id: ${reactionId}`
        )
    }
    return reaction
}

const getReactionsByCommentService = async commentId => {
    const reactions =
        await CommentReactionsModel.getReactionsByComment(commentId)

    return reactions
}

const getReactionsByProductService = async data => {
    try {
        const queryData = {
            user_id: Number(data.user_id),
            product_id: Number(data.product_id),
        }
        const reactions =
            await CommentReactionsModel.getReactionsByProduct(queryData)
        return reactions
    } catch (error) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `lỗi khi lấy dữ liệu reaction product`
        )
    }
}

const getReactionsByUserService = async userId => {
    const reactions = await CommentReactionsModel.getReactionsByUser(userId)
    if (reactions.length === 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không có reaction nào của user với id: ${userId}`
        )
    }
    return reactions
}

const deleteReactionService = async (userId, commentId, productId) => {
    const deleted = await CommentReactionsModel.deleteReaction(
        userId,
        commentId,
        productId
    )
    if (!deleted) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy reaction để xóa. Có thể reaction này không tồn tại.'
        )
    }
    return { message: 'Xóa reaction thành công' }
}

const countReactionsService = async commentId => {
    const counts = await CommentReactionsModel.countReactions(commentId)

    return counts
}

export const commentReactionService = {
    createOrUpdateReactionService,
    getReactionByIdService,
    getReactionsByCommentService,
    getReactionsByProductService,
    getReactionsByUserService,
    deleteReactionService,
    countReactionsService,
}
