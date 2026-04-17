# External Integrations

**Analysis Date:** 2026-04-17

## APIs & External Services

**Authentication:**
- [Better-Auth] - Authentication library with social providers (Google)
  - SDK/Client: `better-auth` package
  - Auth: Environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `BETTER_AUTH_SECRET`)

**HTTP Client:**
- [Axios] - Promise-based HTTP client for making requests
  - SDK/Client: `axios` package
  - Auth: No specific auth; relies on headers or tokens passed in requests

## Data Storage

**Databases:**
- MySQL
  - Connection: Environment variables (`DB_HOST`, `DB_USER`, `DB_PASS`, `DB_DATABASE`, `DB_PORT`)
  - Client: `mysql2` package (connection pooling via `mysql.createPool`)

**File Storage:**
- Local filesystem only (via Multer for uploads)

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Better-Auth (custom implementation with Google social provider)
  - Implementation: Uses `better-auth` library with MySQL database adapter

## Monitoring & Observability

**Error Tracking:**
- None detected

**Logs:**
- Console logging (via `console.log` and `console.error`)

## CI/CD & Deployment

**Hosting:**
- Not configured (standard Node.js/Express application)

**CI Pipeline:**
- None detected

## Environment Configuration

**Required env vars:**
- `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_DATABASE`, `DB_PORT` - Database connection
- `BETTER_AUTH_SECRET` - Secret for Better-Auth
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth credentials
- `BETTER_AUTH_URL` or `BETTER_AUTH_BASE_URL` - Base URL for auth endpoints
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (defaults to 3000)

**Secrets location:**
- Environment variables (via `.env` file - noted but contents not read)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Google OAuth callback (handled by Better-Auth)

---

*Integration audit: 2026-04-17*