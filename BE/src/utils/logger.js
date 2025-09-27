import winston from 'winston'
import 'winston-daily-rotate-file'
import path from 'path'

const logDirectory = path.join(process.cwd(), 'logs') // folder lưu log

// Tạo transport để ghi log mỗi ngày 1 file, tự xoá sau 5 ngày
const transport = new winston.transports.DailyRotateFile({
    filename: '%DATE%.log', // ví dụ: 2025-09-25.log
    dirname: logDirectory,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true, // nén log cũ
    maxFiles: '5d', // giữ log 5 ngày
    level: 'error', // chỉ log error trở lên
})

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(
            info =>
                `[${info.timestamp}] ${info.level.toUpperCase()}: ${
                    info.message
                }`
        )
    ),
    transports: [transport],
})
