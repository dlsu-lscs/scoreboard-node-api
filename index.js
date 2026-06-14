import express, { urlencoded, json } from "express";
import cookieParser from "cookie-parser";
import { initDB, closeDB } from "./config/connect.js";
import scoresRouter from "./routes/scores.routes.js";
import authRouter from "./routes/auth.routes.js";
import "dotenv/config";
import { webcrypto as crypto } from "node:crypto";
import { corsOptions } from "./config/cors.js";
import cors from "cors";

const app = express();

const startServer = async () => {
  try {
    await initDB();

    console.log("Databases initialized.");
    app.use(cors(corsOptions));

    // Cookie parser MUST be before auth routes for OAuth state matching
    app.use(cookieParser());

    app.use(authRouter);

    app.use(json());
    app.use(urlencoded({ extended: true }));

    // Services routes
    app.use("/api/scores", scoresRouter);

    app.get("/", (req, res) => {
      res.status(200).json({
        status: "Ok",
        message: "LSCS Scoreboard API app is running.",
      });
    });

    const server = app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port: ${process.env.PORT}`);
    });

    const shutdown = async () => {
      console.log("Shutting down...");

      server.close();

      try {
        await closeDB();

        console.log("All connections closed.");
        process.exit(0);
      } catch (err) {
        console.log("Error on shutdown: ", err);
        process.exit(1);
      }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (err) {
    console.error("Server startup error: ", err);
    process.exit(1);
  }
};

startServer().catch((err) => {
  console.error("Error during server initialization: ", err);
  process.exit(1);
});

export default app;
