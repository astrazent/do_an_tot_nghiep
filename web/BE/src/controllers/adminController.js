import { adminService } from '~/services/adminService'
import { StatusCodes } from 'http-status-codes'

const addAmin = async (req, res, next) => {
    try {
        const data = await adminService.addAdminService(req.validated)
        return res.status(StatusCodes.CREATED).json({
            message: 'Đăng ký thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const loginAmin = async (req, res, next) => {
    try {
        const data = await adminService.loginAdminService(req.validated)

        return res.status(StatusCodes.OK).json({
            message: 'Đăng nhập thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const adminController = {
    addAmin,
    loginAmin,
}
