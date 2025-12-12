import express from 'express'
import { adminController } from '~/controllers/adminController'
import { adminValidation } from '~/validations/adminValidation.js'
const Router = express.Router()

Router.route('/').post(
    adminValidation.validateCreateAdmin,
    adminController.addAmin
)

Router.route('/login').post(
    adminValidation.validateLoginAdmin,
    adminController.loginAmin
)

export default Router
