import { AdminsModel } from '~/models/adminModel'
import bcrypt from 'bcryptjs/dist/bcrypt'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const addAdminService = async payload => {
    const existedEmail = await AdminsModel.getAdminByEmail(payload.email)
    if (existedEmail) {
        throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại')
    }

    const existedUsername = await AdminsModel.getAdminByUsername(
        payload.username
    )
    if (existedUsername) {
        throw new ApiError(StatusCodes.CONFLICT, 'Username đã tồn tại')
    }

    const hashedPassword = await bcrypt.hash(payload.password_hash, 10)

    const admin = await AdminsModel.createAdmin({
        username: payload.username,
        password_hash: hashedPassword,
        email: payload.email,
        full_name: payload.full_name,
        level: payload.level,
        description: payload.description,
        role_id: payload.role_id,
    })
    delete admin.password_hash
    return admin
}

const loginAdminService = async payload => {
    const admin = await AdminsModel.getAdminByUsername(payload.username)
    if (!admin) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai username')
    }
    const isPasswordValid = await bcrypt.compare(
        payload.password_hash,
        admin.password_hash
    )

    if (!isPasswordValid) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Sai password')
    }

    return admin
}

export const adminService = {
    addAdminService,
    loginAdminService,
}
