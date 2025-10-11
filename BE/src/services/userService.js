import bcrypt from 'bcryptjs/dist/bcrypt'
import jwt from 'jsonwebtoken'
import { UsersModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { env } from '~/config/environment.js'

export const registerService = async payload => {
    const existedEmail = await UsersModel.findUserByEmailOrUsername(
        payload.email
    )
    if (existedEmail) {
        throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại')
    }

    const existedPhone = await UsersModel.findUserByPhone(payload.phone)
    if (existedPhone) {
        throw new ApiError(StatusCodes.CONFLICT, 'Số điện thoại đã tồn tại')
    }

    const existedUsername = await UsersModel.findUserByEmailOrUsername(
        payload.username
    )
    if (existedUsername) {
        throw new ApiError(StatusCodes.CONFLICT, 'Username đã tồn tại')
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10)

    const userData = await UsersModel.createUser({
        username: payload.username,
        password_hash: hashedPassword,
        email: payload.email,
        phone: payload.phone,
        full_name: payload.full_name,
    })

    const token = jwt.sign(
        {
            username: userData.username,
            userId: userData.id,
            full_name: userData.full_name,
        },
        env.JWT_SECRET || 'bepsachviet123'
    )

    await UsersModel.updateUser(userData.id, { token: token })
    userData.token = token

    delete userData.password_hash
    return userData
}

const loginService = async payload => {
    const user = await UsersModel.findUserByEmailOrUsername(payload.username)
    if (!user) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai username')
    }
    const isPasswordValid = await bcrypt.compare(
        payload.password,
        user.password_hash
    )

    if (!isPasswordValid) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai password')
    }

    return user
}

const getByIdUserService = async data => {
    const user = await UsersModel.getUserById(data.userId)

    if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }

    return user
}

const getListUserService = async data => {
    const listUser = await UsersModel.listUsers(data.limit, data.offset)

    if(!listUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user nào')
    }

    return listUser
}

const updateUserService = async (userId, data) => {
    const user = await UsersModel.getUserById(userId)

    if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }

    const newUpdate = await UsersModel.updateUser(userId, data)

    return newUpdate
    
}

const deleteUserService = async userId => {
    const user = await UsersModel.getUserById(userId)

    if(!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }
    
    await UsersModel.deleteUser(userId)

    return ({message: "Xóa user thành công"})
}
export const userService = {
    registerService,
    loginService,
    getByIdUserService,
    getListUserService,
    updateUserService,
    deleteUserService,
}
