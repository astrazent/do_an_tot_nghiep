// controllers/orderController.js
import { getOrderById } from "../services/orderDetailService.js";

export async function getOrderDetail(req, res) {
  const orderId = req.params.id;
  console.log("Received request for order_id:", orderId);

  try {
    const order = await getOrderById(orderId);

    if (!order) {
      console.log("Order not found for id:", orderId);
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err); // log chi tiết
    res.status(500).json({ 
      message: "Server error", 
      error: err.message  // trả về lỗi chi tiết để debug
    });
  }
}