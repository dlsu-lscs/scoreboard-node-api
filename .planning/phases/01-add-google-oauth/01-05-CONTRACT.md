---
phase: 01-add-google-oauth
plan: 05
contract: AUTH-03 Logout-to-Login Flow
version: 1.0
created: 2026-04-16
---

# AUTH-03 Implementation Contract

## Overview

This document defines the contract between frontend and backend for the logout-to-login flow (AUTH-03 requirement).

## Frontend Implementation Guide

### Three-Step Logout Flow

```javascript
async function handleLogout() {
  // Step 1: Sign out (better-auth clears session)
  await fetch('/api/auth/sign-out', { 
    method: 'POST', 
    credentials: 'include' 
  });
  
  // Step 2: Get login URL from backend
  const response = await fetch('/api/auth/login-url');
  const { loginUrl } = await response.json();
  
  // Step 3: Redirect to login
  window.location.href = loginUrl;
}
```

## Backend Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/sign-out` | POST | better-auth endpoint that clears session |
| `/api/auth/login-url` | GET | Returns Google OAuth login URL |

## Response Format

### GET /api/auth/login-url

**Success Response (200):**
```json
{
  "loginUrl": "http://localhost:3000/api/auth/sign-in/social?provider=google&callbackURL=http%3A%2F%2Flocalhost%3A3000%2F"
}
```

The `loginUrl` is a complete URL that frontend can redirect to immediately.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BETTER_AUTH_URL` | Yes | Base URL for auth endpoints (e.g., `http://localhost:3000`) |
| `APP_URL` | No | Fallback base URL if `BETTER_AUTH_URL` not set |

## Example Usage

### Complete Logout Handler

```javascript
// React/Vue/Angular component
const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      // Sign out
      await fetch('/api/auth/sign-out', { 
        method: 'POST',
        credentials: 'include'
      });
      
      // Get fresh login URL
      const response = await fetch('/api/auth/login-url');
      if (!response.ok) throw new Error('Failed to get login URL');
      
      const { loginUrl } = await response.json();
      
      // Redirect to Google OAuth
      window.location.href = loginUrl;
    } catch (error) {
      console.error('Logout failed:', error);
      // Fallback: redirect to home
      window.location.href = '/';
    }
  };
  
  return <button onClick={handleLogout}>Logout</button>;
};
```

## Security Notes

- The `loginUrl` returned is a public OAuth endpoint — no sensitive data is exposed
- Always use `credentials: 'include'` when calling `/api/auth/sign-out` to ensure cookies are cleared
- The callback URL is automatically set to the application root (`/`)

---

*Contract version: 1.0*
*Phase: 01-add-google-oauth, Plan 05*
