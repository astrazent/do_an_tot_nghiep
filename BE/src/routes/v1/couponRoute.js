import express from 'express'
import { couponController } from '~/controllers/couponController'

const router = express.Router()

router.post('/', couponController.createCoupon)

router.get('/', couponController.getListCoupons)

router.get('/detail', couponController.getCouponById)

router.get('/type', couponController.getCouponsByType)

router.patch('/', couponController.updateCoupon)

router.delete('/', couponController.deleteCoupon)

export default router
