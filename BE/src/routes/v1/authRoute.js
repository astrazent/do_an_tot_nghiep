import express from 'express'
import { authController } from '~/controllers/authController.js'
import {userValidation} from '../../validations/userValidation.js'
import { googleAuthValidation } from '~/validations/googleAuthValidation.js'
import {verifyToken} from '../../middlewares/authMiddleware.js'
const Router = express.Router()

Router.route('/register').post(userValidation.validateRegister, authController.register) 

Router.route('/login').post(userValidation.validateLogin, authController.login)

Router.route('/google').post(googleAuthValidation.validateGoogleLogin, authController.loginGoogle)

Router.route('/refresh').post(authController.refreshToken)

Router.route('/logout').post(authController.logout)

Router.route('/verify').get(verifyToken, authController.validateToken)

export default Router
