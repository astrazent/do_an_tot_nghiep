/**
 * Chức năng: Quản lý biến môi trường, load từ .env và chuẩn hóa cho toàn dự án
 */
import dotenv from 'dotenv'
dotenv.config() 

export const env = {
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 55555,
    DB_USER: process.env.DB_USER || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'bep_sach_viet',
    APP_PORT: process.env.APP_PORT || 8023,
    APP_HOST: process.env.APP_HOST || 'localhost',
    BUILD_MODE: process.env.BUILD_MODE || 'development',
    JWT_SECRET: process.env.JWT_SECRET || 'bepsachviet123',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'bepsachviet6969',
    ACCESS_EXPIRES: process.env.ACCESS_EXPIRES || '15m',
    REFRESH_EXPIRES: process.env.REFRESH_EXPIRES || '7d',
    AUTHOR: process.env.AUTHOR || 'NP',
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY
}
