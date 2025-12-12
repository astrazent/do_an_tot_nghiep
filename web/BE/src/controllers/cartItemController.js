import { cartItemService } from '~/services/cartItemService.js'
import { StatusCodes } from 'http-status-codes'

const getCartItems = async (req, res, next) => {
    try {
        const userId = req.query.userId
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Không tìm thấy userId',
            })
        }
        const data = await cartItemService.getCartItemsService(userId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy giỏ hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const addCartItems = async (req, res, next) => {
    try {
        const userId = req.query.userId
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Không tìm thấy userId',
            })
        }

        const data = await cartItemService.addCartItemsService(
            userId,
            req.body.productId,
            req.body.quantity
        )

        return res.status(StatusCodes.OK).json({
            message: 'Thêm sản phẩm vào giỏ hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const updateQuantityCartItems = async (req, res, next) => {
    try {
        const user_id = req.user?.id || req.query.userId
        const { product_id, quantity, price_total } = req.body

        const data = await cartItemService.updateQuantityCartItemsService(
            user_id,
            product_id,
            quantity,
            price_total
        )

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật giỏ hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteCartItems = async (req, res, next) => {
    try {
        const data = await cartItemService.deleteCartItemsService(
            req.query.cartItemId
        )
        return res.status(StatusCodes.OK).json({
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const deleteCartByUser = async (req, res, next) => {
    try {
        const userId = req.query.userId
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'userId là bắt buộc',
            })
        }
        const data = await cartItemService.deleteCartByUserService(userId)
        return res.status(StatusCodes.OK).json({
            message: 'Xóa giỏ hàng của user thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getCartItemByProduct = async (req, res, next) => {
    try {
        const productId = req.query.productId
        const userId = req.query.userId || null

        if (!productId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: 'productId là bắt buộc',
            })
        }

        const data = await cartItemService.getCartItemByProductService(
            productId,
            userId
        )

        return res.status(StatusCodes.OK).json({
            message: 'Lấy sản phẩm trong giỏ hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const cartItemController = {
    getCartItems,
    getCartItemByProduct,
    addCartItems,
    deleteCartItems,
    deleteCartByUser,
    updateQuantityCartItems,
}
