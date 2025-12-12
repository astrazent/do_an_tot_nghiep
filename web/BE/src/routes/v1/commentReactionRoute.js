import express from 'express'
import { commentReactionController } from '../../controllers/commentReactionController.js'

const Router = express.Router()

Router.route('/').post(commentReactionController.createOrUpdateReaction)

Router.route('/').get(commentReactionController.getReactionById)

Router.route('/').delete(commentReactionController.deleteReaction)

Router.route('/count').get(commentReactionController.countReactions)

Router.route('/by_comment').get(commentReactionController.getReactionsByComment)

Router.route('/by_product').get(commentReactionController.getReactionsByProduct)

Router.route('/by_user').get(commentReactionController.getReactionsByUser)

export default Router
