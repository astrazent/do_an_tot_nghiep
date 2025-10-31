import express from 'express'
import { aiController } from '~/controllers/aiController'
const Router = express.Router()

Router.route('/summary_comment').post(aiController.postCommentAI)

export default Router