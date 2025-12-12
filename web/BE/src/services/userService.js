import bcrypt from 'bcryptjs/dist/bcrypt'
import { UsersModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { AdminsModel } from '~/models/adminModel'

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
        provider: 'local',
        password_hash: hashedPassword,
        email: payload.email,
        phone: payload.phone,
        full_name: payload.full_name,
    })

    delete userData.password_hash
    return userData
}

export const registerGoogleUserService = async payload => {
    const {
        email,
        full_name,
        googleId,
        avatar_url,
        first_name,
        last_name,
        email_verified,
    } = payload

    const existedEmail = await UsersModel.findUserByEmailOrUsername(email)
    if (existedEmail)
        throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại')

    const username = email.split('@')[0]

    const existedUsername = await UsersModel.findUserByEmailOrUsername(username)
    if (existedUsername)
        throw new ApiError(StatusCodes.CONFLICT, 'Username đã tồn tại')

    const userData = await UsersModel.createUser({
        username,
        email,
        full_name: full_name || `${first_name || ''} ${last_name || ''}`.trim(),
        provider: 'google',
        provider_id: googleId,
        phone: null,
        gender: 'other',
        avatar_url: avatar_url || null,
        status: 1,
        email_verified: email_verified ?? true,
    })

    delete userData.password_hash
    return userData
}

const loginService = async payload => {
    const user = await UsersModel.findUserByEmailOrUsername(payload.username)
    const admin = await AdminsModel.getAdminByUsername(payload.username)
    let account
    if (!user) {
        account = admin
    } else {
        account = user
    }
    if (!account) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai username')
    }
    const isPasswordValidUser = await bcrypt.compare(
        payload.password,
        account.password_hash
    )
    if (!isPasswordValidUser) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai password')
    }
    return account
}

const getByIdUserService = async data => {
    const user = await UsersModel.getUserById(data)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }

    return user
}

export const checkPasswordAndUpdateService = async ({
    userId,
    old_password,
    data,
}) => {
    const user = await UsersModel.getUserById(userId)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }

    if (!user.password_hash) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            'Tài khoản này không có mật khẩu'
        )
    }

    const isMatch = await bcrypt.compare(old_password, user.password_hash)
    if (!isMatch) {
        throw new ApiError(
            StatusCodes.UNAUTHORIZED,
            'Mật khẩu cũ không chính xác'
        )
    }

    if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10)
        data.password_hash = hashedPassword
        delete data.password
    }

    const updatedUser = await UsersModel.updateUser(userId, data)

    const { password_hash, ...safeUser } = updatedUser
    return safeUser
}

const findUserByEmailService = async email => {
    const user = await UsersModel.findUserByEmailOrUsername(email)
    return user
}

const getListUserService = async data => {
    const listUser = await UsersModel.listUsers(data.limit, data.offset)

    if (!listUser) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user nào')
    }

    return listUser
}

const updateUserService = async (userId, data) => {
    const user = await UsersModel.getUserById(userId)
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }
    const newUpdate = await UsersModel.updateUser(userId, data)

    return newUpdate
}

const deleteUserService = async userId => {
    const user = await UsersModel.getUserById(userId)

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy user')
    }

    await UsersModel.deleteUser(userId)

    return { message: 'Xóa user thành công' }
}

const getDashboardSummary = async date => {
    const result = await UsersModel.getDashboardSummary(date)
    return result
}

export const userService = {
    registerService,
    loginService,
    getByIdUserService,
    checkPasswordAndUpdateService,
    findUserByEmailService,
    registerGoogleUserService,
    getListUserService,
    updateUserService,
    deleteUserService,
    getDashboardSummary,
}
