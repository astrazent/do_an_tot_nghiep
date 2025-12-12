import express from 'express'
import { postTypeController } from '~/controllers/postTypeController'

const Router = express.Router()

Router.route('/').post(postTypeController.createPostType)

Router.route('/').get(postTypeController.getByIdPostType)

Router.route('/list').get(postTypeController.getListPostType)

Router.route('/').patch(postTypeController.updatePostType)

Router.route('/').delete(postTypeController.deletePostType)

export default Router
