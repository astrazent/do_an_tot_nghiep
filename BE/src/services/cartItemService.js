import { StatusCodes } from 'http-status-codes'
import { CartItemsModel } from '~/models/cartItemModel'
import { ProductsModel } from '~/models/productModel'
import ApiError from '~/utils/ApiError'

const getCartItemsService = async userId => {
    const cartItems = await CartItemsModel.getCartItemsByUser(userId)
    if (!cartItems || cartItems.length === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy giỏ hàng')
    }
    return cartItems
}

const addCartItemsService = async (userId, slug, quantity) => {
    const product = await ProductsModel.getProductById(slug)
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }

    const price_total = product.price * quantity

    const existingCartItem = await CartItemsModel.getCartItemByProductId(
        product.id,
        userId
    )
    if (existingCartItem) {
        const newQty = existingCartItem.qty_total + quantity
        const newPriceTotal =
            Number(existingCartItem.price_total) + Number(price_total)
        await CartItemsModel.updateCartItemByUser(
            userId,
            product.id,
            newQty,
            newPriceTotal
        )
        return {
            ...existingCartItem,
            qty_total: newQty,
            price_total: newPriceTotal,
        }
    } else {
        const newCartItem = await CartItemsModel.createCartItem({
            qty_total: quantity,
            price_total: price_total,
            user_id: userId,
            product_id: product.id,
        })
        return newCartItem
    }
}

const updateQuantityCartItemsService = async (
    user_id,
    product_id,
    newQty,
    newPriceTotal
) => {
    if (
        !user_id ||
        !product_id ||
        typeof newQty !== 'number' ||
        typeof newPriceTotal !== 'number'
    ) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'user_id, product_id, quantity và price_total là bắt buộc'
        )
    }

    const updatedCartItem = await CartItemsModel.updateCartItemByUser(
        user_id,
        product_id,
        newQty,
        newPriceTotal
    )

    if (!updatedCartItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm trong giỏ hàng'
        )
    }

    return updatedCartItem
}

const deleteCartItemsService = async cartItemId => {
    const cartItem = await CartItemsModel.getCartItemById(cartItemId)
    if (!cartItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm trong giỏ hàng'
        )
    }
    await CartItemsModel.deleteCartItem(cartItemId)
    return cartItem
}

const deleteCartByUserService = async userId => {
    if (!userId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'userId là bắt buộc')
    }
    const deleted = await CartItemsModel.deleteCartItemsByUser(userId)
    if (!deleted) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Xoá giỏ hàng không thành công'
        )
    }
    return { success: true }
}

const getCartItemByProductService = async (productId, userId = null) => {
    const cartItem = await CartItemsModel.getCartItemByProductId(
        productId,
        userId
    )

    if (!cartItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm trong giỏ hàng'
        )
    }

    return cartItem
}

export const cartItemService = {
    getCartItemsService,
    addCartItemsService,
    deleteCartItemsService,
    deleteCartByUserService,
    getCartItemByProductService,
    updateQuantityCartItemsService,
}
