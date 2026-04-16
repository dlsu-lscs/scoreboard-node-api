import express, { urlencoded, json } from "express";
import { initDB, closeDB } from "./config/connect.js";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./config/auth.js";
import scoresRouter from "./routes/scores.routes.js";
import "dotenv/config";

const app = express();

const startServer = async () => {
  try {
    await initDB();

    console.log("Databases initialized.");

    // Login URL endpoint - must be before better-auth mount
    app.get("/api/auth/login-url", (req, res) => {
      const baseUrl = process.env.BETTER_AUTH_URL || process.env.APP_URL || 'http://localhost:3000';
      const callbackUrl = encodeURIComponent(baseUrl + '/');
      const loginUrl = `${baseUrl}/api/auth/sign-in/social?provider=google&callbackURL=${callbackUrl}`;
      res.json({ loginUrl });
    });

    app.all("/api/auth/*splat", toNodeHandler(auth));

    app.use(json());
    app.use(urlencoded({ extended: true }));

    app.use("/api/scores", scoresRouter); // changed this from /users

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
