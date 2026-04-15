---
status: diagnosed
phase: 01-add-google-oauth
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
  - 01-03-SUMMARY.md
started: 2026-04-15T23:23:30+08:00
updated: 2026-04-15T23:50:55+08:00
---

## Current Test

[testing complete]

## Tests

### 1. Cold Start Smoke Test
expected: Stop any running server, then start the app from a cold state. The server should boot without startup errors, and a primary API request should return a live response.
result: pass

### 2. Google OAuth Sign-In Redirect
expected: Opening the Google sign-in endpoint should redirect to Google's OAuth consent flow and use the configured callback URL.
result: blocked
blocked_by: server
reason: "I cannot try the google oauth sign in when the server cant start properly."

### 3. Scores API Rejects Missing API Key
expected: Calling a `/api/scores/*` endpoint without `X-API-Key` should return an auth failure response.
result: pass

### 4. Scores API Rejects Missing Session
expected: Calling a `/api/scores/*` endpoint with valid `X-API-Key` but no authenticated session should return an auth failure response.
result: pass

### 5. Scores API Accepts Valid Dual Tokens
expected: Calling a `/api/scores/*` endpoint with both valid `X-API-Key` and authenticated session should succeed.
result: issue
reported: "i cannot test because google oauth login doesnt seem to be established. maybe betterauth still doesnt have google oauth login route?"
severity: major

### 6. Logout Invalidates Session
expected: Calling sign-out should end the session, and subsequent protected requests should fail session validation.
result: blocked
blocked_by: prior-phase
reason: "cant test because i havent logged in successfully yet"

## Summary

total: 6
passed: 3
issues: 1
pending: 0
skipped: 0
blocked: 2

## Gaps

- truth: "Calling a `/api/scores/*` endpoint with both valid `X-API-Key` and authenticated session should succeed."
  status: failed
  reason: "User reported: i cannot test because google oauth login doesnt seem to be established. maybe betterauth still doesnt have google oauth login route?"
  severity: major
  test: 5
  root_cause: "Auth handler is mounted with exact route `app.all(\"/api/auth/\", ...)`, which does not match nested better-auth endpoints (sign-in/callback), so OAuth cannot establish session."
  artifacts:
    - path: "index.js"
      issue: "Auth route mounting uses exact '/api/auth/' instead of prefix/wildcard-compatible mount."
    - path: "config/auth.js"
      issue: "Google provider is configured; route mounting is the blocker, not provider config."
  missing:
    - "Mount better-auth on '/api/auth' with prefix matching so nested endpoints are reachable."
    - "Re-run OAuth login and re-verify dual-token success and logout invalidation tests."
  debug_session: ".planning/debug/scores-api-oauth-session-failure.md"
