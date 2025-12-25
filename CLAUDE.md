# CLAUDE.md - Global Project Rules

> This file contains project-wide rules that Claude will follow in every conversation.
> Place this file at your project root.

---

## 🎯 Project Overview

**Project Name:** [YOUR PROJECT NAME]
**Description:** [Brief description of what this project does]
**Tech Stack:**
- Backend: FastAPI + Python 3.11+
- Frontend: React + TypeScript + Vite
- Database: PostgreSQL + SQLAlchemy
- Auth: JWT + Google OAuth
- UI: Chakra UI / TailwindCSS + Framer Motion

---

## 📁 Project Structure

```
project/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   └── auth/
│   ├── alembic/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── types/
│   └── package.json
├── .claude/
│   └── commands/
├── skills/
├── agents/
├── PRPs/
└── examples/
```

---

## ✅ MUST DO - Critical Rules

### Before Starting Any Task
1. **Read relevant skill files** from `/skills/` folder
2. **Check existing code patterns** in the codebase
3. **Review examples** in `/examples/` folder
4. **Follow the PRP** if one exists for the feature

### Code Standards

#### Python (Backend)
```python
# ALWAYS use type hints
def get_user(db: Session, user_id: int) -> User:
    pass

# ALWAYS add docstrings
def create_user(db: Session, user: UserCreate) -> User:
    """
    Create a new user in the database.
    
    Args:
        db: Database session
        user: User creation data
        
    Returns:
        Created User object
        
    Raises:
        ConflictError: If email already exists
    """
    pass

# Use async for FastAPI endpoints
@router.get("/users/{user_id}")
async def get_user(user_id: int, db: Session = Depends(get_db)):
    pass
```

#### TypeScript (Frontend)
```typescript
// ALWAYS define interfaces
interface UserProps {
  id: number;
  email: string;
  fullName: string | null;
}

// ALWAYS use TypeScript - NO any types
const fetchUser = async (id: number): Promise<User> => {
  // ...
};

// Use functional components with hooks
export function UserCard({ user }: { user: User }) {
  return <div>{user.email}</div>;
}
```

---

## ❌ MUST NOT DO - Forbidden Patterns

### Backend
- ❌ Never use `print()` for logging - use `logging` module
- ❌ Never store passwords in plain text - always hash with bcrypt
- ❌ Never hardcode secrets - use environment variables
- ❌ Never use `SELECT *` - specify columns explicitly
- ❌ Never skip input validation - use Pydantic schemas

### Frontend
- ❌ Never use `any` type in TypeScript
- ❌ Never store tokens in localStorage without httpOnly consideration
- ❌ Never leave console.log in production code
- ❌ Never skip error handling in async operations
- ❌ Never use inline styles - use Chakra/Tailwind

---

## 🔧 Development Workflow

### 1. Feature Development Flow
```
INITIAL.md → /generate-prp → PRP created → /execute-prp → Feature built
```

### 2. Before Every Commit
- [ ] Run linter: `ruff check backend/`
- [ ] Run formatter: `ruff format backend/`
- [ ] Run tests: `pytest -v`
- [ ] Check types: `mypy backend/app`

### 3. Database Changes
```bash
# Create migration
alembic revision --autogenerate -m "description"

# Apply migration
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## 📦 Dependencies

### Backend (requirements.txt)
```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlalchemy>=2.0.0
alembic>=1.13.0
psycopg2-binary>=2.9.9
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.6
httpx>=0.26.0
pydantic>=2.5.0
pydantic-settings>=2.1.0
```

### Frontend (package.json)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "@tanstack/react-query": "^5.17.0",
    "@chakra-ui/react": "^2.8.0",
    "framer-motion": "^10.18.0",
    "axios": "^1.6.0"
  }
}
```

---

## 🎯 Validation Gates

After implementing any feature, verify:

1. **Syntax Check**
   ```bash
   ruff check backend/ --fix
   cd frontend && npm run lint
   ```

2. **Type Check**
   ```bash
   mypy backend/app
   cd frontend && npm run type-check
   ```

3. **Test Check**
   ```bash
   pytest backend/tests -v
   cd frontend && npm test
   ```

4. **Build Check**
   ```bash
   docker-compose build
   ```

---

## 🤖 Agent Coordination

When complex tasks require multiple specialists:

1. **Read agent definitions** from `/agents/` folder
2. **ORCHESTRATOR** coordinates all agents
3. **Respect dependencies** between agents
4. **Combine outputs** into cohesive solution

Available Agents:
- `ORCHESTRATOR.md` - Coordinates all agents
- `research-agent.md` - Research & documentation
- `database-agent.md` - Models & migrations
- `backend-agent.md` - API development
- `frontend-agent.md` - UI components
- `test-agent.md` - Testing
- `review-agent.md` - Code review
- `devops-agent.md` - Deployment

---

## 📚 Skills Reference

Read relevant skills before implementation:

| Task | Read This Skill |
|------|-----------------|
| API endpoints | `skills/fastapi-backend/SKILL.md` |
| Database models | `skills/database-schema/SKILL.md` |
| JWT auth | `skills/jwt-auth/SKILL.md` |
| Google OAuth | `skills/google-oauth/SKILL.md` |
| React components | `skills/react-frontend/SKILL.md` |
| API integration | `skills/api-integration/SKILL.md` |
| Error handling | `skills/error-handling/SKILL.md` |
| Testing | `skills/testing-strategy/SKILL.md` |
| Deployment | `skills/deployment/SKILL.md` |
| UI/Animations | `skills/modern-ui-kit/SKILL.md` |

---

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Auth
SECRET_KEY=your-super-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## 📝 Commit Message Format

Use conventional commits:

```
feat(auth): add Google OAuth login
fix(api): handle null user in response
docs(readme): update installation steps
refactor(db): optimize user queries
test(auth): add login endpoint tests
chore(deps): update fastapi to 0.109.0
```

---

## 🚨 Error Handling Pattern

### Backend
```python
from app.exceptions import NotFoundError, ConflictError

def get_user_or_404(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User", user_id)
    return user
```

### Frontend
```typescript
try {
  const user = await api.getUser(id);
} catch (error) {
  if (error.response?.status === 404) {
    toast.error('User not found');
  } else {
    toast.error('An error occurred');
  }
}
```
