import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "../config/auth.js";
import { validateApiKey } from "../middlewares/auth.middleware.js";

import * as AuthController from "../controllers/auth.controller.js";

const router = Router();

router.get("/api/auth/login-url", validateApiKey, AuthController.getLoginUrl);

router.get("/api/auth/login", AuthController.getLoginPage);
router.all("/api/auth/*splat", toNodeHandler(auth));

export default router;
