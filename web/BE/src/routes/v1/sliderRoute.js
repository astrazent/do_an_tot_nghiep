import express from 'express'
import { sliderController } from '~/controllers/sliderController'

const Router = express.Router()

Router.route('/').post(sliderController.createSlider)

Router.route('/').get(sliderController.getByIdSlider)

Router.route('/list').get(sliderController.getListSlider)

Router.route('/').patch(sliderController.updateSlider)

Router.route('/').delete(sliderController.deleteSlider)

export default Router
