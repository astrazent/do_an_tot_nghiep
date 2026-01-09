import express from 'express'
import { couponScopeController } from '~/controllers/couponScopeController'
import { couponScopeValidation } from '~/validations/couponScopeValidation'

const Router = express.Router()

Router.route('/').post(
    couponScopeValidation.validateCreateCouponScope,
    couponScopeController.createCouponScope
)

Router.route('/').get(couponScopeController.getCouponScopeById)

Router.route('/list').get(couponScopeController.getListCouponScopes)

Router.route('/').patch(
    couponScopeValidation.validateUpdateCouponScope,
    couponScopeController.updateCouponScope
)

Router.route('/').delete(couponScopeController.deleteCouponScope)

export default Router
