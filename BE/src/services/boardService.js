/**
 * Chức năng: Chứa các business logic (nghiệp vụ chính), tách riêng khỏi controller
 * Tạo file mới:
 *   - Khi có entity cần xử lý logic phức tạp (UserService.js, ProductService.js, OrderService.js)
 *   - Khi có chức năng chung cần tái sử dụng nhiều nơi (AuthService.js, ReportService.js)
 */

import ApiError from "~/utils/ApiError"
import { slugify } from '~/utils/formatters'
const createBoard = async (reqBody) => {
    try {
        // xử lý logic dữ liệu
        const newBoard = {
            ...reqBody,
            slug: slugify(reqBody.title)
        }
        // Gọi đến tầng Model để xử lý lưu bản ghi newBoard vào trong database
        //...
        // Bắn email, notification về cho admin,...vv

        //Luôn phải trả kết quả về trong service
        return newBoard
    } catch (error) { throw error }
}
export const boardService = {
    createBoard
}