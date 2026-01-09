import express from 'express'
import { postCategoryController } from '~/controllers/postCategoryController'
import { postCategoryValidation } from '~/validations/postCategoryValidation.js'

const Router = express.Router()

Router.route('/').post(
    postCategoryValidation.validateCreatePostCategory,
    postCategoryController.create
)

Router.route('/').get(postCategoryController.getById)

Router.route('/list').get(postCategoryController.getList)

Router.route('/by_post').get(postCategoryController.getListCategoryByPost)

Router.route('/by_category').get(postCategoryController.getListPostByCategory)

Router.route('/').patch(
    postCategoryValidation.validateUpdatePostCategory,
    postCategoryController.update
)

Router.route('/').delete(postCategoryController.deleted)

export default Router
