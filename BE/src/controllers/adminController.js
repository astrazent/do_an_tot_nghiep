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

        // res.cookie('token', token, {
        //     httpOnly: true, // không cho JS trên browser đọc cookie này
        //     secure: true, // chỉ gửi cookie qua HTTPS
        //     sameSite: 'strict', // chống CSRF (strict/lax tùy use case)
        //     maxAge: 2 * 60 * 60 * 1000, // 2h
        // })

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
