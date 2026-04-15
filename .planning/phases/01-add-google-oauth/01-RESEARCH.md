# Phase 1: Add Google OAuth - Research

**Research Date:** 2025-04-15  
**Phase:** 1 - Add Google OAuth  
**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04

---

## Executive Summary

This research document covers the implementation of Google OAuth authentication using the **better-auth** library in an Express.js backend with MySQL. The better-auth library provides a complete authentication solution with built-in OAuth providers, session management, and database schema handling.

---

## Technology Stack Analysis

### better-auth Overview

**better-auth** is a framework-agnostic authentication library for TypeScript/JavaScript applications.

**Key Features:**
- Built-in OAuth providers (Google, GitHub, Discord, etc.)
- Automatic database schema management
- JWT-based session tokens
- CSRF protection
- Flexible session storage (database-backed)

**Installation:**
```bash
npm install better-auth
npm install -D @types/better-auth  # if using TypeScript
```

**Dependencies to add:**
- `better-auth` - Core authentication library

---

## Architecture Patterns

### Pattern 1: better-auth Express Integration

better-auth provides an `auth` object that can be mounted as middleware:

```javascript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    provider: "mysql2",
    url: process.env.DATABASE_URL,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
});

// In Express app
app.all("/api/auth/*", auth.handler);
```

### Pattern 2: Two-Token Authentication System

Per D-01 (CONTEXT.md), implement layered security:

```
Request → validateApiKey() → validateSession() → Route Handler
              ↓                      ↓
         X-API-Key header    Authorization: Bearer JWT
```

**Why this works:**
- API Key validates the frontend application
- JWT validates the user session
- Separation of concerns: infrastructure security vs user authentication

### Pattern 3: Protected Route Middleware

Composable middleware stack for score endpoints:

```javascript
// middlewares/auth.middleware.js
export const validateApiKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.API_SECRET) {
    return res.status(401).json({ message: "Invalid API key" });
  }
  next();
};

export const validateSession = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  
  const token = authHeader.split(" ")[1];
  // Validate with better-auth
  const session = await auth.api.getSession({ headers: { authorization: token } });
  if (!session) {
    return res.status(401).json({ message: "Invalid or expired session" });
  }
  
  req.user = session.user;
  next();
};
```

---

## Database Schema

### better-auth Required Tables

better-auth automatically creates these tables on first run:

**user table:**
```sql
CREATE TABLE user (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  email_verified BOOLEAN DEFAULT FALSE,
  name VARCHAR(255),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**session table:**
```sql
CREATE TABLE session (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(255),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
);
```

**account table (for OAuth):**
```sql
CREATE TABLE account (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  account_id VARCHAR(255) NOT NULL,
  provider_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  access_token_expires_at TIMESTAMP,
  scope VARCHAR(255),
  id_token TEXT,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
  UNIQUE KEY unique_provider_account (provider_id, account_id)
);
```

**Note:** better-auth handles migrations automatically via `migrate: true` option.

---

## Configuration Requirements

### Environment Variables

```bash
# Existing
API_SECRET=your-api-secret
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_DATABASE=scoreboard
DB_PORT=3306

# New for better-auth
BETTER_AUTH_SECRET=your-better-auth-secret-min-32-chars-long
BETTER_AUTH_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**BETTER_AUTH_SECRET:**
- Must be at least 32 characters
- Used for signing JWTs and encryption
- Generate with: `openssl rand -base64 32`

**Google OAuth Setup:**
1. Go to https://console.cloud.google.com/apis/credentials
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret

---

## API Endpoints

### better-auth Built-in Endpoints

Once mounted at `/api/auth/*`, better-auth provides:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sign-in/social` | POST | Initiate OAuth flow |
| `/api/auth/callback/:provider` | GET | OAuth callback handler |
| `/api/auth/sign-out` | POST | End session |
| `/api/auth/session` | GET | Get current session |
| `/api/auth/session` | POST | Refresh session |

### Custom Score Endpoints (Protected)

Per D-06, all score endpoints require both tokens:

```
GET    /api/scores      - Requires API Key + JWT
GET    /api/scores/:id  - Requires API Key + JWT
GET    /api/scores/top  - Requires API Key + JWT
POST   /api/scores      - Requires API Key + JWT
PUT    /api/scores/:id  - Requires API Key + JWT
DELETE /api/scores/:id  - Requires API Key + JWT
POST   /api/scores/upload - Requires API Key + JWT
```

---

## Implementation Steps

### Step 1: Install better-auth
```bash
npm install better-auth
```

### Step 2: Configure better-auth
Create `config/auth.js`:
```javascript
import { betterAuth } from "better-auth";
import { getDB } from "./connect.js";

