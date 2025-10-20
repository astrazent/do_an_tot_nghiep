import express from 'express'
import { postCategoryController } from '~/controllers/postCategoryController'
const Router = express.Router()

Router.route('/').post(postCategoryController.create) 

Router.route('/').get(postCategoryController.getById)

Router.route('/list').get(postCategoryController.getList)

Router.route('/by_post').get(postCategoryController.getListCategoryByPost)

Router.route('/by_category').get(postCategoryController.getListPostByCategory)

Router.route('/').patch(postCategoryController.update)

Router.route('/').delete(postCategoryController.deleted)


export default Router