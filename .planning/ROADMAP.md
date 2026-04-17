# Roadmap: LSCS Scoreboard API v1

**Created:** 2002-04-15  
**Phases:** 2  
**Requirements:** 8 v1 requirements

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | **Add Google OAuth** | Implement secure authentication | AUTH-01 to AUTH-04 | 4 |

---

## Phase 1: Add Google OAuth

**Goal:** Implement Google OAuth authentication using better-auth library

**Status:** Executed, Gap Closure for AUTH-03

### Requirements
- AUTH-01: User can sign in with Google OAuth ✓
- AUTH-02: Session persists across browser refresh ✓
- AUTH-03: User can log out from any page (gap closure in progress)
- AUTH-04: API validates authenticated session on protected endpoints ✓

### Success Criteria
1. User can click "Sign in with Google" and complete OAuth flow ✓
2. After login, user can refresh page and remain authenticated ✓
3. User can click logout and be redirected to login page (gap closure: 01-05)
4. Attempting to access protected endpoints without auth returns 401 ✓ (403 deferred to Phase 2)

### Key Decisions
- Use better-auth for OAuth handling
- Store sessions in cookies (HTTP-only, secure)
- Protect all `/api/scores/*` endpoints with auth middleware
- **Gap closure 01-05:** Backend provides `/api/auth/redirect` endpoint for frontend logout navigation

### Plans

**Completed:**
- 01-01: Configure better-auth with Google OAuth provider ✓
- 01-02: Implement dual-token middleware (API key + session) ✓
- 01-03: Mount auth routes and integrate session validation ✓
- 01-04: Fix Express 5 routing for better-auth ✓

**Gap Closure:**
- [ ] **01-05: AUTH-03 redirect support** — Add `/api/auth/redirect` endpoint and logout cookie helper

---
