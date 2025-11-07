import { commentService } from '~/services/commentService'
import { StatusCodes } from 'http-status-codes'

const createComment = async (req, res, next) => {
    try {
        const data = await commentService.createCommentService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới comment thành công',
            data,
        })
    } catch (error) {
        next(error)
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
        next(error)
    }
}
const getCommentByProductSlug = async (req, res, next) => {
    try {
        const data = await commentService.getCommentByProductSlugService(req.query.slug)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy comment bằng slug thành công',
            data,
        })
    } catch (error) {
        next(error)
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
        next(error)
    }
}

const getListCommnentByProduct = async (req, res, next) => {
    try {
        const data = await commentService.getListCommentByProductService(req.query.productId)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách comment theo sản phẩm thành công',
            data,
        })
    } catch (error) {
        next(error)
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
        next(error)
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
        next(error)
    }
}

const deleteComment = async (req, res, next) => {
    try {
        const data = await commentService.deleteCommentService(req.query.commentId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const commentController = {
    createComment,
    getByIdComment,
    getCommentByProductSlug,
    getListComment,
    getListCommnentByProduct,
    getListCommentByUser,
    updateComment,
    deleteComment,
}