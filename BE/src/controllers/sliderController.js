import { sliderService } from '~/services/sliderService'
import ErrorServer from '~/utils/ErrorServer'
import { StatusCodes } from 'http-status-codes'

const createSlider = async (req, res, next) => {
    try {
        const data = await sliderService.createSliderService(req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Tạo mới slider thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getByIdSlider = async (req, res, next) => {
    try {
        const data = await sliderService.getByIdSliderService(req.query.sliderId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy slider thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListSlider = async (req, res, next) => {
    try {
        const data = await sliderService.getListSliderService(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách slider thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const updateSlider = async (req, res, next) => {
    try {
        const data = await sliderService.updateSliderService(req.query.sliderId, req.body)
        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật slider thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const deleteSlider = async (req, res, next) => {
    try {
        const data = await sliderService.deleteSliderService(req.query.sliderId)
        return res.status(StatusCodes.OK).json({
            message: 'Xóa slider thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const sliderController = {
    createSlider,
    getByIdSlider,
    getListSlider,
    updateSlider,
    deleteSlider,
}
