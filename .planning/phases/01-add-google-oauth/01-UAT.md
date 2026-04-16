---
status: complete
phase: 01-add-google-oauth
source:
- 01-01-SUMMARY.md
- 01-02-SUMMARY.md
- 01-03-SUMMARY.md
- 01-04-SUMMARY.md
- 01-05-SUMMARY.md
started: 2026-04-15T23:23:30+08:00
updated: 2026-04-16T00:52:00+08:00
---

## Current Test

[completed]

## Tests

### 1. Cold Start Smoke Test
expected: Stop any running server, then start the app from a cold state. The server should boot without startup errors, and a primary API request should return a live response.
result: pass

### 2. Google OAuth Sign-In Redirect
expected: Opening the Google sign-in endpoint should redirect to Google's OAuth consent flow and use the configured callback URL.
result: pass

### 3. Scores API Rejects Missing API Key
expected: Calling a `/api/scores/*` endpoint without `X-API-Key` should return an auth failure response.
result: pass

### 4. Scores API Rejects Missing Session
expected: Calling a `/api/scores/*` endpoint with valid `X-API-Key` but no authenticated session should return an auth failure response.
result: pass

### 5. Scores API Accepts Valid Dual Tokens
expected: Calling a `/api/scores/*` endpoint with both valid `X-API-Key` and authenticated session should succeed.
result: pass

### 6. Logout Invalidates Session
expected: Calling sign-out should end the session, and subsequent protected requests should fail session validation.
result: pass

### 7. Login URL Endpoint Returns OAuth URL
expected: Calling GET /api/auth/login-url returns JSON with valid loginUrl pointing to Google OAuth sign-in endpoint
result: pass

## Summary

total: 7
passed: 7
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none]

## Prevention Notes

- OAuth state is session-bound: start sign-in and complete callback in the same browser session/cookie jar.
- For Express 5, better-auth must be mounted with `app.all("/api/auth/*splat", toNodeHandler(auth))`.
- Sign-out requests need same-origin context (`Origin` header); raw curl without `Origin` can return `MISSING_OR_NULL_ORIGIN`.
