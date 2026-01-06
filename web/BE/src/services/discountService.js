import { DiscountsModel } from '~/models/discountModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { DiscountProductsModel } from '~/models/discountProductModel'

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

    const updateDiscount = await DiscountsModel.updateDiscount(discountId, {
        name: data.name,
        description: data.description,
        value: data.value,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status
    })

    if (data.product_ids && Array.isArray(data.product_ids)) {
        const currentLinks = await DiscountProductsModel.getProductsByDiscount(discountId)
        const currentProductIds = currentLinks.map(link => link.product_id)

        const productIdsToDelete = currentProductIds.filter(
            id => !data.product_ids.includes(id)
        )

        const productIdsToAdd = data.product_ids.filter(
            id => !currentProductIds.includes(id)
        )

        for (const link of currentLinks) {
            if (productIdsToDelete.includes(link.product_id)) {
                await DiscountProductsModel.deleteLink(link.id)
            }
        }

        for (const productId of productIdsToAdd) {
            await DiscountProductsModel.createLink({
                discount_id: discountId,
                product_id: productId
            })
        }
    }

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
