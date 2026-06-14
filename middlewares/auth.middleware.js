import "dotenv/config";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../config/auth.js";
import { getScoreByMemberId } from "../services/scores.services.js";

export function validateApiKey(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    return res
      .status(401)
      .json({ message: "Unauthorized: No API key provided." });
  }

  if (apiKey !== process.env.API_SECRET) {
    return res.status(401).json({ message: "Unauthorized: Invalid API key." });
  }

  return next();
}

export async function validateSession(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Invalid or expired session." });
    }

    req.user = session.user;
    req.session = session.session;

    if (req.user.idNumber) {
      try {
        const scoreRecord = await getScoreByMemberId(req.user.idNumber);
        req.user.score = scoreRecord ? scoreRecord.score : 0;
      } catch (error) {
        console.error("[validateSession] Failed to fetch score:", error);
        req.user.score = 0;
      }
    } else {
      req.user.score = 0;
    }

    return next();
  } catch (error) {
    console.error("Session validation error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized: Session validation failed." });
  }
}

export { validateApiKey as authenticateApiSecret };
