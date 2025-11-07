// src/controllers/commentReactionController.js
import { commentReactionService } from '~/services/commentReactionService'
import { StatusCodes } from 'http-status-codes'

const createOrUpdateReaction = async (req, res, next) => {
    try {
        // user_id thường sẽ được lấy từ token sau khi xác thực
        // Tạm thời có thể truyền trong body để test
        const data = await commentReactionService.createOrUpdateReactionService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Thực hiện reaction thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getReactionById = async (req, res, next) => {
    try {
        const data = await commentReactionService.getReactionByIdService(req.query.reactionId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy reaction thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getReactionsByComment = async (req, res, next) => {
    try {
        const data = await commentReactionService.getReactionsByCommentService(req.query.commentId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách reaction theo comment thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getReactionsByProduct = async (req, res, next) => {
    try {
        const data = await commentReactionService.getReactionsByProductService(req.query);
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách reaction theo comment thành công',
            data,
        });
    } catch (error) {
        next(error);
    }
}

const getReactionsByUser = async (req, res, next) => {
    try {
        const data = await commentReactionService.getReactionsByUserService(req.query.userId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách reaction theo user thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteReaction = async (req, res, next) => {
    try {
        // Để xóa, cần thông tin user_id, comment_id, và product_id
        // user_id nên lấy từ req.user (sau khi xác thực) để bảo mật
        const { user_id, comment_id, product_id } = req.body
        const data = await commentReactionService.deleteReactionService(
            user_id,
            comment_id,
            product_id
        )
        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        next(error)
    }
}

const countReactions = async (req, res, next) => {
    try {
        const data = await commentReactionService.countReactionsService(req.query.reactionId)
        return res.status(StatusCodes.OK).json({
            message: 'Đếm số lượng reaction thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const commentReactionController = {
    createOrUpdateReaction,
    getReactionById,
    getReactionsByComment,
    getReactionsByProduct,
    getReactionsByUser,
    deleteReaction,
    countReactions,
}