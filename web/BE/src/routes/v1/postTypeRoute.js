import express from 'express'
import { postTypeController } from '~/controllers/postTypeController'
import { postTypeValidation } from '~/validations/postTypeValidation.js'

const Router = express.Router()

Router.route('/').post(
    postTypeValidation.validateCreatePostType,
    postTypeController.createPostType
)

Router.route('/').get(postTypeController.getByIdPostType)

Router.route('/list').get(postTypeController.getListPostType)

Router.route('/:postTypeId').patch(
    postTypeValidation.validateUpdatePostType,
    postTypeController.updatePostType
)

Router.route('/').delete(postTypeController.deletePostType)

export default Router
