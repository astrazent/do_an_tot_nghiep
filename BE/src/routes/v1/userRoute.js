import express from 'express'
import {userController} from '../../controllers/userController.js'
const Router = express.Router()

Router.route('/').get(userController.getByIdUser) 

Router.route('/list').get(userController.getListUser) 

Router.route('/').patch(userController.updateUser) 

Router.route('/').delete(userController.deleteUser) 

export default Router
