import { DiscountsModel } from '~/models/discountModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const addDiscountService = async data => {
    const discount = await DiscountsModel.createDiscount(data)
    return discount
}

const getDiscountByIdService = async discountId => {
    const discount = await DiscountsModel.getDiscountById(discountId)

    if (!discount) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy mã giảm giá này'
        )
    }

    return discount
}

const getAllDiscountService = async data => {
    const listDiscount = await DiscountsModel.listDiscounts(
        data.limit,
        data.offset
    )
    return listDiscount
}

const getActiveDiscountService = async () => {
    const activeDiscount = await DiscountsModel.getActiveDiscounts()
    return activeDiscount
}

const updateDiscountService = async (discountId, data) => {
    const discount = await DiscountsModel.getDiscountById(discountId)

    if (!discount) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy mã giảm giá này'
        )
    }

    const updateDiscount = await DiscountsModel.updateDiscount(discountId, data)
    return updateDiscount
}

const deleteDiscountService = async (discountId, data) => {
    const discount = await DiscountsModel.getDiscountById(discountId)

    if (!discount) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy mã giảm giá này'
        )
    }

    await DiscountsModel.deleteDiscount(discountId)
    return { message: 'Xóa mã giảm giá thành công' }
}

export const discountService = {
    addDiscountService,
    getActiveDiscountService,
    getAllDiscountService,
    getDiscountByIdService,
    updateDiscountService,
    deleteDiscountService,
}
