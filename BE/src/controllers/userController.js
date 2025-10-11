import { userService } from '../services/userService.js'
import { StatusCodes } from 'http-status-codes'
import ErrorService from '../utils/ErrorServer.js'

const register = async (req, res, next) => {
    try {
        const data = await userService.registerService(req.validated)
        return res.status(StatusCodes.CREATED).json({
            message: 'Đăng ký thành công',
            data,
        })
    } catch (err) {
        return ErrorService(err,next)
    }
}

const login = async (req, res, next) => {
    try {
        const data = await userService.loginService(req.validated)

        res.cookie('token', data.token, {
            httpOnly: true, // không cho JS trên browser đọc cookie này
            secure: true, // chỉ gửi cookie qua HTTPS
            sameSite: 'strict', // chống CSRF (strict/lax tùy use case)
            maxAge: 2 * 60 * 60 * 1000, // 2h
        })

        return res.status(StatusCodes.OK).json({
            message: 'Đăng nhập thành công',
            data,
        })
    } catch (err) {
        return ErrorService(err,next)
    }
}

const getByIdUser = async (req, res, next) => {
    try {
        const data = await userService.getByIdUserService(req.query)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin khách hàng thành công',
            data,
        })
    } catch (err) {
        return ErrorService(err,next)
    }
}

const getListUser = async (req, res, next) => {
    try {
        const data = await userService.getListUserService(req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách khách hàng thành công',
            data,
        })
    } catch (err) {
        return ErrorService(err,next)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const data = await userService.updateUserService(req.query.userId, req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật thông tin thành công',
            data,
        })
    } catch (err) {
        return next(err)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const data = await userService.deleteUserService(req.query.userId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (err) {
        return ErrorService(err,next)
    }
}

export const userController = {
    register,
    login,
    getByIdUser,
    getListUser,
    updateUser,
    deleteUser,
}
