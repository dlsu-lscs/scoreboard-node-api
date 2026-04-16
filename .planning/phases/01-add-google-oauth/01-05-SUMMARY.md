---
phase: 01-add-google-oauth
plan: 05
subsystem: auth
tags: [better-auth, oauth, login-url, gap-closure]
requires:
  - phase: 01-04
    provides: OAuth routing fix
provides:
  - Simple login URL discovery endpoint
  - Frontend contract for logout-to-login flow
  - AUTH-03 gap closure documentation
affects: []
tech-stack:
  added: []
  patterns: [backend-for-frontend API contract]
key-files:
  created: [.planning/phases/01-add-google-oauth/01-05-CONTRACT.md]
  modified: [index.js]
key-decisions:
  - "Use simple GET /api/auth/login-url endpoint instead of complex redirect logic"
  - "Frontend handles redirect decision, backend provides URL only"
  - "Option C approach minimizes complexity while fulfilling AUTH-03"
patterns-established:
  - "Simple API contract: backend provides URLs, frontend handles navigation"
requirements-completed: [AUTH-03]
duration: 15min
completed: 2026-04-16
---

# Phase 1 Plan 05 Summary: AUTH-03 Gap Closure

**Simple login URL endpoint providing clean frontend-backend contract for logout-to-login flow.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-04-16T00:35:00+08:00
- **Completed:** 2026-04-16T00:50:00+08:00
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `GET /api/auth/login-url` endpoint that returns Google OAuth sign-in URL
- Created `01-05-CONTRACT.md` documenting the three-step logout flow
- Simplified approach eliminates complex redirect logic while meeting AUTH-03 requirement

## Task Commits

| Task | Commit | Description |
|------|--------|-------------|
| Task 1 | 33955a2 | Add /api/auth/login-url endpoint |
| Task 2 | 33955a2 | Create CONTRACT.md documentation |

## Files Created/Modified

- `index.js` - Added login-url endpoint before better-auth mount
- `.planning/phases/01-add-google-oauth/01-05-CONTRACT.md` - Frontend implementation contract

## Decisions Made

**Selected Option C over Option B:**
- Option B proposed complex `/api/auth/redirect?to=login|home|callback` with parameter validation
- Option C provides simple `GET /api/auth/login-url` returning JSON with loginUrl
- Frontend handles redirect decision, reducing backend complexity

**Mount order:**
- Endpoint mounted before `app.all("/api/auth/*splat", toNodeHandler(auth))`
- Ensures Express handles the route, not passed to better-auth

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - uses existing `BETTER_AUTH_URL` environment variable.

## Next Phase Readiness

- Plan 05 completes AUTH-03 gap closure
- Phase 1 ready for final verification
- No additional gaps identified

---
*Phase: 01-add-google-oauth*
*Completed: 2026-04-16*
