# Documentation Skill

## Purpose
Create comprehensive API documentation and project documentation.

## FastAPI Auto-Documentation

### Endpoint Documentation
```python
from fastapi import APIRouter, Query, Path

router = APIRouter(prefix="/posts", tags=["posts"])

@router.get(
    "/",
    summary="List all posts",
    description="Retrieve a paginated list of posts with optional filtering.",
    response_description="List of posts"
)
async def get_posts(
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    author_id: int | None = Query(None, description="Filter by author")
):
    """
    Retrieve posts with pagination.

    - **page**: Page number (starts from 1)
    - **per_page**: Items per page (1-100)
    - **author_id**: Optional author filter
    """
    pass

@router.get("/{post_id}", summary="Get a specific post")
async def get_post(
    post_id: int = Path(..., description="Post ID", ge=1)
):
    """Get a single post by ID."""
    pass
```

### Schema Documentation
```python
from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    """Schema for creating a new user."""
    
    email: EmailStr = Field(..., description="User's email", example="user@example.com")
    password: str = Field(..., min_length=8, description="Password (8+ chars)")
    full_name: str | None = Field(None, description="Full name", example="John Doe")

    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "securepassword",
                "full_name": "John Doe"
            }
        }
```

### App Documentation
```python
app = FastAPI(
    title="My App API",
    description="""
## Overview
This API powers My App, providing user management and posts.

## Authentication
Most endpoints require JWT. Include in header:
```
Authorization: Bearer <token>
```
    """,
    version="1.0.0",
    contact={"name": "Support", "email": "support@example.com"},
    openapi_tags=[
        {"name": "auth", "description": "Authentication"},
        {"name": "users", "description": "User management"},
        {"name": "posts", "description": "Post operations"},
    ]
)
```

## README Template

```markdown
# Project Name

Brief description.

## Tech Stack
- Backend: FastAPI, SQLAlchemy, PostgreSQL
- Frontend: React, TypeScript
- Auth: JWT, Google OAuth

## Quick Start

### Docker
docker-compose up -d

### Manual

# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install && npm run dev

## API Docs
- Swagger: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL URL | Yes |
| SECRET_KEY | JWT secret | Yes |
| GOOGLE_CLIENT_ID | OAuth ID | Yes |

## Testing
# Backend
pytest --cov

# Frontend
npm test
```

## Code Documentation

### Python (Google style)
```python
def create_user(db: Session, user_data: UserCreate) -> User:
    """
    Create a new user.

    Args:
        db: Database session
        user_data: User creation data

    Returns:
        Created User object

    Raises:
        ConflictError: If email exists
    """
    pass
```

### TypeScript (JSDoc)
```typescript
/**
 * Fetch posts with pagination
 * @param page - Page number
 * @param perPage - Items per page
 * @returns Paginated posts
 */
async function fetchPosts(page: number, perPage: number): Promise<PaginatedResponse<Post>> {
  // ...
}
```

## Changelog Template

```markdown
# Changelog

## [1.1.0] - 2024-01-15
### Added
- Google OAuth
- Post comments

### Fixed
- Token refresh bug

## [1.0.0] - 2024-01-01
- Initial release
```

## Best Practices
- Document all endpoints
- Add examples to schemas
- Write comprehensive README
- Use consistent docstrings
- Document env variables
- Maintain changelog
