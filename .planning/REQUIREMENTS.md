# Requirements: LSCS Scoreboard API v1

**Defined:** 2025-04-15  
**Core Value:** Authenticated members can view and manage scores securely

---

## v1 Requirements

### Authentication

- [ ] **AUTH-01**: User can sign in with Google OAuth
  - Integration with better-auth library
  - Google OAuth 2.0 flow
  - Callback handling

- [ ] **AUTH-02**: Session persists across browser refresh
  - HTTP-only cookies
  - Secure session storage
  - Session expiration handling

- [ ] **AUTH-03**: User can log out from any page
  - Clear session cookies
  - Invalidate server-side session
  - Redirect to login page

- [ ] **AUTH-04**: API validates authenticated session on protected endpoints
  - Middleware for session validation
  - Return 401 for unauthenticated requests
  - Return 403 for invalid sessions

### Bug Fixes

- [ ] **BUG-01**: Fix getTop10 controller returning all scores
  - Location: `controllers/scores.controllers.js:15`
  - Issue: Calls `getScores()` instead of `getTop10()`
  - Fix: Update to call `ScoresService.getTop10()`

- [ ] **BUG-02**: Fix missing semicolon in getTop10 service
  - Location: `services/scores.services.js:19`
  - Issue: Missing semicolon after query
  - Fix: Add semicolon and verify return statement

### Testing

- [ ] **TEST-01**: Set up Vitest testing framework
  - Install vitest and coverage dependencies
  - Configure test scripts in package.json
  - Create test directory structure

- [ ] **TEST-02**: Achieve 80%+ test coverage
  - Service layer tests
  - Controller tests
  - Authentication middleware tests
  - Integration tests for protected endpoints

---

## v2 Requirements (Deferred)

### Enhanced Authentication

- **AUTH-05**: Admin role for managing all scores
- **AUTH-06**: Rate limiting for API endpoints
- **AUTH-07**: CSRF protection

### Features

- **FEAT-01**: Member profile caching
- **FEAT-02**: Email notifications for score updates
- **FEAT-03**: Real-time score updates via WebSocket

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| LSCS Core API validation | Switched to Google OAuth for v1 |
| LDAP/Active Directory integration | Google OAuth sufficient |
| Two-factor authentication | Overkill for current threat model |
| API versioning | Add when breaking changes needed |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | Pending |
| AUTH-02 | Phase 1 | Pending |
| AUTH-03 | Phase 1 | Pending |
| AUTH-04 | Phase 1 | Pending |
| BUG-01 | Phase 2 | Pending |
| BUG-02 | Phase 2 | Pending |
| TEST-01 | Phase 2 | Pending |
| TEST-02 | Phase 2 | Pending |

**Coverage:**
- v1 requirements: 8 total
- Mapped to phases: 8
- Unmapped: 0 ✓

---

*Requirements defined: 2025-04-15*  
*Last updated: 2025-04-15 after initialization*
