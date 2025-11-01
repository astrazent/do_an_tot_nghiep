import express from 'express'
import { commentController } from '../../controllers/commentController.js'
const Router = express.Router()

Router.route('/').post(commentController.createComment) 

Router.route('/').get(commentController.getByIdComment)

Router.route('/list').get(commentController.getListComment)

Router.route('/by_product').get(commentController.getListCommnentByProduct)

Router.route('/by_product_slug').get(commentController.getCommentByProductSlug)

Router.route('/by_user').get(commentController.getListCommentByUser)

Router.route('/').patch(commentController.updateComment)

Router.route('/').delete(commentController.deleteComment)


export default Router