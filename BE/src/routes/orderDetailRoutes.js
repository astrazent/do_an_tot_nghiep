// routes/orderRoutes.js
import express from "express";
import { getOrderDetail } from "../controllers/oderDetailController.js";

const router = express.Router();

// GET /orders/:id
router.get("/:id", getOrderDetail);

export default router;