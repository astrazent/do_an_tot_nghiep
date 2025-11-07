import { CommentsModel } from '~/models/commentModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createCommentService = async data => {   
    const comment = await CommentsModel.createComment(data)
    return comment
}

const getByIdCommentService = async commentId => {
    const comment = await CommentsModel.getCommentById(commentId)
    if (!comment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với id: ${commentId}`
        )
    }

    return comment
}
const getCommentByProductSlugService = async commentId => {
    const comment = await CommentsModel.getCommentsByProductSlug(commentId)
    if (!comment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với id: ${commentId}`
        )
    }

    return comment
}

const getListCommentService = async filters => {
    const comments = await CommentsModel.listComments(filters.limit, filters.offset)
    if(comments.length === 0){
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không có comment nào`
        )
    }

    return comments
}

const getListCommentByProductService = async productId => {
    const comments = await CommentsModel.getCommentsByProduct(productId)
    if(comments.length === 0){
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không có comment nào cho sản phẩm với id: ${productId}`
        )
    }

    return comments
}

const getListCommentByUserService = async userId => {
    const comments = await CommentsModel.getCommentsByUser(userId)
    if(comments.length === 0){
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không có comment nào của user với id: ${userId}`
        )
    }

    return comments
}

const updateCommentService = async (commentId, data) => {
    const existingComment = await CommentsModel.getCommentById(commentId)
    if (!existingComment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với id: ${commentId}`
        )
    }

    const updatedComment = await CommentsModel.updateComment(commentId, data)
    return updatedComment
}

const deleteCommentService = async commentId => {
    const existingComment = await CommentsModel.getCommentById(commentId)
    if (!existingComment) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy comment với id: ${commentId}`
        )
    }

    await CommentsModel.deleteComment(commentId)
    return { message: 'Xóa comment thành công' }
}

export const commentService = {
    createCommentService,
    getByIdCommentService,
    getCommentByProductSlugService,
    getListCommentService,
    getListCommentByProductService,
    getListCommentByUserService,
    updateCommentService,
    deleteCommentService,
}
