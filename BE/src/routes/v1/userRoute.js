import express from 'express'
import {userController} from '../../controllers/userController.js'
import {verifyToken} from '../../middlewares/authMiddleware.js'
import multer from 'multer'
const Router = express.Router()
const upload = multer()

Router.route('/').get(verifyToken,userController.getByIdUser) 

Router.route('/list').get(verifyToken,userController.getListUser)

Router.route('/check_and_update').post(verifyToken, userController.checkPasswordAndUpdate)

Router.route('/').patch(verifyToken, upload.single('avatar'), userController.updateUser)

Router.route('/').delete(verifyToken,userController.deleteUser) 

export default Router
