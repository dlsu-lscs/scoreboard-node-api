# Phase 2 Context: LSCS Core Membership Validation

## Prior Decisions
- **Phase 1**: Better-auth selected, Google OAuth, API key + JWT pattern for scoreboard routes (no changes to those routes during this phase)
- **Target Tier**: Tier 3 (internal tool) - simple, straightforward implementation

## Codebase Patterns (Scouted)
- **Service layer**: `services/*.services.js` - async functions, named exports, throw errors to controllers
- **Database**: `config/connect.js` - `getDB()` singleton pool with retry
- **Auth middleware**: `middlewares/auth.middleware.js` - `validateSession`, `validateApiKey`
- **Better-auth**: Config in `config/auth.js`; routes mounted at `/api/auth/*` via `toNodeHandler(auth)`
- **Error handling**: Controllers wrap service calls in try/catch and send appropriate HTTP status
- **Env vars**: Use `dotenv/config` in entry points, `process.env.VAR` directly

## Open Questions (Answered)

### Q1: Error handling - what to do if LSCS Core API fails?
**Decision**: Use unified error. Catch all failures (timeout, network, 5xx, invalid response) and throw generic `"LSCS Core API failed to respond. Please try again later."`. Result: abort sign-in and redirect to `/login?error=api_unavailable` (distinct from non-member error).

### Q2: Retry logic?
**Decision**: No retry. Single attempt per login. Simplicity prioritized for Tier 3.

### Q3: Email normalization?
**Decision**: Lowercase emails before checking LSCS Core API. Google OAuth emails are canonical, but defensively normalize.

### Q4: Which better-auth hooks to use?
**Decision**:
- `advanced.callbacks.signIn`: Primary hook for membership validation
- `advanced.callbacks.redirect`: Set redirect URL with `?error=` query
- `advanced.callbacks.session`: Attach `user.lscsMember = true` for future contextual use (optional, harmless)
- `advanced.callbacks.onError`: Optional for logging auth errors (helpful but not required)

### Q5: Testing strategy?
**Decision**: No automated tests (consistent with existing codebase). Manual testing via curl/Postman or browser flow after implementation.

### Q6: Logging approach?
**Decision**:
- Use prefix `[LSCS-CORE]` for all logs from service and auth callback
- API errors: `console.warn` with error details (and email for context)
- Non-member attempts: `console.info` for audit trail
- Performance: `console.debug` duration if >500ms (optional)

### Q7: Rate limiting on membership check?
**Decision**: Not needed. Membership check is internal to OAuth callback, not an exposed public route.

### Q8: Which provider(s) does this apply to?
**Decision**: Only Google provider (currently configured). Design for extensibility if more social providers added later.

## Resolved Implementation Decisions

### 1. New Service: `services/lscs-core.services.js`
- Export `checkMembershipByEmail(email)` async function
- Normalize email: `email = email.toLowerCase().trim()`
- `fetch(LSCS_CORE_URL + '/check-email', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-API-Key': process.env.LSCS_CORE_API_KEY }, body: JSON.stringify({ email }) })`
- Timeout: 5000ms (using `AbortController`)
- On success: Return `{ isMember: boolean }` (throw if response not ok or malformed)
- On error: Throw `"LSCS Core API failed to respond. Please try again later."`

