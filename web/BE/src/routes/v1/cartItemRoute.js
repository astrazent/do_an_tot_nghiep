import express from 'express'
import { cartItemController } from '~/controllers/cartItemController'
import { cartItemValidation } from '~/validations/cartItemValidation'
import { verifyToken } from '../../middlewares/authMiddleware.js'

const Router = express.Router()

Router.route('/').get(verifyToken, cartItemController.getCartItems)

Router.route('/by_product').get(
    verifyToken,
    cartItemController.getCartItemByProduct
)

Router.route('/').post(
    verifyToken,
    cartItemValidation.validateCreateCartItem,
    cartItemController.addCartItems
)

Router.route('/').patch(
    verifyToken,
    cartItemValidation.validateUpdateCartItem,
    cartItemController.updateQuantityCartItems
)

Router.route('/').delete(verifyToken, cartItemController.deleteCartItems)

Router.route('/by_user').delete(
    verifyToken,
    cartItemController.deleteCartByUser
)

export default Router
