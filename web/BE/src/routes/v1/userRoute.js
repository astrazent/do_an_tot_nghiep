import express from 'express'
import { userController } from '../../controllers/userController.js'
import { verifyToken } from '../../middlewares/authMiddleware.js'
import { uploadCloudinary, upload } from '~/middlewares/uploadCloudinary'
const Router = express.Router()

Router.route('/').get(userController.getByIdUser)

Router.route('/list').get(userController.getListUser)

Router.route('/customer_type').get(userController.getListCustomerByExpense)

Router.route('/check_and_update').post(
    verifyToken,
    userController.checkPasswordAndUpdate
)

Router.route('/').patch(
    verifyToken,
    upload.array('avatar', 1),
    uploadCloudinary,
    userController.updateUser
)

Router.route('/').delete(userController.deleteUser)

Router.route('/dashboard_summary').get(userController.getDashboardSummary)

export default Router
