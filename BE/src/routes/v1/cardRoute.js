import express from 'express'
import { CardController } from '~/controllers/cardController'

const Router = express.Router()

// /v1/cards
Router.route('/')
    .get(CardController.getCards) // Lấy cards theo column (query: ?columnId=123)
    .post(CardController.createCard) // Tạo mới card

// /v1/cards/:id
Router.route('/:id')
    .get(CardController.getCard) // Lấy chi tiết card
    .put(CardController.updateCard) // Cập nhật card
    .delete(CardController.deleteCard) // Xóa card

// /v1/cards/:id/move
Router.route('/:id/move').put(CardController.moveCard) // Di chuyển card giữa các columns

export default Router
