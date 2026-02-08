import { Router } from "express";
import * as ScoresController from "../controllers/scores.controllers.js";
import { authenticateApiSecret } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateApiSecret);

router.delete("/", ScoresController.deleteScore);
router.put("/:id", ScoresController.updateScore);
router.get("/:id", ScoresController.getScoreByMemberId);

router.get("/", ScoresController.getScores);
router.post("/", ScoresController.createScore);

export default router;
