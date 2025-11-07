import { cartItemService } from '~/services/cartItemService.js'
import { StatusCodes } from 'http-status-codes'

const getCartItems = async (req, res, next) => {
    try {
        const userId = req.query.userId
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Không tìm thấy userId"
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
        const userId = req.query.userId  // lấy trực tiếp từ req
        if (!userId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "Không tìm thấy userId"
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
        const user_id = req.user?.id || req.query.userId;
        const { product_id, quantity, price_total } = req.body;

        // Gọi service (service đã validate input)
        const data = await cartItemService.updateQuantityCartItemsService(
            user_id,
            product_id,
            quantity,
            price_total
        );

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật giỏ hàng thành công',
            data,
        });
    } catch (error) {
        next(error); // service sẽ ném ApiError nếu có lỗi
    }
};

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

export const cartItemController = {
    getCartItems,
    addCartItems,
    deleteCartItems,
    updateQuantityCartItems,
}
