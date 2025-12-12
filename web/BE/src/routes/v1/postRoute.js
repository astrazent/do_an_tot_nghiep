import express from 'express'
import { postController } from '~/controllers/postController'
const Router = express.Router()

Router.route('/').post(postController.createPost)

Router.route('/').get(postController.getByIdPost)

Router.route('/by_slug').get(postController.getBySlug)

Router.route('/by_category_slug').get(postController.getByCategorySlug)

Router.route('/by_post_type_slug').get(postController.getByPostTypeSlug)

Router.route('/related_by_slug').get(postController.getRelatedByPostSlug)

Router.route('/list').get(postController.getListPost)

Router.route('/').patch(postController.updatePost)

Router.route('/').delete(postController.deletePost)

export default Router
