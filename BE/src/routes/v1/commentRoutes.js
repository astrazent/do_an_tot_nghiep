import express from 'express'
import * as commentController from '../../controllers/commentController.js'

const Router = express.Router()

// API thêm comment
Router.post('/:productId/comments', commentController.createComment)

// API lấy danh sách comment + thống kê
Router.get('/:productId/comments', commentController.getProductComments)

export default Router
