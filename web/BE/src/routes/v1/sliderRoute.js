import express from 'express'
import { sliderController } from '~/controllers/sliderController'
import { upload, uploadCloudinary } from '~/middlewares/uploadCloudinary'

const Router = express.Router()

Router.route('/').post(
    upload.array('images', 10),
    uploadCloudinary,
    sliderController.createSlider
)

Router.route('/').get(sliderController.getByIdSlider)

Router.route('/list').get(sliderController.getListSlider)

Router.route('/:sliderId').patch(
    upload.array('images', 10),
    uploadCloudinary,
    sliderController.updateSlider
)

Router.route('/').delete(sliderController.deleteSlider)

export default Router
