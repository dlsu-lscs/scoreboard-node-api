import { Router } from "express";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";
import { validateApiKey } from "../middlewares/auth.middleware.js";
import { getScoreByMemberId } from "../services/scores.services.js";

import * as AuthController from "../controllers/auth.controller.js";

const router = Router();

router.get("/api/auth/login-url", validateApiKey, AuthController.getLoginUrl);

router.get("/api/auth/login", AuthController.getLoginPage);

router.get("/api/auth/get-session", async (req, res) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json(null);
    }

    console.debug("[get-session] User from DB:", {
      userId: session.user.id,
      email: session.user.email,
      idNumber: session.user.idNumber,
      idNumberType: typeof session.user.idNumber,
    });

    let score = 0;
    if (session.user.idNumber) {
      const scoreRecord = await getScoreByMemberId(session.user.idNumber);
      score = scoreRecord ? scoreRecord.score : 0;
    }

    session.user.score = score;

    return res.json(session);
  } catch (error) {
    console.error("[get-session] Failed to fetch session with score:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.all("/api/auth/*splat", toNodeHandler(auth));

export default router;
