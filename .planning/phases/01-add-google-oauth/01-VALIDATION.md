# Phase 1: Add Google OAuth - Validation Strategy

**Phase:** 1 — Add Google OAuth  
**Created:** 2025-04-15  
**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04

---

## Validation Overview

This document defines the verification strategy for Phase 1, ensuring all authentication requirements are met before marking the phase complete.

---

## Dimension 1: Requirements Verification

### AUTH-01: User can sign in with Google OAuth

**Verification Method:** Manual testing with Google OAuth flow

**Steps:**
1. Start server with `npm run dev`
2. Visit `http://localhost:3000/api/auth/sign-in/social?provider=google`
3. Complete Google OAuth consent flow
4. Verify callback returns to application with session cookie

**Expected Result:**
- Redirects to Google OAuth consent screen
- After consent, redirects back to app with session established
- User record created in database
- Session cookie set (HTTP-only)

**Pass Criteria:** User can complete OAuth flow and establish session

---

### AUTH-02: Session persists across browser refresh

**Verification Method:** Automated + Manual

**Steps:**
1. Complete OAuth sign-in
2. Note the session cookie value
3. Refresh the browser page
4. Access protected endpoint

**Expected Result:**
- Session cookie remains after refresh
- Protected endpoints still accessible without re-authentication
- Session data retrieved from database on each request

**Pass Criteria:** Session survives page refresh, no re-authentication required

---

### AUTH-03: User can log out from any page

**Verification Method:** Manual API testing

**Steps:**
1. Complete OAuth sign-in
2. POST to `/api/auth/sign-out`
3. Attempt to access protected endpoint

**Expected Result:**
- Sign-out endpoint returns 200 success
- Session cookie cleared
- Subsequent requests to protected endpoints return 401

**Pass Criteria:** Logout clears session, user must re-authenticate

---

### AUTH-04: API validates authenticated session on protected endpoints

**Verification Method:** Automated API testing with curl/httpie

**Test Cases:**

#### Case 1: Request without API Key
```bash
curl http://localhost:3000/api/scores
```
**Expected:** 401 Unauthorized - "No API key provided"

#### Case 2: Request with API Key but no session
```bash
curl -H "X-API-Key: $API_SECRET" http://localhost:3000/api/scores
```
**Expected:** 401 Unauthorized - "No session token provided"

#### Case 3: Request with both tokens (authenticated)
```bash
curl -H "X-API-Key: $API_SECRET" \
     -H "Cookie: session_cookie_from_oauth" \
     http://localhost:3000/api/scores
```
**Expected:** 200 OK with scores data

#### Case 4: Request with invalid API Key
```bash
curl -H "X-API-Key: invalid-key" \
     -H "Cookie: session_cookie" \
     http://localhost:3000/api/scores
```
**Expected:** 401 Unauthorized - "Invalid API key"

#### Case 5: Request with expired session
```bash
curl -H "X-API-Key: $API_SECRET" \
     -H "Cookie: expired-session-cookie" \
     http://localhost:3000/api/scores
```
**Expected:** 401 Unauthorized - "Invalid or expired session"

**Pass Criteria:** All test cases return expected status codes

---

## Dimension 2: Integration Verification

### Database Tables

**Verification:** Query database for better-auth tables

```sql
SHOW TABLES LIKE 'user';
SHOW TABLES LIKE 'session';
SHOW TABLES LIKE 'account';
```

**Pass Criteria:** All three tables exist with correct schema

### Middleware Integration

**Verification:** Code review + Runtime test

**Check:**
- `validateApiKey` runs before `validateSession` in routes
- `auth.handler` mounted before score routes
- `req.user` populated after successful session validation

**Pass Criteria:** Authentication middleware executes in correct order

### OAuth Endpoints

**Verification:** API discovery test

```bash
# List available auth endpoints
curl http://localhost:3000/api/auth/providers
```

**Expected Endpoints:**
- `POST /api/auth/sign-in/social` - Initiate OAuth
- `GET /api/auth/callback/:provider` - OAuth callback
- `POST /api/auth/sign-out` - End session
- `GET /api/auth/session` - Get current session

**Pass Criteria:** All endpoints respond correctly

---

## Dimension 3: Security Verification

### Cookie Security

**Verification:** Inspect session cookie properties

**Check in browser dev tools:**
- Cookie has `HttpOnly` flag set
- Cookie has `Secure` flag when served over HTTPS
- Cookie has `SameSite=Lax` attribute
- Cookie expiration set (7 days from creation)

**Pass Criteria:** Cookie security flags match configuration

### Error Message Security

**Verification:** Review error responses

**Check:**
- No internal error details exposed to client
- No database connection strings in error messages
- No stack traces in production responses
- Generic "Unauthorized" messages for auth failures

**Pass Criteria:** Error messages don't leak sensitive information

---

## Dimension 4: Regression Verification

### Existing Routes

**Verification:** Test existing score endpoints still function

**Check:**
- `GET /api/scores` returns data when authenticated
- `POST /api/scores` creates scores when authenticated
- `GET /api/scores/:id` returns single score when authenticated
- All existing controller logic preserved

**Pass Criteria:** All score operations work with authentication

### Backward Compatibility

**Verification:** API Key migration

**Check:**
- Old `Authorization: Bearer <api-key>` still works (if implemented)
- New `X-API-Key: <api-key>` works as primary method
- Clear migration path documented

**Pass Criteria:** API clients can migrate to new header format

---

## Success Criteria Summary

| Requirement | Verification | Pass Criteria |
|-------------|--------------|---------------|
| AUTH-01 | Manual OAuth flow | Complete Google OAuth, user created |
| AUTH-02 | Browser refresh test | Session persists, no re-auth needed |
| AUTH-03 | Logout API test | Session cleared, 401 on next request |
| AUTH-04 | API curl tests | Correct 401/200 responses per auth state |
| Integration | Code + runtime | Middleware order correct, DB tables exist |
| Security | Cookie inspection | HttpOnly, Secure, SameSite flags correct |
| Regression | Existing endpoint tests | All score operations work |

---

## Validation Execution

Run validation after executing all Phase 1 plans:

```bash
# 1. Start server
npm run dev

# 2. Run automated verifications
npm test

# 3. Manual OAuth flow test
# Visit: http://localhost:3000/api/auth/sign-in/social?provider=google

# 4. API endpoint tests
curl -H "X-API-Key: your-secret" http://localhost:3000/api/scores
# Should return 401 (no session)

# 5. Security check
curl -I http://localhost:3000/api/auth/sign-in/social?provider=google
# Check for secure cookie flags
```

---

*Validation strategy created: 2025-04-15*
