# Roadmap: LSCS Scoreboard API v1

**Created:** 2025-04-15  
**Phases:** 2  
**Requirements:** 8 v1 requirements

---

## Phase Overview

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | **Add Google OAuth** | Implement secure authentication | AUTH-01 to AUTH-04 | 4 |
| 2 | **Stabilize & Test** | Fix bugs and add test coverage | BUG-01, BUG-02, TEST-01, TEST-02 | 4 |

---

## Phase 1: Add Google OAuth

**Goal:** Implement Google OAuth authentication using better-auth library

### Requirements
- AUTH-01: User can sign in with Google OAuth
- AUTH-02: Session persists across browser refresh
- AUTH-03: User can log out from any page
- AUTH-04: API validates authenticated session on protected endpoints

### Success Criteria
1. User can click "Sign in with Google" and complete OAuth flow
2. After login, user can refresh page and remain authenticated
3. User can click logout and be redirected to login page
4. Attempting to access protected endpoints without auth returns 401/403

### Key Decisions
- Use better-auth for OAuth handling
- Store sessions in cookies (HTTP-only, secure)
- Protect all `/api/scores/*` endpoints with auth middleware

---

## Phase 2: Stabilize & Test

**Goal:** Fix existing bugs and establish comprehensive test coverage

### Requirements
- BUG-01: Fix getTop10 returning all scores
- BUG-02: Fix missing semicolon in getTop10 service
- TEST-01: Set up Vitest testing framework
- TEST-02: Achieve 80%+ test coverage

### Success Criteria
1. `/api/scores/top` returns exactly 10 highest scores
2. All service functions have proper syntax (no missing semicolons)
3. `npm test` runs Vitest with configured coverage
4. Coverage report shows ≥80% across all files

### Key Decisions
- Test services first (pure logic, easier to test)
- Mock database connections for unit tests
- Integration tests for OAuth flow

---

## Execution Order

```
Phase 1: Add Google OAuth
├── Plan: Discuss OAuth approach and better-auth setup
├── Execute: Implement authentication layer
└── Verify: Manual testing of OAuth flow

Phase 2: Stabilize & Test
├── Plan: Identify bug fixes and test strategy
├── Execute: Fix bugs, write tests
└── Verify: Coverage report ≥80%
```

---

## Completion Criteria

**v1 is complete when:**
- [ ] All 8 v1 requirements marked complete in REQUIREMENTS.md
- [ ] Google OAuth working in production
- [ ] Bug fixes deployed and verified
- [ ] Test coverage ≥80% with all tests passing
- [ ] No critical security vulnerabilities

---

*Roadmap created: 2025-04-15*
