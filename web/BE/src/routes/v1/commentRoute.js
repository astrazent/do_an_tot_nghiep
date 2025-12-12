import express from 'express'
import { commentController } from '../../controllers/commentController.js'
import { verifyToken } from '~/middlewares/authMiddleware.js'
const Router = express.Router()

Router.route('/').post(verifyToken, commentController.createComment)

Router.route('/by_product_slug').post(
    verifyToken,
    commentController.createCommentByProductSlug
)

Router.route('/').get(commentController.getByIdComment)

Router.route('/list').get(commentController.getListComment)

Router.route('/by_product').get(commentController.getListCommnentByProduct)

Router.route('/by_user_slug').get(commentController.getByUserIdAndProductSlug)

Router.route('/by_product_slug').get(commentController.getCommentByProductSlug)

Router.route('/by_user').get(commentController.getListCommentByUser)

Router.route('/').patch(verifyToken, commentController.updateComment)

Router.route('/by_product_slug').patch(
    verifyToken,
    commentController.updateCommentByUserAndProduct
)

Router.route('/').delete(commentController.deleteComment)

export default Router
