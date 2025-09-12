import { Router } from "express";
import TenantController from "../controllers/tenant.controller.js";
import { z } from "zod";
import { validateBody } from "../middleware/validate.middleware.js";

const router = Router();

const emailSchema = z.string().min(1, "Email is required").email("Invalid email format");
const passwordSchema = z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: emailSchema,
    password: passwordSchema,
    shopifyDomain: z.string().min(1, "Shopify domain is required"),
    accessToken: z.string().min(1, "Access token is required"),
});
router.post("/register", validateBody(registerSchema), TenantController.register);
router.post("/login", TenantController.login);
router.post("/refresh-token", TenantController.refreshToken);
router.post("/logout", TenantController.logout);

export default router;