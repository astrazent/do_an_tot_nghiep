import express from 'express'
import { productImageController } from '~/controllers/productImageController'
import { upload, uploadCloudinary } from '~/middlewares/uploadCloudinary'

const Router = express.Router()

Router.route('/by_product').get(productImageController.getImageForProduct)

Router.route('/').post(
    upload.array('images', 10),
    uploadCloudinary,
    productImageController.createProductImage
)

Router.route('/:imageId').patch(productImageController.updateProductImage)

Router.route('/').delete(productImageController.deleteProductImage)

export default Router