export const auth = betterAuth({
  database: {
    provider: "mysql2",
    url: `mysql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,
  },
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_BASE_URL,
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
});
```

### Step 3: Mount better-auth in Express
Update `index.js`:
```javascript
import { auth } from "./config/auth.js";

// Mount better-auth before other routes
app.all("/api/auth/*", auth.handler);

// Then mount score routes
app.use("/api/scores", scoresRouter);
```

### Step 4: Update Middleware
Update `middlewares/auth.middleware.js`:
- Migrate API key from `Authorization: Bearer` to `X-API-Key`
- Add JWT validation using better-auth's session API
- Export composable middleware functions

### Step 5: Protect Score Routes
Update `routes/scores.routes.js`:
- Replace `authenticateApiSecret` with `validateApiKey` + `validateSession`
- Apply to all routes

---

## Common Pitfalls

### Pitfall 1: Middleware Order
**Problem:** better-auth routes must be mounted BEFORE applying auth middleware to score routes.
**Solution:** Mount in correct order in `index.js`.

### Pitfall 2: Database Connection Pool
**Problem:** better-auth needs its own database connection.
**Solution:** Pass connection string to better-auth config, not connection pool.

### Pitfall 3: OAuth Redirect URI Mismatch
**Problem:** Google rejects redirect if URI doesn't match exactly (including port).
**Solution:** Configure `http://localhost:3000/api/auth/callback/google` in Google Console.

### Pitfall 4: Session Validation on Every Request
**Problem:** Database lookup on every request is expensive.
**Solution:** better-auth caches sessions; ensure `expiresIn` is reasonable.

### Pitfall 5: Missing API Key Migration
**Problem:** Existing frontend uses `Authorization: Bearer <api-key>`.
**Solution:** Per D-07, migrate to `X-API-Key` header before adding JWT requirement.

---

## Testing Strategy

### Unit Tests
- Mock better-auth session API
- Test middleware behavior with valid/invalid tokens
- Test error responses (401 vs 403)

### Integration Tests
- Test OAuth flow with Google (may require mock)
- Test protected endpoints with both tokens
- Test session persistence

### Manual Testing Checklist
- [ ] OAuth sign-in redirects to Google
- [ ] Google callback creates user and session
- [ ] Session persists across page refresh
- [ ] Logout clears session
- [ ] Protected endpoints reject requests without API key
- [ ] Protected endpoints reject requests without JWT
- [ ] Protected endpoints accept requests with both tokens

---

## Security Considerations

### Token Storage (D-03)
- JWT stored in localStorage (per user decision)
- API key stored in frontend environment
- XSS risk: mitigate with CSP headers

### Session Expiration
- better-auth sessions expire after 7 days (configurable)
- Automatic refresh on activity
- Server-side session invalidation on logout

### HTTPS in Production
- Set `secure: true` for cookies when deployed
- Google OAuth requires HTTPS redirect URIs in production

---

## Validation Architecture

Per Nyquist validation requirements, the following verifiers should be implemented:

### Dimension 1: Requirements Coverage
- OAuth sign-in working (AUTH-01)
- Session persistence (AUTH-02)
- Logout functionality (AUTH-03)
- Protected endpoints (AUTH-04)

### Dimension 2: Integration
- better-auth mounts at `/api/auth/*`
- Score routes protected by middleware
- Database tables created automatically

### Dimension 3: Error Handling
- 401 for missing/invalid API key
- 401 for missing/invalid JWT
- 403 for valid auth but unauthorized user
- Clear error messages

### Dimension 4: Regression Safety
- Existing routes remain functional
- New middleware doesn't break existing tests

---

## References

- better-auth docs: https://www.better-auth.com/docs/
- Google OAuth docs: https://developers.google.com/identity/protocols/oauth2
- Express middleware patterns: https://expressjs.com/en/guide/using-middleware.html

---

*Research complete: 2025-04-15*
