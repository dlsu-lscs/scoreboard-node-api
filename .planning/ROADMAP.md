# Roadmap: LSCS Scoreboard API

**Created:** 2025-04-15  
**Updated:** 2026-04-17  
**Milestone:** v1.1 LSCS Core API Integration  
**Phases:** 4 (1 complete, 3 active)
**Requirements:** 10 total (4 v1.0 complete, 6 v1.1 active)

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | **Add Google OAuth** | Implement secure authentication | AUTH-01 to AUTH-04 | 4 |
| 2 | **LSCS Core API Infrastructure** | Build API client and integrate with OAuth | TECH-01, TECH-02, MEMBER-01 | 5 |
| 3 | **Membership Validation Logic** | Handle non-members and API failures | MEMBER-02, MEMBER-03 | 6 |
| 4 | **Protected Routes Integration** | Apply membership checks to protected endpoints | MEMBER-04 | 5 |

---

## Phase 1: Add Google OAuth

**Goal:** Implement Google OAuth authentication using better-auth library

**Status:** ✓ Complete

### Requirements
- AUTH-01: User can sign in with Google OAuth ✓
- AUTH-02: Session persists across browser refresh ✓
- AUTH-03: User can log out from any page ✓
- AUTH-04: API validates authenticated session on protected endpoints ✓

### Success Criteria

1. User can click "Sign in with Google" and complete OAuth flow ✓
2. After login, user can refresh page and remain authenticated ✓
3. User can click logout and be redirected to login page ✓
4. Attempting to access protected endpoints without auth returns 401/403 ✓

### Plans

**Completed:**
- 01-01: Configure better-auth with Google OAuth provider ✓
- 01-02: Implement dual-token middleware (API key + session) ✓
- 01-03: Mount auth routes and integrate session validation ✓
- 01-04: Fix Express 5 routing for better-auth ✓
- 01-05: Add `/api/auth/redirect` endpoint and logout cookie helper ✓

---

## Phase 2: LSCS Core API Infrastructure

**Goal:** Build the LSCS Core API client and integrate membership validation into the OAuth callback flow

**Depends on:** Phase 1

**Requirements**: TECH-01, TECH-02, MEMBER-01

**Success Criteria** (what must be TRUE):
1. LSCS Core API client exists at `services/lscs-core.services.js` with configurable URL, API key, and 5-second timeout
2. After successful Google OAuth, user's email is extracted and validated against LSCS Core API `/check-email`
3. API client returns membership status (member/non-member) for valid API responses
4. Membership check runs before session creation in the OAuth flow
5. Code is testable and follows existing service patterns

**Plans**: TBD

---

## Phase 3: Membership Validation Logic

**Goal:** Implement clear access denial for non-members and strict API failure handling

**Depends on:** Phase 2

**Requirements**: MEMBER-02, MEMBER-03

**Success Criteria** (what must be TRUE):
1. Non-members attempting login are redirected to login page with toast "Not a member of LSCS"
2. No session is created for non-members (they remain unauthenticated)
3. API timeout (5 seconds) blocks login with message "Unable to verify membership. Please try again later."
4. API errors (5xx responses) block login with same generic error message
5. All API failures are logged for monitoring purposes
6. User can attempt login again with a different Google account after denial

**Plans**: TBD

---

## Phase 4: Protected Routes Integration

**Goal:** Apply membership validation to protected endpoints beyond initial login

**Depends on:** Phase 3

**Requirements**: MEMBER-04

**Success Criteria** (what must be TRUE):
1. Membership status is preserved in session after initial validation
2. Protected endpoints check membership status before granting access
3. Existing session validation middleware continues to work unchanged
4. Membership checks do not degrade protected endpoint performance
5. Revoked memberships are detected on next request (no cached membership)

**Plans**: TBD

---

## Dependency Graph

```
Phase 1: Google OAuth (Complete)
      ↓
Phase 2: LSCS Core API Infrastructure
      ↓
Phase 3: Membership Validation Logic
      ↓
Phase 4: Protected Routes Integration
```

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Google OAuth | 5/5 | ✓ Complete | 2025-04-15 |
| 2. LSCS Core API Infrastructure | 0/TBD | Not started | - |
| 3. Membership Validation Logic | 0/TBD | Not started | - |
| 4. Protected Routes Integration | 0/TBD | Not started | - |

---

## Coverage Validation

### v1.1 Requirements Mapped

| Requirement | Phase | Description |
|-------------|-------|-------------|
| MEMBER-01 | Phase 2 | Post-OAuth membership check via /check-email |
| MEMBER-02 | Phase 3 | Non-member access denial with toast message |
| MEMBER-03 | Phase 3 | API failure handling (strict mode) |
| MEMBER-04 | Phase 4 | Membership check on protected routes |
| TECH-01 | Phase 2 | LSCS Core API client module |
| TECH-02 | Phase 2 | Integration with better-auth |

**Coverage:** 6/6 v1.1 requirements mapped ✓  
**Orphans:** 0  
**Duplicates:** 0

---

## Risk Areas

### Technical Risks
1. **LSCS Core API availability** - Strict mode means any API downtime blocks all logins
2. **better-auth hook integration** - Need to find correct hook point without breaking existing OAuth
3. **Session persistence** - Must store membership status without breaking v1.0 session behavior

### Mitigation
- Phase 2 includes API client with proper error boundaries
- Phase 3 validates failure scenarios before success scenarios
- Maintain backward compatibility with v1.0 session format

---

*Roadmap updated: 2026-04-17*  
*Next step: `/gsd-plan-phase 2` to begin Phase 2 planning*

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
