import "dotenv/config";
import mysql from "mysql2/promise";
import { betterAuth, APIError } from "better-auth";
import { checkMembershipByEmail } from "../services/lscs-core.services.js";

// Define the frontend URL once to reuse for CORS and Error Redirects
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

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
    "http://localhost:8000",

  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    frontendUrl, // Uses the variable defined above
    "https://localhost:3000",
  ].filter(Boolean), // Added .filter(Boolean) to remove undefined values safely

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
  },
  user: {
    additionalFields: {
      idNumber: {
        type: "string",
        required: false,
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies:
      process.env.NODE_ENV === "production"
        ? { enabled: true, domain: ".dlsu-lscs.org" }
        : false,
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          try {
            const { isMember, idNumber } = await checkMembershipByEmail(user.email);
            if (!isMember) {
              throw new APIError("UNAUTHORIZED", {
                message: "LSCS-CORE-NOT-MEMBER",
              });
            }
            if (idNumber) {
              return { data: { idNumber } };
            }
          } catch (error) {
            if (error instanceof APIError) {
              throw error;
            }
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
            const { isMember, idNumber } = await checkMembershipByEmail(user.email);
            if (!isMember) {
              throw new APIError("UNAUTHORIZED", {
                message: "LSCS-CORE-NOT-MEMBER",
              });
            }
            if (idNumber && !user.idNumber) {
              await context.context.internalAdapter.updateUser(session.userId, { idNumber });
            }
          } catch (error) {
            if (error instanceof APIError) {
              throw error;
            }
            throw new APIError("INTERNAL_SERVER_ERROR", {
              message: "LSCS-CORE-API-FAILURE",
            });
          }
        },
      },
    },
  },

  onAPIError: {
    errorURL: `${frontendUrl}/login?error=unknown`,
    onError: (error, ctx) => {
      console.error("[auth:onAPIError]", {
        message: error.message,
        status: error.status,
        path: ctx?.path,
        method: ctx?.method,
      });
      if (error.message === "LSCS-CORE-NOT-MEMBER") {
        return `${frontendUrl}/login?error=not_member`;
      }
      if (error.message === "LSCS-CORE-API-FAILURE") {
        return `${frontendUrl}/login?error=api_unavailable`;
      }
      return undefined;
    },
  },
});

export default auth;
