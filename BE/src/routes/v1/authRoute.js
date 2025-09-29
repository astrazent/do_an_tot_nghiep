import express from 'express'
import {userController} from '../../controllers/userController.js'
import {userValidation} from '../../validations/userValidation.js'
const Router = express.Router()

Router.route('/register').post(userValidation.validateRegister, userController.register) 

Router.route('/login').post(userValidation.validateLogin, userController.login)

export default Router
