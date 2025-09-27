// services/orderService.js
import {getConnection} from "../config/mysql.js";

export async function getOrderById(orderId) {
  try {
    const db = getConnection(); // Nếu connection chưa được tạo, sẽ throw
    const [rows] = await db.execute(
      `SELECT 
          o.order_id,
          o.order_date,
          o.status,
          o.total_amount,
          u.full_name AS customer_name,
          u.email,
          u.address,
          oi.quantity,
          oi.price,
          p.name AS product_name
       FROM Orders o
       JOIN Users u ON o.user_id = u.user_id
       JOIN OrderItems oi ON o.order_id = oi.order_id
       JOIN Products p ON oi.product_id = p.product_id
       WHERE o.order_id = ?`,
      [orderId]
    );

    if (rows.length === 0) {
      return null;
    }

    return {
      order_id: rows[0].order_id,
      order_date: rows[0].order_date,
      status: rows[0].status,
      total_amount: rows[0].total_amount,
      customer: {
        name: rows[0].customer_name,
        email: rows[0].email,
        address: rows[0].address,
      },
      items: rows.map((r) => ({
        product_name: r.product_name,
        quantity: r.quantity,
        price: r.price,
      })),
    };
  } catch (err) {
    console.error("Error in getOrderById:", err);
    throw err; // đẩy lỗi lên controller
  }
}