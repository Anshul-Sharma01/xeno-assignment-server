import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller.js";


const router = Router();

router.get("/:tenantId/summary", DashboardController.getSummary);
router.get("/:tenantId/orders-by-date", DashboardController.getOrdersByDate);
router.get("/:tenantId/top-customers", DashboardController.getTopCustomers);

export default router;