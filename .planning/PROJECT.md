# LSCS Scoreboard API

## What This Is

A backend API for managing member scores within the La Salle Computer Society (LSCS) organization. Provides CRUD operations for score tracking, bulk file uploads for event attendance, and Google OAuth authentication for secure member access.

## Core Value

**Authenticated members can view and manage scores securely** — ensuring only verified LSCS members can access the scoreboard while maintaining data integrity.

## Requirements

### Validated

- ✓ Express.js server with MySQL database
- ✓ Score CRUD operations (create, read, update, delete)
- ✓ Bulk score updates via Excel/CSV file upload
- ✓ API key authentication middleware
- ✓ MySQL connection pooling with retry logic

### Active (v1)

- [ ] **AUTH-01**: User can sign in with Google OAuth
- [ ] **AUTH-02**: Session persists across browser refresh
- [ ] **AUTH-03**: User can log out from any page
- [ ] **AUTH-04**: API validates authenticated session on protected endpoints
- [ ] **BUG-01**: Fix getTop10 returning all scores instead of top 10
- [ ] **BUG-02**: Fix missing semicolon in getTop10 service
- [ ] **TEST-01**: Set up Vitest testing framework
- [ ] **TEST-02**: Achieve 80%+ test coverage

### Out of Scope (v1)

| Feature | Reason |
|---------|--------|
| LSCS Core API validation | Switched to Google OAuth for broader compatibility |
| Admin roles/permissions | Simple auth sufficient for v1 |
| Email notifications | Not critical for score tracking |
| Real-time updates | Polling sufficient for current use |
| Rate limiting | Add when traffic increases |

## Context

**Brownfield Project**: Existing Express.js codebase with MySQL database. Building on established patterns while fixing bugs and adding authentication.

**Technical Environment**: Node.js + Express + MySQL2 + ES Modules

**Known Issues**:
- 2 bugs identified during codebase analysis
- 0% test coverage (requires comprehensive test suite)
- Simple API key auth (upgrading to OAuth)

## Constraints

- **Tech Stack**: Existing Express.js + MySQL — build within current architecture
- **Auth Provider**: Google OAuth via better-auth library
- **Test Coverage**: Minimum 80% per AGENTS.md standards
- **Timeline**: Fix bugs + auth + tests in single milestone
- **Dependencies**: Use existing axios for OAuth callbacks

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Google OAuth over LSCS Core | Broader compatibility, easier member onboarding | — Pending |
| better-auth library | Modern OAuth handling, session management | — Pending |
| Include bug fixes in v1 | Stability foundation before adding features | — Pending |
| Add tests in v1 | TDD approach, prevent regression | — Pending |

---

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2025-04-15 after initialization*
