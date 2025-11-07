import { SlidersModel } from '~/models/sliderModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createSliderService = async data => {
    const slider = await SlidersModel.createSlider(data)
    return slider
}

const getByIdSliderService = async sliderId => {
    const slider = await SlidersModel.getSliderById(sliderId)
    if (!slider) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy slider với ID: ${sliderId}`
        )
    }
    return slider
}

const getListSliderService = async data => {
    const limit = parseInt(data.limit) || 50
    const offset = parseInt(data.offset) || 0
    const status = data.status !== undefined ? parseInt(data.status) : null
    const sort = data.sort === 'asc' ? 'asc' : 'desc'

    const listSlider = await SlidersModel.listSliders(limit, offset, status, sort)

    if (!listSlider || listSlider.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy slider nào')
    }

    return listSlider
}

const updateSliderService = async (sliderId, data) => {
    const existingSlider = await SlidersModel.getSliderById(sliderId)
    if (!existingSlider) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy slider với ID: ${sliderId}`
        )
    }

    const updatedSlider = await SlidersModel.updateSlider(sliderId, data)
    return updatedSlider
}

const deleteSliderService = async sliderId => {
    const existingSlider = await SlidersModel.getSliderById(sliderId)
    if (!existingSlider) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy slider với ID: ${sliderId}`
        )
    }

    await SlidersModel.deleteSlider(sliderId)
    return { message: 'Xóa slider thành công' }
}

export const sliderService = {
    createSliderService,
    getByIdSliderService,
    getListSliderService,
    updateSliderService,
    deleteSliderService,
}
