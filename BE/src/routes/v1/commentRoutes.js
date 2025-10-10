import express from 'express'
import {
    createComment,
    getProductComments,
} from '../../controllers/commentController.js'

const Router = express.Router()

// API thêm comment
Router.post('/', createComment)

// API lấy danh sách comment + thống kê
Router.get('/:productId', getProductComments)

export default Router
