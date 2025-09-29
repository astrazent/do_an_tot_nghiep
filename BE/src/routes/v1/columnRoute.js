import express from 'express'
import { ColumnController } from '~/controllers/columnController'

const Router = express.Router()

// /v1/columns
Router.route('/')
    .get(ColumnController.getColumns) // Lấy columns theo board (?boardId=123)
    .post(ColumnController.createColumn) // Tạo mới column

// /v1/columns/:id
Router.route('/:id')
    .put(ColumnController.updateColumn) // Cập nhật column (kéo thả, đổi tên)
    .delete(ColumnController.deleteColumn) // Xóa column

export default Router
