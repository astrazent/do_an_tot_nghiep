import express from 'express'
import { marketingAIController } from '~/controllers/marketingAIController'
import { uploadCloudinary, upload } from '~/middlewares/uploadCloudinary'
const Router = express.Router()

Router.route('/post').post(upload.array('product_image', 10), uploadCloudinary, marketingAIController.marketingPost)

Router.route('/email').post(upload.array('image', 10), uploadCloudinary, marketingAIController.marketingEmail)

export default Router
