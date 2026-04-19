import "dotenv/config";
import mysql from "mysql2/promise";
import { betterAuth, APIError } from "better-auth";
import { checkMembershipByEmail } from "../services/lscs-core.services.js";

export const authDatabase = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  port: Number(process.env.DB_PORT || 3306),
});

export const auth = betterAuth({
  database: authDatabase,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.BETTER_AUTH_BASE_URL ||
    "http://localhost:3000",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.WEB_ORIGIN ?? "http://localhost:3000",
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          try {
            const { isMember } = await checkMembershipByEmail(user.email);
            if (!isMember) {
              throw new APIError("UNAUTHORIZED", {
                message: "LSCS-CORE-NOT-MEMBER",
              });
            }
          } catch (error) {
            // If it's already our APIError, re-throw it
            if (error instanceof APIError) {
              throw error;
            }
            // Otherwise it's an API failure
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "LSCS-CORE-API-FAILURE",
            });
          }
        },
      },
    },
    session: {
      create: {
        before: async (session, context) => {
          try {
            const user = await context.context.internalAdapter.findUserById(
              session.userId,
            );
            if (!user) {
              throw new APIError("UNAUTHORIZED", {
                message: "LSCS-CORE-NOT-MEMBER",
              });
            }
            const { isMember } = await checkMembershipByEmail(user.email);
            console.log("isMember: " + isMember);
            if (!isMember) {
              throw new APIError("UNAUTHORIZED", {
                message: "LSCS-CORE-NOT-MEMBER",
              });
            }
          } catch (error) {
            // If it's already our APIError, re-throw it
            if (error instanceof APIError) {
              throw error;
            }
            // Otherwise it's an API failure
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "LSCS-CORE-API-FAILURE",
            });
          }
        },

      },
    },
  },
  onAPIError: {
    errorURL: "/login",
    onError: (error, ctx) => {
      if (error.message === "LSCS-CORE-NOT-MEMBER") {
        return "/login?error=not_member";
      }
      if (error.message === "LSCS-CORE-API-FAILURE") {
        return "/login?error=api_unavailable";
      }
      return undefined;
    },
  },
});

export default auth;
