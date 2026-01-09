import express from 'express'
import { couponController } from '~/controllers/couponController'
import { couponValidation } from '~/validations/couponValidation.js'

const router = express.Router()

router.post(
    '/',
    couponValidation.validateCreateCoupon,
    couponController.createCoupon
)

router.get('/', couponController.getListCoupons)

router.get('/get_by_code', couponController.getCouponByCode)

router.get('/detail', couponController.getCouponById)

router.get('/type', couponController.getCouponsByType)

router.patch(
    '/',
    couponValidation.validateUpdateCoupon,
    couponController.updateCoupon
)

router.delete('/', couponController.deleteCoupon)

export default router
