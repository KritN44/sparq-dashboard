# INITIAL_EXAMPLE.md - Complete Example Feature Request

> This is an example of a well-structured feature request.
> Copy this pattern for your own features!

---

## FEATURE:

Build a complete user authentication system with:
- Email/password registration and login
- Google OAuth integration
- JWT access tokens (30 min expiry) + refresh tokens (7 days)
- Protected routes on frontend
- User profile page with avatar

---

## TECH STACK:

- Backend: FastAPI + PostgreSQL + SQLAlchemy
- Frontend: React + TypeScript + Vite
- Auth: JWT (python-jose) + Google OAuth 2.0
- UI: Chakra UI + Framer Motion

---

## EXAMPLES:

```
- examples/jwt_utils.py - Follow this pattern for token creation
- examples/oauth_router.py - Use this structure for OAuth endpoints
- examples/AuthContext.tsx - Follow this pattern for auth context
```

---

## DOCUMENTATION:

- FastAPI Security: https://fastapi.tiangolo.com/tutorial/security/
- python-jose: https://python-jose.readthedocs.io/
- Google OAuth: https://developers.google.com/identity/protocols/oauth2
- Chakra UI Forms: https://chakra-ui.com/docs/components/form-control

---

## DATABASE MODELS:

```python
User:
  - id: int (primary key, auto-increment)
  - email: string (unique, indexed, max 255)
  - hashed_password: string (nullable - for OAuth-only users)
  - full_name: string (max 100)
  - google_id: string (unique, nullable, indexed)
  - avatar_url: string (nullable, max 500)
  - is_active: boolean (default True)
  - is_verified: boolean (default False)
  - created_at: datetime (auto)
  - updated_at: datetime (auto on update)
```

---

## API ENDPOINTS:

```
Authentication:
  POST /api/v1/auth/register
    Body: { email, password, full_name? }
    Response: UserResponse (201)
    
  POST /api/v1/auth/login
    Body: form-data { username, password }
    Response: { access_token, refresh_token, token_type }
    
  POST /api/v1/auth/refresh
    Body: { refresh_token }
    Response: { access_token, refresh_token, token_type }
    
  GET /api/v1/auth/me
    Headers: Authorization: Bearer <token>
    Response: UserResponse
    
  GET /api/v1/auth/google
    Redirects to Google OAuth consent screen
    
  GET /api/v1/auth/google/callback
    Query: { code, state }
    Redirects to frontend with tokens
```

---

## FRONTEND PAGES:

```
Pages:
  /login
    - Email/password form
    - "Sign in with Google" button
    - Link to register
    - Error messages
    - Loading state
    
  /register
    - Registration form (email, password, name)
    - Password strength indicator
    - Link to login
    
  /dashboard (protected)
    - Welcome message with user name
    - User avatar
    - Logout button
    
  /auth/callback
    - Handles OAuth redirect
    - Extracts tokens from URL
    - Redirects to dashboard

Components:
  - LoginForm
  - RegisterForm
  - GoogleLoginButton
  - ProtectedRoute
  - UserAvatar
  - AuthProvider (context)
```

---

## OTHER CONSIDERATIONS:

```
Security:
  - Hash passwords with bcrypt (min 12 rounds)
  - Validate email format with Pydantic EmailStr
  - Use httpOnly cookies for refresh tokens in production
  - Implement CSRF protection for OAuth (state parameter)
  - Rate limit login endpoint (10 requests/minute)

UX:
  - Show loading spinner during API calls
  - Display user-friendly error messages
  - Auto-focus first form field
  - Remember "redirect to" URL after login

Edge Cases:
  - Handle OAuth user with existing email (link accounts)
  - Handle expired tokens gracefully
  - Handle network errors
  - Handle invalid/malformed tokens
```

---

## ACCEPTANCE CRITERIA:

```
✅ User can register with email/password
✅ User can login with email/password  
✅ User can login with Google
✅ Invalid credentials show error message
✅ JWT tokens are generated correctly
✅ Token refresh works automatically
✅ Protected routes redirect to login
✅ User info displays on dashboard
✅ Logout clears tokens and redirects
✅ All API endpoints return proper status codes
✅ Tests pass with 80%+ coverage
✅ No TypeScript errors
✅ Lint passes
```

---

## PRIORITY:

1. Database model + migration
2. Backend auth endpoints (email/password)
3. Frontend login/register pages
4. Google OAuth integration
5. Protected routes + dashboard
6. Tests

---

# 🚀 READY!

Run: `/generate-prp INITIAL_EXAMPLE.md`
