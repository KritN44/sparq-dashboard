# Google OAuth Skill

## Purpose
Implement Google OAuth 2.0 authentication flow with proper security measures.

## Configuration

```python
# config.py
class Settings(BaseSettings):
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/google/callback"
    FRONTEND_URL: str = "http://localhost:3000"
```

## Google OAuth Utilities

```python
# auth/google.py
from httpx import AsyncClient
from app.config import settings

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

def get_google_auth_url(state: str) -> str:
    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.GOOGLE_REDIRECT_URI,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "state": state,
        "prompt": "consent"
    }
    query = "&".join(f"{k}={v}" for k, v in params.items())
    return f"{GOOGLE_AUTH_URL}?{query}"

async def get_google_tokens(code: str) -> dict:
    async with AsyncClient() as client:
        response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "code": code,
                "grant_type": "authorization_code",
                "redirect_uri": settings.GOOGLE_REDIRECT_URI
            }
        )
        return response.json()

async def get_google_user_info(access_token: str) -> dict:
    async with AsyncClient() as client:
        response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"}
        )
        return response.json()
```

## OAuth Router

```python
# routers/auth.py (add these endpoints)
import secrets
from fastapi import Request
from fastapi.responses import RedirectResponse
from app.auth.google import get_google_auth_url, get_google_tokens, get_google_user_info
from app.auth.jwt import create_access_token, create_refresh_token

@router.get("/google")
async def google_login(request: Request):
    """Initiate Google OAuth flow."""
    state = secrets.token_urlsafe(32)
    auth_url = get_google_auth_url(state)
    
    response = RedirectResponse(url=auth_url)
    response.set_cookie(
        key="oauth_state",
        value=state,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=600
    )
    return response

@router.get("/google/callback")
async def google_callback(
    code: str,
    state: str,
    request: Request,
    db: Session = Depends(get_db)
):
    """Handle Google OAuth callback."""
    # Verify state
    stored_state = request.cookies.get("oauth_state")
    if not stored_state or stored_state != state:
        raise HTTPException(status_code=400, detail="Invalid state")
    
    # Exchange code for tokens
    tokens = await get_google_tokens(code)
    if "error" in tokens:
        raise HTTPException(status_code=400, detail="OAuth error")
    
    # Get user info
    google_user = await get_google_user_info(tokens["access_token"])
    
    # Find or create user
    user = db.query(User).filter(User.google_id == google_user["id"]).first()
    
    if not user:
        # Check if email exists
        user = db.query(User).filter(User.email == google_user["email"]).first()
        if user:
            # Link Google to existing account
            user.google_id = google_user["id"]
            user.avatar_url = google_user.get("picture")
        else:
            # Create new user
            user = User(
                email=google_user["email"],
                full_name=google_user.get("name"),
                google_id=google_user["id"],
                avatar_url=google_user.get("picture"),
                is_verified=True
            )
            db.add(user)
        db.commit()
        db.refresh(user)
    
    # Generate JWT tokens
    access_token = create_access_token(data={"sub": str(user.id)})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    # Redirect to frontend with tokens
    redirect_url = f"{settings.FRONTEND_URL}/auth/callback?access_token={access_token}&refresh_token={refresh_token}"
    
    response = RedirectResponse(url=redirect_url)
    response.delete_cookie("oauth_state")
    return response
```

## Frontend OAuth Handler

```typescript
// pages/AuthCallback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    
    if (accessToken && refreshToken) {
      authService.setTokens({ access_token: accessToken, refresh_token: refreshToken });
      navigate('/dashboard');
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [navigate]);

  return <div>Processing login...</div>;
}

// services/auth.ts
export const authService = {
  googleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
  },
  
  setTokens(tokens: { access_token: string; refresh_token: string }) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  }
};
```

## Google Login Button

```typescript
// components/GoogleLoginButton.tsx
import { authService } from '../services/auth';

export function GoogleLoginButton() {
  return (
    <button
      onClick={() => authService.googleLogin()}
      className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      Sign in with Google
    </button>
  );
}
```

## Google Cloud Console Setup

1. Go to console.cloud.google.com
2. Create new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `http://localhost:8000/api/v1/auth/google/callback` (dev)
   - `https://yourdomain.com/api/v1/auth/google/callback` (prod)
6. Copy Client ID and Secret to .env

## Best Practices
- Always verify state parameter (CSRF protection)
- Use httponly, secure cookies for state
- Link OAuth to existing accounts by email
- Handle OAuth errors gracefully
- Use HTTPS in production
