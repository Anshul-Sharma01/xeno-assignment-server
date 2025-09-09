import { Router } from "express";
import TenantController from "../controllers/tenant.controller.js";

const router = Router();

router.post("/register", TenantController.register);
router.post("/login", TenantController.login);
router.post("/refresh-token", TenantController.refreshToken);
router.post("/logout", TenantController.logout);

export default router;