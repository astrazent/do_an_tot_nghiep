import express from 'express'
import { postController } from '~/controllers/postController'
import { upload, uploadCloudinary } from '~/middlewares/uploadCloudinary'
const Router = express.Router()

Router.route('/').post(
    upload.array('images', 10),
    uploadCloudinary,
    postController.createPost
)

Router.route('/').get(postController.getByIdPost)

Router.route('/by_slug').get(postController.getBySlug)

Router.route('/by_category_slug').get(postController.getByCategorySlug)

Router.route('/by_post_type_slug').get(postController.getByPostTypeSlug)

Router.route('/related_by_slug').get(postController.getRelatedByPostSlug)

Router.route('/list').get(postController.getListPost)

Router.route('/').patch(postController.updatePost)

Router.route('/').delete(postController.deletePost)

export default Router
