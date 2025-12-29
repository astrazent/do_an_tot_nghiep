import { userService } from '../services/userService.js'
import { StatusCodes } from 'http-status-codes'

const getByIdUser = async (req, res, next) => {
    try {
        const { userId } = req.query
        if (!userId) {
            return res.status(400).json({ message: 'Thiếu userId' })
        }
        const data = await userService.getByIdUserService(userId)
        return res.status(200).json({
            message: 'Lấy thông tin khách hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getListUser = async (req, res, next) => {
    try {
        const data = await userService.getListUserService(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy danh sách khách hàng thành công',
            data,
        })
    } catch (error) {
        next(error)
    }
}

export const checkPasswordAndUpdate = async (req, res, next) => {
    try {
        const { userId, old_password, ...data } = req.body

        const result = await userService.checkPasswordAndUpdateService({
            userId,
            old_password,
            data,
        })

        return res.status(StatusCodes.OK).json({
            message: 'Cập nhật thông tin thành công',
            data: result,
        })
    } catch (error) {
        next(error)
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
        next(error)
    }
}

const deleteUser = async (req, res, next) => {
    try {
        const data = await userService.deleteUserService(req.query.userId)

        return res.status(StatusCodes.OK).json({
            data,
        })
    } catch (error) {
        next(error)
    }
}

const getDashboardSummary = async (req, res, next) => {
    try {
        const result = await userService.getDashboardSummary(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}

const getListCustomerByExpense = async (req, res, next) => {
    try {
        const result = await userService.getListCustomerByExpense(req.query)
        return res.status(StatusCodes.OK).json({
            message: 'Lấy data thành công',
            data: result,
        })
    } catch (error) {
        next(error)
    }
}


export const userController = {
    getByIdUser,
    getListUser,
    checkPasswordAndUpdate,
    updateUser,
    deleteUser,
    getDashboardSummary,
    getListCustomerByExpense
}
