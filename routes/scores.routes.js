import { Router } from "express";
import multer from "multer";
import * as ScoresController from "../controllers/scores.controllers.js";
import {
  validateApiKey,
  validateSession,
} from "../middlewares/auth.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.use(validateApiKey);
router.use(validateSession);

router.delete("/:id", ScoresController.deleteScore);
router.put("/:id", ScoresController.updateScore);

router.post("/upload", upload.single("file"), ScoresController.uploadScoreFile);

router.get("/:id", ScoresController.getScoreByMemberId);
router.get("/top", ScoresController.getTop10);
router.get("/", ScoresController.getScores);
router.post("/", ScoresController.createScore);

export default router;
