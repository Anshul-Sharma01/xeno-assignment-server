import { Router } from "express";
import DashboardController from "../controllers/dashboard.controller.js";
import { authenticateTenant } from "../middleware/auth.middleware.js";


const router = Router();

router.get("/:tenantId/summary", authenticateTenant, DashboardController.getSummary);
router.get("/:tenantId/orders-by-date", authenticateTenant, DashboardController.getOrdersByDate);
router.get("/:tenantId/top-customers", authenticateTenant, DashboardController.getTopCustomers);

export default router;