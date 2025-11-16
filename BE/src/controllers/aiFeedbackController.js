import { aiFeedbackService } from '~/services/aiFeedbackService'
import { StatusCodes } from 'http-status-codes'

const createFeedback = async (req, res, next) => {
    try {
        const data = await aiFeedbackService.createFeedbackService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới feedback thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const createOrUpdateFeedbackBySlug = async (req, res, next) => {
    try {
        const data = await aiFeedbackService.createOrUpdateFeedbackBySlugService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới feedback thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getByIdFeedback = async (req, res, next) => {
    try {
        const data = await aiFeedbackService.getByIdFeedbackService(req.query.feedbackId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy feedback thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getListFeedbackByProduct = async (req, res, next) => {
    try {
        const data = await aiFeedbackService.getListFeedbackByProductService(req.query.productId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách feedback theo sản phẩm thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getListFeedbackByUser = async (req, res, next) => {
    try {
        const data = await aiFeedbackService.getListFeedbackByUserService(req.query.userId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách feedback theo user thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateFeedback = async (req, res, next) => {
    try {
        const data = await aiFeedbackService.updateFeedbackService(req.query.feedbackId, req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật feedback thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteFeedback = async (req, res, next) => {
    try {
        const data = await aiFeedbackService.deleteFeedbackService(req.query.feedbackId)
        return res.status(StatusCodes.OK).json({
            message: 'Xóa feedback thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const aiFeedbackController = {
    createFeedback,
    createOrUpdateFeedbackBySlug,
    getByIdFeedback,
    getListFeedbackByProduct,
    getListFeedbackByUser,
    updateFeedback,
    deleteFeedback,
}
