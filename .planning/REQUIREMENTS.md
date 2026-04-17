# Requirements: LSCS Scoreboard API

**Project:** LSCS Scoreboard API  
**Last Updated:** 2026-04-17

---

## v1.0 Requirements (Completed)

### Authentication

- [x] **AUTH-01**: User can sign in with Google OAuth
  - Integration with better-auth library
  - Google OAuth 2.0 flow
  - Callback handling

- [x] **AUTH-02**: Session persists across browser refresh
  - HTTP-only cookies
  - Secure session storage
  - Session expiration handling

- [x] **AUTH-03**: User can log out from any page
  - Clear session cookies
  - Invalidate server-side session
  - Redirect to login page

- [x] **AUTH-04**: API validates authenticated session on protected endpoints
  - Middleware for session validation
  - Return 401 for unauthenticated requests
  - Return 403 for invalid sessions

---

## v1.1 Requirements (Active)

**Milestone Goal:** Extend Google OAuth with LSCS Core API membership validation to ensure only LSCS members can access the scoreboard.

### Membership Validation

- [ ] **MEMBER-01**: Post-OAuth membership check
  - After successful Google OAuth, validate email via LSCS Core API `/check-email`
  - Extract email from OAuth userinfo
  - Call LSCS Core API with proper authentication (API key from env)
  - Determine membership status from API response

- [ ] **MEMBER-02**: Non-member access denial
  - Non-members are redirected back to login page
  - Toast notification displays "Not a member of LSCS"
  - Session is not created for non-members
  - User can attempt login again (with different account)

- [ ] **MEMBER-03**: API failure handling
  - API timeout (5 seconds) blocks login
  - API error response (5xx) blocks login
  - User sees generic error: "Unable to verify membership. Please try again later."
  - No session is created when API fails
  - Error is logged for monitoring

- [ ] **MEMBER-04**: Membership check on protected routes
  - Membership check runs after OAuth but before granting access
  - Protected endpoints require valid membership
  - Existing session validation continues to work

### Technical Requirements

- [ ] **TECH-01**: LSCS Core API client
  - Client module in `services/lscs-core.services.js`
  - Configurable base URL (from env: `LSCS_CORE_API_URL`)
  - API key authentication (from env: `LSCS_CORE_API_KEY`)
  - Timeout configuration (default 5 seconds)
  - Error handling for network and API errors

- [ ] **TECH-02**: Integration with better-auth
  - Membership check runs in OAuth callback handler
  - Reject authentication if membership check fails
  - Preserve better-auth session behavior for members
  - Handle edge cases (existing users, new users)

---

## v1.1 Future Requirements (Deferred)

- **FUTURE-01**: Cached membership status to reduce API calls
  - *Reason:* Start with real-time validation, add caching if performance becomes an issue

- **FUTURE-02**: Member profile sync from LSCS Core API
  - *Reason:* Out of scope for v1.1 — focused on access control only

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Admin role management | Simple auth sufficient for current use |
| Multiple organization support | LSCS-only for now |
| Membership expiration handling | Assume active membership |
| Audit logging | Can be added later |
| Rate limiting | Add when traffic increases |

---

## Traceability

### v1.0 (Completed)

| Requirement | Phase | Status |
|-------------|-------|--------|
| AUTH-01 | Phase 1 | ✓ Complete |
| AUTH-02 | Phase 1 | ✓ Complete |
| AUTH-03 | Phase 1 | ✓ Complete |
| AUTH-04 | Phase 1 | ✓ Complete |

### v1.1 (Active)

| Requirement | Phase | Status |
|-------------|-------|--------|
| MEMBER-01 | Phase 2 | Pending |
| MEMBER-02 | Phase 3 | Pending |
| MEMBER-03 | Phase 3 | Pending |
| MEMBER-04 | Phase 4 | Pending |
| TECH-01 | Phase 2 | Pending |
| TECH-02 | Phase 2 | Pending |

**Coverage:**
- v1.1 requirements: 6 total
- Mapped to phases: 6
- Unmapped: 0

---

*Requirements defined: 2025-04-15*  
*Updated: 2026-04-17 for v1.1 milestone*
