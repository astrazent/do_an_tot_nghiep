import { commentService } from '~/services/commentService'
import ErrorServer from '~/utils/ErrorServer'
import { StatusCodes } from 'http-status-codes'

const createComment = async (req, res, next) => {
    try {
        const data = await commentService.createCommentService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới comment thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getByIdComment = async (req, res, next) => {
    try {
        const data = await commentService.getByIdCommentService(req.query.commentId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy comment thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListComment = async (req, res, next) => {
    try {
        const data = await commentService.getListCommentService(req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách comment thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListCommnetByProduct = async (req, res, next) => {
    try {
        const data = await commentService.getListCommnetByProductService(req.query.productId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách comment theo sản phẩm thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListCommentByUser = async (req, res, next) => {
    try {
        const data = await commentService.getListCommentByUserService(req.query.userId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách comment theo user thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const updateComment = async (req, res, next) => {
    try {
        const data = await commentService.updateCommentService(req.query.commentId, req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật comment thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const data = await commentService.deleteCommentService(req.query.commentId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const commentController = {
    createComment,
    getByIdComment,
    getListComment,
    getListCommnetByProduct,
    getListCommentByUser,
    updateComment,
    deleteComment,
}