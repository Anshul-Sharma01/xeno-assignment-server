import { Router } from "express";
import IngestionController from "../controllers/ingestion.controller.js";
import { authenticateTenant } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/sync/:tenantId", authenticateTenant, IngestionController.syncTenantData);


export default router;