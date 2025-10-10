import express from 'express'
import { cartItemController } from '~/controllers/cartItemController'
const Router = express.Router()

Router.route('/').get(cartItemController.getCartItems) 

Router.route('/').post(cartItemController.addCartItems) 

Router.route("/").patch(cartItemController.updateQuantityCartItems)

Router.route('/').delete(cartItemController.deleteCartItems)

export default Router
