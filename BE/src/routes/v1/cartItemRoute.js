import express from 'express'
import { cartItemController } from '~/controllers/cartItemController'
import { verifyToken } from '../../middlewares/authMiddleware.js'
const Router = express.Router()

Router.route('/').get(verifyToken, cartItemController.getCartItems)

Router.route('/by_product').get(
    verifyToken,
    cartItemController.getCartItemByProduct
)

Router.route('/').post(verifyToken, cartItemController.addCartItems)

Router.route('/').patch(verifyToken, cartItemController.updateQuantityCartItems)

Router.route('/').delete(verifyToken, cartItemController.deleteCartItems)

Router.route('/by_user').delete(
    verifyToken,
    cartItemController.deleteCartByUser
)

export default Router
