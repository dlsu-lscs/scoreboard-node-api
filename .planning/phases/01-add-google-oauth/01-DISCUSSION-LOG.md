# Phase 1: Add Google OAuth - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.  
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2025-04-15  
**Phase:** 01-add-google-oauth  
**Areas discussed:** Authentication Architecture, Token Strategy, OAuth Flow, Protected Endpoints, Integration Points  

---

## Authentication Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Replace API key auth | OAuth only, remove existing API key | |
| Dual auth (backend OAuth) | Keep API key for infrastructure, OAuth for users | ✓ |
| Frontend OAuth (PKCE) | Handle OAuth entirely in frontend | |

**User's choice:** Backend-handled OAuth with dual auth layers  
**Notes:** API key prevents unauthorized app access, JWT identifies users. Both required on every request.

---

## Token Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| HTTP-only cookies | Server-side session management | |
| JWT in localStorage | Stateless, frontend-managed | ✓ |
| JWT in cookies | Hybrid approach | |

**User's choice:** JWT in localStorage  
**Notes:** Frontend domain is trusted (LSCS internal application). Simpler SPA implementation.

---

## OAuth Flow

| Option | Description | Selected |
|--------|-------------|----------|
| Backend-handled | OAuth flow via better-auth on backend | ✓ |
| Frontend-handled | PKCE flow in browser | |

**User's choice:** Backend-handled via better-auth  
**Notes:** Secrets never exposed to frontend. better-auth provides complete implementation.

---

## Protected Endpoints

| Option | Description | Selected |
|--------|-------------|----------|
| All endpoints | Every route requires both tokens | ✓ |
| Read-only public | GET public, write operations protected | |
| Granular | Different protection per endpoint | |

**User's choice:** All endpoints require both tokens  
**Notes:** No public endpoints - all score data is member-only.

---

## User Data Storage

| Option | Description | Selected |
|--------|-------------|----------|
| better-auth built-in | Use better-auth tables | ✓ |
| MySQL integration | Store in existing database | |
| Hybrid | better-auth sessions, MySQL for metadata | |

**User's choice:** better-auth built-in tables  
**Notes:** better-auth handles schema, migrations, session lifecycle automatically.

---

## API Key Header

| Option | Description | Selected |
|--------|-------------|----------|
| Keep in Authorization | `Authorization: Bearer <api-key>` | |
| Move to X-API-Key | `X-API-Key: <api-key>` | ✓ |

**User's choice:** Move to `X-API-Key` header  
**Notes:** Separates app-level from user-level authentication, clearer intent.

---

## Clarification: JWT on Every Request

**Question:** Does frontend need to send JWT on every request after login?  
**Answer:** Yes - JWT validates "who is this user" on each request. Backend is stateless.

**Follow-up:**  
- JWT stored in localStorage after OAuth callback  
- Frontend reads JWT and includes in `Authorization` header  
- Backend validates JWT signature and expiration on each request  
- No server-side session state maintained

---

## Deferred Ideas

| Idea | Reason | Target Phase |
|------|--------|--------------|
| Admin roles/permissions | Out of scope for v1 | Phase 3+ |
| Rate limiting | Out of scope | Phase 2 |
| CSRF protection | Out of scope | Phase 3+ |
| Member profile caching | Out of scope | Phase 3+ |
| Email notifications | Out of scope | Phase 3+ |

---

## Key Clarifications

1. **API Key purpose:** Infrastructure security - prevents unauthorized apps from hitting API
2. **JWT purpose:** User identity - validates who is making the request
3. **Both required:** Every endpoint needs both tokens (API Key + JWT)
4. **No public endpoints:** All score data is member-only
5. **Existing auth:** Current `authenticateApiSecret` middleware will be extended, not replaced

---

## Discussion Flow

```
[Context established]
   │
   ▼
[Gray areas identified]
   │
   ▼
[User clarification on OAuth scope]
   │
   ├─ Architecture: Backend OAuth, dual tokens
   ├─ Storage: JWT in localStorage, better-auth tables
   ├─ Protection: All endpoints require both tokens
   ├─ Header: API Key moves to X-API-Key
   └─ Flow: Complete backend-handled OAuth
   │
   ▼
[Architecture refined]
   │
   ▼
[JWT clarification]
   │
   ▼
[Decisions locked in]
```

---

*Phase: 01-add-google-oauth*  
*Discussion completed: 2025-04-15*
