import "dotenv/config";
import { getMigrations } from "better-auth/db";
import { auth } from "../config/auth.js";

const run = async () => {
  try {
    const { toBeCreated, toBeAdded, runMigrations } = await getMigrations(
      auth.options,
    );

    const createCount = toBeCreated.length;
    const addCount = toBeAdded.length;

    if (createCount === 0 && addCount === 0) {
      console.log("better-auth schema is up to date.");
      process.exit(0);
    }

    console.log(`better-auth: ${createCount} table(s) to create.`);
    console.log(`better-auth: ${addCount} table(s) to alter.`);

    await runMigrations();

    console.log("better-auth migrations applied successfully.");
    process.exit(0);
  } catch (error) {
    console.error("better-auth migration failed:", error);
    process.exit(1);
  }
};

run();
