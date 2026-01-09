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
        const {admin, accessToken} = await adminService.loginAdminService(req.validated)

        res.cookie('access_token_admin', accessToken, {
            httpOnly: false,     
            secure: process.env.FE_BASE_URL === 'production',
            sameSite: 'strict', 
            maxAge: 100 * 24 * 60 * 60 * 1000 
        })

        return res.status(StatusCodes.OK).json({
            message: 'Đăng nhập thành công',
            admin
        })
    } catch (error) {
        next(error)
    }
}

export const adminController = {
    addAmin,
    loginAmin,
}
