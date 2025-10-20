import express from 'express'
import { categoryController } from '~/controllers/categoryController'
const Router = express.Router()

Router.route('/').post(categoryController.createCategory) 

Router.route('/').get(categoryController.getByIdCategory)

Router.route('/list').get(categoryController.getListCategory)

Router.route('/').patch(categoryController.updateCategory)

Router.route('/').delete(categoryController.deleteCategory)


export default Router
