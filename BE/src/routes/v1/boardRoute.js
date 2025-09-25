import express from 'express'
import { boardValidation } from '~/validations/boardValidation'
import { boardController } from '~/controllers/boardController'
const Router = express.Router()

// /v1/boards
Router.route('/')
//   .get(boardController.getBoards)      // Lấy danh sách boards
  .post(boardValidation.createBoard, boardController.createBoard)   // Tạo mới board

// /v1/boards/:id
// Router.route('/:id')
//   .get(boardController.getBoard)       // Lấy chi tiết board
//   .put(boardController.updateBoard)    // Cập nhật board
//   .delete(boardController.deleteBoard) // Xóa board

export default Router;