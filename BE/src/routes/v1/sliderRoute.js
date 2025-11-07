import express from 'express'
import { sliderController } from '~/controllers/sliderController'

const Router = express.Router()

// Tạo mới slider
Router.route('/').post(sliderController.createSlider)

// Lấy slider theo ID
Router.route('/').get(sliderController.getByIdSlider)

// Lấy danh sách slider
Router.route('/list').get(sliderController.getListSlider)

// Cập nhật slider theo ID
Router.route('/').patch(sliderController.updateSlider)

// Xóa slider theo ID
Router.route('/').delete(sliderController.deleteSlider)

export default Router
