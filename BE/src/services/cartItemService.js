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

const addCartItemsService = async (userId, productId, quantity) => {
    const product = await ProductsModel.getProductById(productId)
    if (!product) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sản phẩm không tồn tại')
    }
    const price_total = product.price * quantity
    const newCartItem = await CartItemsModel.createCartItem({
        qty_total: quantity,
        price_total: price_total,
        user_id: userId,
        product_id: productId,
    })
    return newCartItem
}

const updateQuantityCartItemsService = async (cartItemId, quantity) => {
    const cartItem = await CartItemsModel.getCartItemById(cartItemId)
    if (!cartItem) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            'Không tìm thấy sản phẩm trong giỏ hàng'
        )
    }
    const newQuantity = cartItem.qty_total + quantity
    const newPriceTotal = product.price * newQuantity
    const updatedCartItem = await CartItemsModel.updateCartItem(cartItemId, {
        qty_total: newQuantity,
        price_total: newPriceTotal,
    })
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

export const cartItemService = {
    getCartItemsService,
    addCartItemsService,
    deleteCartItemsService,
    updateQuantityCartItemsService,
}
