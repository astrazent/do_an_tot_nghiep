import { DiscountProductsModel } from '~/models/discountProductModel'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'

const addDiscountProductService = async data => {
    const discountProduct = await DiscountProductsModel.createLink(data)
    return discountProduct
}

const getDiscountProductByIdService = async discountProductId => {
    const discountProduct =
        await DiscountProductsModel.getLinkById(discountProductId)
    if (!discountProduct) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy liên kết này')
    }
    return discountProduct
}

const getListDiscountProductService = async data => {
    const discountProduct = await DiscountProductsModel.listLinks(
        data.limit,
        data.offset
    )
    return discountProduct
}

const updateDiscountProductService = async (discountProductId, data) => {
    const discountProduct =
        await DiscountProductsModel.getLinkById(discountProductId)
    if (!discountProduct) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy liên kết này')
    }

    const result = await DiscountProductsModel.updateLink(
        discountProductId,
        data
    )
    return result
}

const deleteDiscountProductService = async discountProductId => {
    const discountProduct =
        await DiscountProductsModel.getLinkById(discountProductId)
    if (!discountProduct) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy liên kết này')
    }

    await DiscountProductsModel.deleteLink(discountProductId)
    return { message: 'Xóa liên kết thành công' }
}

const getProductsByDiscountService = async discount_id => {
    const listProductByDiscount =
        await DiscountProductsModel.getProductsByDiscount(discount_id)
    if (listProductByDiscount.leng == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm nào đang có giảm giá này'
        )
    }
    return listProductByDiscount
}

const getDiscountsByProductService = async product_id => {
    const listDiscountByProduct =
        await DiscountProductsModel.getDiscountsByProduct(product_id)
    if (listDiscountByProduct.leng == 0) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy mã giảm giá nào đang được sử dụng cho sản phẩm này'
        )
    }
    return listDiscountByProduct
}

export const discountProductService = {
    addDiscountProductService,
    getDiscountProductByIdService,
    getDiscountsByProductService,
    getListDiscountProductService,
    getProductsByDiscountService,
    updateDiscountProductService,
    deleteDiscountProductService,
}
