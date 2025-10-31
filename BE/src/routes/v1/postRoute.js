import express from 'express'
import { postController } from '~/controllers/postController'
const Router = express.Router()

Router.route('/').post(postController.createPost) 

Router.route('/').get(postController.getByIdPost)

Router.route('/list').get(postController.getListPost)

Router.route('/').patch(postController.updatePost)

Router.route('/').delete(postController.deletePost)


export default Router