### 2. Integration: `config/auth.js`
- Import `checkMembershipByEmail` from `../services/lscs-core.services.js`
- Add to `betterAuth` config:
```javascript
advanced: {
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only run for Google provider; for others, allow through (or also check if needed)
      if (account.provider === 'google') {
        try {
          const result = await checkMembershipByEmail(profile.email);
          if (!result.isMember) {
            console.info(`[LSCS-CORE] Non-member: ${profile.email}`);
            return false; // abort sign-in
          }
          // Mark member in session later via session callback
        } catch (error) {
          console.warn(`[LSCS-CORE] API error for ${profile.email}:`, error.message);
          // Fail secure: abort sign-in
          return false;
        }
      }
      return undefined; // allow other providers or Google to proceed if member
    },
    async redirect({ url }) {
      // better-auth provides default redirect; we only need to override on failure
      return url;
    },
    async session({ session, user }) {
      // Attach membership flag for future use in sessions
      session.user.lscsMember = true;
      return session;
    },
    async onError({ error }) {
      console.warn(`[AUTH-ERROR]:`, error.message);
    }
  }
}
```
- Note: To customize redirect on `signIn` returning `false`, better-auth will redirect to sign-in page with `error=`. We want `/login?error=not_member` or `/login?error=api_unavailable`. Can configure via `advanced.defaultSignInPageURL` or better: use `advanced.callbacks.redirect` with proper query param after `signIn` returned `false`. Actually better-auth's flow: if signIn returns false, redirects to sign-in page with `error=`. Need to set `errorMessage` or customize the error code. Better to set `errors.radius`? Let's research: In better-auth, `signIn` returning `false` results in generic error. To differentiate, we can throw an error with specific code: `throw new Error('non_member', { cause: { code: 'non_member' } })`? Alternatively, set session flash? We'll keep simple: same redirect for both, but frontend distinguishes by checking for `?error=` values (expecting two: `not_member` and `api_unavailable`). We need to produce these query params. Actually, we can use `redirect` callback when returning `false` by setting `url` manually? Let's re-read better-auth docs mentally: When `signIn` returns false, it redirects to sign-in page with `error=AccessDenied` (or similar). To customize redirect URL we can use `advanced.callbacks.redirect`. However redirect happens after signIn returns false? We can detect that in redirect by checking session? Might be simpler: set `signIn` to `throw new Error('Not a member')` and handle `onError` to set a query param. The onError callback allows redirect modification: `onError({ error, ctx })` can return a redirect URL. That's cleaner: Throw specific error types and in `onError`, inspect `error.message` to decide query param.
- **Revised hook strategy**:
  - `signIn`: If not member, `throw new Error('LSCS-MEMBER-NOT-FOUND')`; If API error, `throw new Error('LSCS-API-FAILURE')`
  - `onError`: Catch these and return redirect URL: `/login?error=not_member` or `/login?error=api_unavailable`
  - `redirect`: Default (no change)
  - `session`: Attach `lscsMember = true`

**We should confirm this pattern. Are there any other hooks that would help?**

The user asked to suggest helpful hooks. I'll include the above pattern in decisions.

### 3. Environment Variables
- `LSCS_CORE_URL`: Base URL for LSCS Core API
- `LSCS_CORE_API_KEY`: Header `X-API-Key`
- Existing: `BETTER_AUTH_*`, `GOOGLE_*`, etc.

Add to `.env.example`.

### 4. Error Boundaries
- Service throws:
  - `new Error('LSCS Core API failed to respond. Please try again later.')` for any network/HTTP/parse failures
  - Also throw if `!res.ok` with message above
- Auth hook catches and throws specific codes for `onError` to redirect accordingly:
  - `throw new Error('LSCS-CORE-NOT-MEMBER')` → redirect `/login?error=not_member`
  - `throw new Error('LSCS-CORE-API-FAILURE')` → redirect `/login?error=api_unavailable`

### 5. Logging
- Service: Use `console` with `[LSCS-CORE]` prefix for:
  - `debug` for success + duration (optional)
  - `warn` for API errors (include email, error message)
  - `info` when non-member detected (just email)
- Auth hook: `console.warn` on catches with same prefix.

## Success Criteria
- LSCS Core client service implemented (`services/lscs-core.services.js`)
- Better-auth integrated with membership validation in `config/auth.js`
- Non-members cannot complete Google OAuth; redirected to `/login?error=not_member`
- API failures redirect to `/login?error=api_unavailable`
- Membership validated before session creation (signIn callback)
- Code follows existing service patterns (async, throw errors, named exports)
- No tests (manual verification acceptable)

## Edge Cases & Security
- Strict failure: if API unreachable, block login (fail secure)
- Email normalization prevents mismatches from case differences
- Rate-limiting: not applicable (OAuth rate-limited by Google)
- Secrets: API key stored in `.env`, never logged
- Timeout: 5s prevents hanging requests

## Open Questions (Deferred)
- Add rate limiting on scoreboard routes? (Separate improvement, out of scope)
- Add caching of membership status? (Future optimization to reduce LSCS Core calls)
- Structured logging? (Future upgrade)
- Automated tests? (Future when framework added)
- Support for non-Google providers? (Defer; currently only Google)

## Next Steps
1. Implement `services/lscs-core.services.js`
2. Update `config/auth.js` with better-auth callbacks
3. Update `.env.example` with `LSCS_CORE_URL` and `LSCS_CORE_API_KEY`
4. Manual testing: complete Google OAuth as member and non-member
5. Verify redirect query params
6. Check logs for appropriate messages
