# LSCS Scoreboard API

## What This Is

A backend API for managing member scores within the La Salle Computer Society (LSCS) organization. Provides CRUD operations for score tracking, bulk file uploads for event attendance, and Google OAuth authentication for secure member access.

## Core Value

**Authenticated members can view and manage scores securely** — ensuring only verified LSCS members can access the scoreboard while maintaining data integrity.

## Current Milestone: v1.1 LSCS Core API Integration

**Goal:** Extend Google OAuth with LSCS Core API membership validation to ensure only LSCS members can access the scoreboard.

**Target features:**
- LSCS Core API integration for membership validation
- Post-OAuth email verification against organization database
- Clear error handling for non-members (toast + redirect)
- Strict API failure handling (block login when API is down)

## Previous Milestone: v1.0 Google OAuth

**Completed:** Google OAuth authentication with better-auth
- ✓ AUTH-01: User can sign in with Google OAuth
- ✓ AUTH-02: Session persists across browser refresh
- ✓ AUTH-03: User can log out from any page
- ✓ AUTH-04: API validates authenticated session on protected endpoints

## Requirements

### Validated (v1.0)

- ✓ Express.js server with MySQL database
- ✓ Score CRUD operations (create, read, update, delete)
- ✓ Bulk score updates via Excel/CSV file upload
- ✓ API key authentication middleware
- ✓ MySQL connection pooling with retry logic
- ✓ AUTH-01: User can sign in with Google OAuth
- ✓ AUTH-02: Session persists across browser refresh
- ✓ AUTH-03: User can log out from any page
- ✓ AUTH-04: API validates authenticated session on protected endpoints

### Active (v1.1)

- [ ] **MEMBER-01**: After Google OAuth, validate email via LSCS Core API `/check-email`
- [ ] **MEMBER-02**: Non-members see "Not a member of LSCS" toast and return to login
- [ ] **MEMBER-03**: API failures block login (strict mode)
- [ ] **MEMBER-04**: Membership check runs before any protected endpoint access

### Out of Scope

| Feature | Reason |
|---------|--------|
| Admin roles/permissions | Simple auth sufficient for current use |
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

### v1.0 (Completed)

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Google OAuth over LSCS Core | Broader compatibility, easier member onboarding | ✓ Validated — Working with better-auth |
| better-auth library | Modern OAuth handling, session management | ✓ Validated — Sessions, cookies, logout working |

### v1.1 (In Progress)

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| LSCS Core API validation | Organization membership verification after OAuth | — Pending |
| Strict API failure mode | Security priority — block if membership cannot be verified | — Pending |

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
