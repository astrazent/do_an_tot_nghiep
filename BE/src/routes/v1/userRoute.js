import express from 'express'
import {userController} from '../../controllers/userController.js'
import {verifyToken} from '../../middlewares/authMiddleware.js'
const Router = express.Router()

Router.route('/').get(verifyToken,userController.getByIdUser) 

Router.route('/list').get(verifyToken,userController.getListUser) 

Router.route('/').patch(verifyToken,userController.updateUser) 

Router.route('/').delete(verifyToken,userController.deleteUser) 

export default Router
