import express from 'express'
import { postTypeController } from '~/controllers/postTypeController'

const Router = express.Router()

// Tạo mới loại bài viết
Router.route('/').post(postTypeController.createPostType)

// Lấy loại bài viết theo ID
Router.route('/').get(postTypeController.getByIdPostType)

// Lấy danh sách loại bài viết
Router.route('/list').get(postTypeController.getListPostType)

// Cập nhật loại bài viết theo ID
Router.route('/').patch(postTypeController.updatePostType)

// Xóa loại bài viết theo ID
Router.route('/').delete(postTypeController.deletePostType)

export default Router
