import express from 'express'
import { aiFeedbackController } from '~/controllers/aiFeedbackController'

const Router = express.Router()

Router.route('/').post(aiFeedbackController.createFeedback)

Router.route('/create_or_update').post(aiFeedbackController.createOrUpdateFeedbackBySlug)

Router.route('/').get(aiFeedbackController.getByIdFeedback)

Router.route('/by_product').get(aiFeedbackController.getListFeedbackByProduct)

Router.route('/by_user').get(aiFeedbackController.getListFeedbackByUser)

Router.route('/').patch(aiFeedbackController.updateFeedback)

Router.route('/').delete(aiFeedbackController.deleteFeedback)

export default Router
