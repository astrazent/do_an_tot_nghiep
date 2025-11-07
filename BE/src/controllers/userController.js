import { userService } from '../services/userService.js'
import { StatusCodes } from 'http-status-codes'
import ErrorServer from '~/utils/ErrorServer'

const getByIdUser = async (req, res, next) => {
    try {
        const hasQueryParams = Object.keys(req.query).length > 0
        const userData = hasQueryParams ? req.query : req.user
        const data = await userService.getByIdUserService(userData)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy thông tin khách hàng thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const getListUser = async (req, res, next) => {
    try {
        const data = await userService.getListUserService(req.body)

        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách khách hàng thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const updateUser = async (req, res, next) => {
    try {
        const data = await userService.updateUserService(
            req.query.userId,
            req.body
        )

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật thông tin thành công',
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const data = await userService.deleteUserService(req.query.userId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        return ErrorServer(error, req, res, next)
    }
}

export const userController = {
    getByIdUser,
    getListUser,
    updateUser,
    deleteUser,
}
