import bcrypt from 'bcryptjs/dist/bcrypt'
import jwt from 'jsonwebtoken'
import { UsersModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

export const registerService = async payload => {
    const existedEmail = await UsersModel.findUserByEmailOrUsername(
        payload.email
    )
    if (existedEmail) {
        throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại')
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
export const userService = { registerService, loginService }
