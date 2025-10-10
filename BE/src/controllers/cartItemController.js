import { cartItemService } from '~/services/cartItemService.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

const getCartItems = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = jwt.verify(token, process.env.JWT_SECRET || "bepsachviet123").userId;
        console.log(userId)
        if(!userId){
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Lỗi token không tìm thấy user"
            })
        }
        const data = await cartItemService.getCartItemsService(userId)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy giỏ hàng thành công',
            data,
        })
    } catch (error) {
        return next(error)
    }
}

const addCartItems = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const userId = jwt.verify(token, process.env.JWT_SECRET || "bepsachviet123").userId;
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
        return next(error)
    }
}

const updateQuantityCartItems = async (req, res, next) => {
    try {
        const data = await cartItemService.updateQuantityCartItemsService(
            req.body.cartItemId,
            req.body.quantity
        )

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật số lượng sản phẩm trong giỏ hàng thành công',
            data,
        })
    } catch (error) {
        return next(error)
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
        return next(error)
    }
}

export const cartItemController = {
    getCartItems,
    addCartItems,
    deleteCartItems,
    updateQuantityCartItems,
}
