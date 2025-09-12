import { ZodError } from "zod";

export const validateBody = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        return next();
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                error: "Validation failed",
                issues: err?.errors?.map((e) => ({
                    path: e.path.join('.'),
                    message: e.message,
                    code: e.code
                }))
            });
        }
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
};


