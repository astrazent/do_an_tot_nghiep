import express from 'express'
import { couponScopeController } from '~/controllers/couponScopeController'

const Router = express.Router()

Router.route('/').post(couponScopeController.createCouponScope)

Router.route('/').get(couponScopeController.getCouponScopeById)

Router.route('/list').get(couponScopeController.getListCouponScopes)

Router.route('/').patch(couponScopeController.updateCouponScope)

Router.route('/').delete(couponScopeController.deleteCouponScope)

export default Router
