import { userService } from '../services/userService.js'
import { StatusCodes } from 'http-status-codes'


const register = async (req, res, next) => {
    try {
        const data = await userService.registerService(req.validated)
        return res.status(StatusCodes.CREATED).json({
            message: 'Đăng ký thành công',
            data,
        })
    } catch (err) {
        return next(err)
    }
}

const login = async (req, res, next) => {
    try {
        const data = await userService.loginService(req.validated)      
        return res.status(StatusCodes.OK).json({
            message: 'Đăng nhập thành công',
            data,
        })
    } catch (err) {
        return next(err)
    }   
}

export const userController = { register, login }
