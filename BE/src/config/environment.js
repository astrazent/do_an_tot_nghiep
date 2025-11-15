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
    FE_BASE_URL: process.env.FE_BASE_URL || 'http://localhost:5173',
    AUTHOR: process.env.AUTHOR || 'NP',
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    VNP_URL: process.env.VNP_URL,
    VNP_TMN_CODE: process.env.VNP_TMN_CODE,
    VNP_RETURN_URL: process.env.VNP_RETURN_URL,
    VNP_HASH_SECRET: process.env.VNP_HASH_SECRET,
}
