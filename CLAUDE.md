# CLAUDE.md - Sparq Dashboard Project Rules

> Project-specific rules for Claude Code. This file is read automatically.

---

## Project Overview

**Project Name:** Sparq Dashboard
**Description:** Internal dashboard for Marcom, Sales, and Management teams to track project progress from brief to campaign.
**Tech Stack:**
- Backend: FastAPI + Python 3.11+
- Frontend: React + Vite + TypeScript
- Database: PostgreSQL + SQLAlchemy
- Auth: Email/Password + JWT (SSO at deployment)
- UI: Chakra UI

---

## Project Structure

```
sparq-dashboard/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   └── project.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   └── project.py
│   │   ├── routers/
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   └── dashboard.py
│   │   ├── services/
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   └── dashboard.py
│   │   └── auth/
│   │       ├── jwt.py
│   │       └── dependencies.py
│   ├── alembic/
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── ProjectTable/
│   │   │   ├── ProjectForm/
│   │   │   ├── DashboardCards/
│   │   │   └── Charts/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── ProjectDetailPage.tsx
│   │   │   ├── ProjectFormPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ProfilePage.tsx
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── types/
│   │       ├── user.ts
│   │       └── project.ts
│   └── package.json
├── .claude/
│   └── commands/
├── skills/
├── agents/
└── PRPs/
```

---

## Code Standards

### Python (Backend)
```python
# ALWAYS use type hints
def get_project(db: Session, project_id: int) -> Project:
    pass

# ALWAYS use async endpoints
@router.get("/projects/{id}")
async def get_project(id: int, db: Session = Depends(get_db)):
    pass
```

### TypeScript (Frontend)
```typescript
// ALWAYS define interfaces for props and data
interface Project {
  id: number;
  region: Region;
  city: string;
  salesperson_name: string;
  brand_name: string;
  category: Category;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

// NO any types allowed
const fetchProjects = async (): Promise<Project[]> => { ... };
```

---

## Forbidden Patterns

### Backend
- Never use `print()` - use `logging` module
- Never store passwords in plain text - use bcrypt
- Never hardcode secrets - use environment variables
- Never use `SELECT *` - specify columns
- Never skip input validation

### Frontend
- Never use `any` type
- Never leave `console.log` in production
- Never skip error handling in async operations
- Never use inline styles - use Chakra UI

---

## Module-Specific Rules

### Projects Module
- All projects must track `created_by` user (user_id foreign key)
- Region must be one of: TN, Kerala, AP, Telangana, Gujarat, Delhi, Mumbai
- Category must be one of: FMCG, Industrial Goods
- Status must be one of: Brand description generated, Deck in progress, Deck Shared, Client approved, Client rejected, Video production in progress, Video submitted for review, Video approved, Campaign signed up
- Marcom role: full CRUD access
- Sales role: read-only access
- Management role: read-only access + dashboard metrics

### Dashboard Module
- Metrics are computed from Project data aggregations
- All metrics endpoints are read-only (GET only)
- Management role required for dashboard access

---

## API Conventions

- All endpoints prefixed with `/api/v1/`
- Use plural nouns for resources: `/projects`
- Return appropriate HTTP status codes:
  - 200: Success
  - 201: Created
  - 400: Bad Request
  - 401: Unauthorized
  - 403: Forbidden (wrong role)
  - 404: Not Found
  - 409: Conflict

---

## Authentication

### JWT Configuration
- Access token expires: 30 minutes
- Refresh token expires: 7 days
- Algorithm: HS256

### Roles
- `marcom` — CRUD on projects
- `sales` — Read-only on projects
- `management` — Read-only on projects + dashboard

### Deployment Note
- SSO + advanced role-based auth to be configured by DevOps at deployment
- Current Email/Password auth is a placeholder

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sparq_dashboard

# Auth
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Frontend
VITE_API_URL=http://localhost:8000
```

---

## Development Commands

```bash
# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Docker
docker-compose up -d

# Tests
pytest backend/tests -v
cd frontend && npm test

# Linting
ruff check backend/
cd frontend && npm run lint
```

---

## Validation

```bash
ruff check backend/ && pytest
npm run lint && npm run type-check
docker-compose build
```

---

## Commit Message Format

```
feat(projects): add project creation endpoint
fix(dashboard): fix region metric calculation
refactor(auth): refactor JWT token handling
test(projects): add tests for project CRUD
docs: update README
```

---

## Skills Reference

| Task | Skill to Read |
|------|---------------|
| Database models | skills/DATABASE.md |
| API + Auth | skills/BACKEND.md |
| React + UI | skills/FRONTEND.md |
| Testing | skills/TESTING.md |
| Deployment | skills/DEPLOYMENT.md |

---

## Agent Coordination

For complex tasks, the ORCHESTRATOR coordinates:
- DATABASE-AGENT → User, Project models + migrations
- BACKEND-AGENT → Auth, Projects, Dashboard APIs
- FRONTEND-AGENT → Login, Projects list/form, Dashboard UI
- DEVOPS-AGENT → Docker, CI/CD
- TEST-AGENT → Unit and integration tests
- REVIEW-AGENT → Security and code quality

Read agent definitions in `/agents/` folder.

---

## Workflow

```
1. Edit INITIAL.md (define product)
2. /generate-prp INITIAL.md
3. /execute-prp PRPs/sparq-dashboard-prp.md
```
