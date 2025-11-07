// src/routes/commentReactionRoute.js
import express from 'express'
import { commentReactionController } from '../../controllers/commentReactionController.js'

const Router = express.Router()

// Route để tạo mới hoặc cập nhật một reaction (like/dislike)
Router.route('/')
    .post(commentReactionController.createOrUpdateReaction)

// Route để lấy thông tin một reaction cụ thể bằng ID của nó
Router.route('/')
    .get(commentReactionController.getReactionById)

// Route để xóa một reaction
Router.route('/')
    .delete(commentReactionController.deleteReaction)

// Route để đếm số lượng like/dislike của một comment
Router.route('/count')
    .get(commentReactionController.countReactions)

// Route để lấy tất cả reactions của một comment
Router.route('/by_comment')
    .get(commentReactionController.getReactionsByComment)

Router.route('/by_product')
    .get(commentReactionController.getReactionsByProduct)

// Route để lấy tất cả reactions của một user
Router.route('/by_user')
    .get(commentReactionController.getReactionsByUser)

export default Router