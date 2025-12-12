import express from 'express'
import { marketingAIController } from '~/controllers/marketingAIController'
import { uploadCloudinary, upload } from '~/middlewares/uploadCloudinary'
const Router = express.Router()

Router.route('/').post(upload.array('product_image', 10), uploadCloudinary, marketingAIController.marketing)

export default Router
