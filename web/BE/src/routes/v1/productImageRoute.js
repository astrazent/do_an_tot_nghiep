import express from 'express'
import { productImageController } from '~/controllers/productImageController'
import { upload, uploadCloudinary } from '~/middlewares/uploadCloudinary'
import { productImageValidation } from '~/validations/productImageValidation'

const Router = express.Router()

Router.route('/by_product').get(productImageController.getImageForProduct)

Router.route('/').post(
    upload.array('images', 10),
    uploadCloudinary,
    productImageValidation.validateCreateProductImage,
    productImageController.createProductImage
)

Router.route('/:imageId').patch(
    productImageValidation.validateUpdateProductImage,
    productImageController.updateProductImage
)

Router.route('/').delete(productImageController.deleteProductImage)

export default Router
