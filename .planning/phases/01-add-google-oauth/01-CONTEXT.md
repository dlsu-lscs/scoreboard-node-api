# Phase 1: Add Google OAuth - Context

**Gathered:** 2025-04-15  
**Status:** Ready for planning

---

## Phase Boundary

**What this phase delivers:**
Implement secure Google OAuth authentication using better-auth library. This phase establishes the authentication layer that allows LSCS members to sign in via Google and access their scores securely.

**Scope:**
- Backend Google OAuth integration via better-auth
- JWT-based session management
- Two-token authentication system (API Key + JWT)
- Session persistence across page refreshes
- Logout functionality
- Protected API endpoints

**Not in scope:**
- Frontend UI implementation (separate concern)
- Admin roles or permissions
- User profile editing
- Password reset (handled by Google)
- Rate limiting (Phase 2)

---

## Implementation Decisions

### Authentication Architecture

**D-01: Two-Token System**
Every API request requires BOTH tokens:
- `X-API-Key` header: Validates frontend application identity
- `Authorization: Bearer <JWT>` header: Validates user identity

**Rationale:** Layered security - API key prevents unauthorized app access, JWT validates user sessions.

**D-02: Backend-Handled OAuth**
Google OAuth flow handled entirely by backend via better-auth:
1. Frontend initiates: GET /api/auth/google
2. Backend redirects to Google OAuth
3. Google callback to backend
4. Backend validates and creates user
5. Backend returns JWT to frontend

**Rationale:** Secrets never exposed to frontend, better-auth provides complete OAuth implementation.

**D-03: JWT Storage**
JWT stored in browser localStorage (not httpOnly cookies).

**Rationale:** Frontend domain is trusted (LSCS internal), simpler implementation, works with SPA architecture.

**D-04: User Data Storage**
User profiles and sessions managed by better-auth built-in database tables.

**Rationale:** better-auth handles schema migrations, session management, and user lifecycle automatically.

**D-05: Session Validation**
Backend validates JWT on every request - no server-side session state maintained.

**Rationale:** Stateless API design, horizontal scaling support, each request independently authenticated.

### Protected Endpoints

**D-06: All Endpoints Protected**
All `/api/scores/*` endpoints require both API Key and valid JWT:
- `GET /api/scores` - Requires API Key + JWT
- `GET /api/scores/:id` - Requires API Key + JWT
- `GET /api/scores/top` - Requires API Key + JWT
- `POST /api/scores` - Requires API Key + JWT
- `PUT /api/scores/:id` - Requires API Key + JWT
- `DELETE /api/scores/:id` - Requires API Key + JWT
- `POST /api/scores/upload` - Requires API Key + JWT

**Rationale:** No public endpoints - all score data is member-only, API key adds infrastructure security layer.

### Integration Strategy

**D-07: API Key Header Migration**
Move API key from `Authorization: Bearer <key>` to `X-API-Key: <key>` header.

**Rationale:** Separates app-level authentication from user-level authentication, clearer intent.

**D-08: Middleware Architecture**
Create new middleware stack:
1. `validateApiKey()` - Check X-API-Key header
2. `validateSession()` - Check Authorization JWT header
3. Route handler

**Rationale:** Composable middleware, each layer has single responsibility.

**D-09: better-auth Integration Points**
- Mount better-auth at `/api/auth/*` routes
- Configure Google OAuth provider
- Use better-auth's session management
- Extend with custom middleware for score endpoints

**Rationale:** better-auth provides OAuth, sessions, users - we add score-specific logic on top.

### Error Handling

**D-10: Authentication Error Responses**
- Missing API Key: 401 Unauthorized
- Invalid API Key: 401 Unauthorized
- Missing JWT: 401 Unauthorized
- Invalid/Expired JWT: 401 Unauthorized
- Valid tokens but user not found: 403 Forbidden

**Rationale:** Clear distinction between auth failure (401) and permission failure (403).

---

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### better-auth Documentation
- https://www.better-auth.com/docs/ - Official documentation
- https://www.better-auth.com/docs/concepts/session-management - Session handling
- https://www.better-auth.com/docs/authentication/google - Google OAuth setup

### Existing Codebase
- `index.js` - Express app initialization and middleware mounting
- `routes/scores.routes.js` - Route definitions
- `middlewares/auth.middleware.js` - Current API key auth (to be extended)
- `package.json` - Dependencies

### Project Documentation
- `.planning/PROJECT.md` - Project overview and constraints
- `.planning/REQUIREMENTS.md` - Phase 1 requirements (AUTH-01 to AUTH-04)
- `.planning/ROADMAP.md` - Phase 1 goals and success criteria

---

## Existing Code Insights

### Reusable Assets
- **Express middleware pattern**: `authenticateApiSecret` in `middlewares/auth.middleware.js` demonstrates the middleware structure
- **Route mounting**: `index.js` shows how to mount routers at `/api/scores`
- **Environment config**: `dotenv` already configured, add better-auth env vars

### Established Patterns
- **ES Modules**: All code uses `import/export` - continue this pattern
- **Async/await**: Controllers use async/await - follow for auth middleware
- **Error handling**: Controllers use try/catch with HTTP status codes - consistent error responses

### Integration Points
- **Middleware mounting**: Add auth middleware in `index.js` before route mounting
- **Route protection**: Apply middleware in `routes/scores.routes.js` or at controller level
- **Database**: better-auth will use same MySQL connection pool

---

## Specific Ideas

### JWT Contents
JWT payload from better-auth includes:
- `sub`: User ID
- `email`: User email
- `name`: User display name
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp

### Environment Variables Required
```
# Existing
API_SECRET=your-api-secret
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_DATABASE=scoreboard
DB_PORT=3306

# New for better-auth
BETTER_AUTH_SECRET=your-better-auth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
BETTER_AUTH_BASE_URL=http://localhost:3000
```

### API Flow Example
```javascript
// Request
GET /api/scores
Headers:
  X-API-Key: your-api-secret
  Authorization: Bearer <jwt-from-better-auth>

// Response (success)
200 OK
[{ member_id: 123, score: 100 }, ...]

// Response (no JWT)
401 Unauthorized
{ message: "Authentication required" }
```

---

## Deferred Ideas

### Phase 2
- Bug fixes (BUG-01, BUG-02)
- Test suite setup (TEST-01, TEST-02)

### Phase 3+
- Admin role middleware
- Rate limiting
- CSRF protection
- Member profile caching
- Email notifications

---

## Decisions Summary

| # | Decision | Value |
|---|----------|-------|
| D-01 | Two-Token System | API Key + JWT both required |
| D-02 | OAuth Flow | Backend-handled via better-auth |
| D-03 | JWT Storage | localStorage (trusted domain) |
| D-04 | User Data | better-auth built-in tables |
| D-05 | Session | Stateless, validate JWT per request |
| D-06 | Endpoints | All require both tokens |
| D-07 | API Key Header | `X-API-Key` |
| D-08 | Middleware | Composable auth layers |
| D-09 | better-auth | Mount at `/api/auth/*` |
| D-10 | Errors | 401 for auth, 403 for permission |

---

*Phase: 01-add-google-oauth*  
*Context gathered: 2025-04-15*
