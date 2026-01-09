import express from 'express'
import { categoryController } from '~/controllers/categoryController'
import { categoryValidation } from '~/validations/categoryValidation.js'

const Router = express.Router()

Router.route('/').post(
    categoryValidation.validateCreateCategory,
    categoryController.createCategory
)

Router.route('/').get(categoryController.getByIdCategory)

Router.route('/by_slug').get(categoryController.getBySlugCategory)

Router.route('/list').get(categoryController.getListCategory)

Router.route('/:categoryId').patch(
    categoryValidation.validateUpdateCategory,
    categoryController.updateCategory
)

Router.route('/').delete(categoryController.deleteCategory)

export default Router
