import { Router } from "express";
import IngestionController from "../controllers/ingestion.controller.js";

const router = Router();

router.post("/sync/:tenantId", IngestionController.syncTenantData);


export default router;