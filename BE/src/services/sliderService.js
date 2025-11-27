import { SlidersModel } from '~/models/sliderModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const createSliderService = async (data, imageUrl) => {
    const slider = await SlidersModel.createSlider({
        ...data,
        image_url: imageUrl[0],
    })
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
    const status = data.status !== undefined ? parseInt(data.status) : null
    const sort = data.sort === 'asc' ? 'asc' : 'desc'

    const listSlider = await SlidersModel.listSliders(status, sort)

    if (!listSlider || listSlider.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy slider nào')
    }

    return listSlider
}

const updateSliderService = async (sliderId, data, imageUrl) => {
    const existingSlider = await SlidersModel.getSliderById(sliderId)
    if (!existingSlider) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Không tìm thấy slider với ID: ${sliderId}`
        )
    }
    let updatedSlider = null
    if (imageUrl) {
        updatedSlider = await SlidersModel.updateSlider(sliderId, {
            ...data,
            image_url: imageUrl[0],
        })
    } else {
        updatedSlider = await SlidersModel.updateSlider(sliderId, data)
    }

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
