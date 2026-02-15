# PRP: Sparq Dashboard

> Implementation blueprint for parallel agent execution

---

## METADATA

| Field | Value |
|-------|-------|
| **Product** | Sparq Dashboard |
| **Type** | SaaS (Internal Tool) |
| **Version** | 1.0 |
| **Created** | 2026-02-14 |
| **Complexity** | Medium |

---

## PRODUCT OVERVIEW

**Description:** Sparq Dashboard is an internal tool for Marcom, Sales, and Management teams. Marcom creates and manages project entries tracking client work from brand description through video production to campaign signup. Sales views project statuses in real-time. Management gets an executive dashboard with aggregate metrics.

**Value Proposition:** Centralizes project tracking across teams — Marcom manages the pipeline, Sales gets visibility, Management gets metrics. Replaces spreadsheets and email chains.

**MVP Scope:**
- [ ] User registration and login with role assignment (marcom/sales/management)
- [ ] Marcom can create, edit, and delete project entries
- [ ] Sales can view all project entries with filters (region, status, category)
- [ ] Management dashboard with key metrics (clients per region, briefs approved, videos generated/approved, campaigns completed)
- [ ] Role-based access control enforced on all endpoints and pages

---

## TECH STACK

| Layer | Technology | Skill Reference |
|-------|------------|-----------------|
| Backend | FastAPI + Python 3.11+ | skills/BACKEND.md |
| Frontend | React + TypeScript + Vite | skills/FRONTEND.md |
| Database | PostgreSQL + SQLAlchemy | skills/DATABASE.md |
| Auth | JWT + bcrypt (Email/Password) | skills/BACKEND.md |
| UI | Chakra UI | skills/FRONTEND.md |
| Testing | pytest + React Testing Library | skills/TESTING.md |
| Deployment | Docker + docker-compose | skills/DEPLOYMENT.md |

---

## DATABASE MODELS

### User Model
```
User:
  - id: int (PK, auto-increment)
  - email: str (unique, indexed)
  - hashed_password: str
  - full_name: str
  - role: enum (marcom, sales, management)
  - is_active: bool (default: true)
  - created_at: datetime (auto)
  - updated_at: datetime (auto)
```

### RefreshToken Model
```
RefreshToken:
  - id: int (PK, auto-increment)
  - user_id: int (FK → User)
  - token: str (unique, indexed)
  - expires_at: datetime
  - revoked: bool (default: false)
  - created_at: datetime (auto)
```

### Project Model
```
Project:
  - id: int (PK, auto-increment)
  - user_id: int (FK → User, created_by)
  - region: enum (TN, Kerala, AP, Telangana, Gujarat, Delhi, Mumbai)
  - city: str
  - salesperson_name: str
  - brand_name: str
  - category: enum (FMCG, Industrial Goods)
  - status: enum (
      brand_description_generated,
      deck_in_progress,
      deck_shared,
      client_approved,
      client_rejected,
      video_production_in_progress,
      video_submitted_for_review,
      video_approved,
      campaign_signed_up
    )
  - created_at: datetime (auto)
  - updated_at: datetime (auto)

Relationships:
  - Project.user_id → User.id (many-to-one)
  - User.projects → Project[] (one-to-many)
```

---

## MODULES

### Module 1: Authentication
**Agents:** DATABASE-AGENT + BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /auth/register | Create account with role | None |
| POST | /auth/login | Login, get JWT tokens | None |
| POST | /auth/refresh | Refresh access token | Refresh token |
| POST | /auth/logout | Revoke refresh token | JWT |
| GET | /auth/me | Get current user profile | JWT |
| PUT | /auth/me | Update profile | JWT |

**Frontend Pages:**
| Route | Page | Components |
|-------|------|------------|
| /login | LoginPage | LoginForm, AppLogo, GradientButton |
| /profile | ProfilePage | ProfileCard, EditProfileForm |

**Auth Middleware:**
- `get_current_user` — Validates JWT, returns User
- `require_role(role)` — Checks user has required role
- `require_roles([roles])` — Checks user has one of required roles

---

### Module 2: Projects
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/v1/projects | List all projects (filterable) | JWT | Any |
| POST | /api/v1/projects | Create project | JWT | marcom |
| GET | /api/v1/projects/{id} | Get project detail | JWT | Any |
| PUT | /api/v1/projects/{id} | Update project | JWT | marcom |
| DELETE | /api/v1/projects/{id} | Delete project | JWT | marcom |
| GET | /api/v1/projects/export | Export as CSV | JWT | Any |

**Query Filters (GET /api/v1/projects):**
- `region` — Filter by region enum
- `status` — Filter by status enum
- `category` — Filter by category enum
- `salesperson` — Search by salesperson name
- `brand` — Search by brand name
- `page` / `per_page` — Pagination

**Frontend Pages:**
| Route | Page | Components | Access |
|-------|------|------------|--------|
| /projects | ProjectsPage | ProjectTable, FilterBar, SearchInput, StatusBadge | All roles |
| /projects/new | ProjectFormPage | ProjectForm, RegionSelect, CategorySelect, StatusSelect | marcom |
| /projects/{id} | ProjectDetailPage | ProjectDetail, StatusTimeline, BackButton | All roles |
| /projects/{id}/edit | ProjectFormPage | ProjectForm (edit mode) | marcom |

---

### Module 3: Management Dashboard
**Agents:** BACKEND-AGENT + FRONTEND-AGENT

**Backend Endpoints:**
| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | /api/v1/dashboard/metrics | All metrics combined | JWT | management |
| GET | /api/v1/dashboard/clients-by-region | Client count per region | JWT | management |
| GET | /api/v1/dashboard/briefs-approved | Briefs approved count | JWT | management |
| GET | /api/v1/dashboard/videos-generated | Videos generated count | JWT | management |
| GET | /api/v1/dashboard/videos-approved | Videos approved count | JWT | management |
| GET | /api/v1/dashboard/campaigns-completed | Campaigns completed count | JWT | management |

**Metrics Definitions:**
- **Clients by region:** COUNT(DISTINCT brand_name) GROUP BY region
- **Briefs approved:** COUNT(*) WHERE status = 'client_approved'
- **Videos generated:** COUNT(*) WHERE status IN ('video_submitted_for_review', 'video_approved')
- **Videos approved:** COUNT(*) WHERE status = 'video_approved'
- **Campaigns completed:** COUNT(*) WHERE status = 'campaign_signed_up'

**Frontend Pages:**
| Route | Page | Components | Access |
|-------|------|------------|--------|
| /dashboard | DashboardPage | MetricCard, RegionChart (Bar), StatusPieChart, StatsGrid | management |

---

## PHASE EXECUTION PLAN

### Phase 1: Foundation (4 agents in parallel)

**DATABASE-AGENT:**
- Read: `skills/DATABASE.md`
- Create: `backend/app/models/user.py` (User model with role enum)
- Create: `backend/app/models/project.py` (Project model with region, category, status enums)
- Create: `backend/app/models/__init__.py` (exports)
- Create: `backend/app/database.py` (engine, SessionLocal, Base)
- Setup: Alembic migrations
- Output: All models, initial migration

**BACKEND-AGENT:**
- Read: `skills/BACKEND.md`
- Create: `backend/app/main.py` (FastAPI app, CORS, routers)
- Create: `backend/app/config.py` (Settings with pydantic)
- Create: `backend/requirements.txt`
- Create: `backend/app/schemas/` (Pydantic schemas for all models)
- Output: Project structure, config, schemas

**FRONTEND-AGENT:**
- Read: `skills/FRONTEND.md`
- Setup: Vite + React + TypeScript project
- Install: Chakra UI, react-router-dom, axios, recharts
- Create: `frontend/src/types/user.ts`, `frontend/src/types/project.ts`
- Create: `frontend/src/services/api.ts` (Axios instance with interceptors)
- Create: `frontend/src/context/AuthContext.tsx`
- Create: `frontend/src/components/Layout/` (Sidebar, Navbar, ProtectedRoute)
- Output: Frontend scaffold, types, auth context, layout

**DEVOPS-AGENT:**
- Read: `skills/DEPLOYMENT.md`
- Create: `backend/Dockerfile`
- Create: `frontend/Dockerfile`
- Create: `docker-compose.yml` (backend, frontend, postgres)
- Create: `.env.example`
- Create: `.gitignore`
- Output: Docker setup, env template

**Validation Gate 1:**
```bash
cd backend && pip install -r requirements.txt
alembic upgrade head
cd frontend && npm install
docker-compose config
```

---

### Phase 2: Modules (backend + frontend per module)

**BACKEND-AGENT — Auth Module:**
- Create: `backend/app/auth/jwt.py` (create/verify tokens)
- Create: `backend/app/auth/dependencies.py` (get_current_user, require_role)
- Create: `backend/app/routers/auth.py` (register, login, refresh, logout, me)
- Create: `backend/app/services/auth.py` (auth business logic)
- Create: `backend/app/schemas/auth.py` (LoginRequest, TokenResponse, etc.)

**BACKEND-AGENT — Projects Module:**
- Create: `backend/app/routers/projects.py` (CRUD + filters + export)
- Create: `backend/app/services/projects.py` (project business logic)
- Create: `backend/app/schemas/project.py` (ProjectCreate, ProjectUpdate, ProjectResponse)

**BACKEND-AGENT — Dashboard Module:**
- Create: `backend/app/routers/dashboard.py` (metrics endpoints)
- Create: `backend/app/services/dashboard.py` (aggregation queries)
- Create: `backend/app/schemas/dashboard.py` (MetricsResponse, RegionCount, etc.)

**FRONTEND-AGENT — Auth Pages:**
- Create: `frontend/src/pages/LoginPage.tsx`
- Create: `frontend/src/pages/ProfilePage.tsx`
- Create: `frontend/src/services/authService.ts`

**FRONTEND-AGENT — Projects Pages:**
- Create: `frontend/src/pages/ProjectsPage.tsx` (table with filters)
- Create: `frontend/src/pages/ProjectDetailPage.tsx`
- Create: `frontend/src/pages/ProjectFormPage.tsx` (create/edit)
- Create: `frontend/src/components/ProjectTable/ProjectTable.tsx`
- Create: `frontend/src/components/ProjectTable/FilterBar.tsx`
- Create: `frontend/src/components/ProjectTable/StatusBadge.tsx`
- Create: `frontend/src/components/ProjectForm/ProjectForm.tsx`
- Create: `frontend/src/services/projectService.ts`

**FRONTEND-AGENT — Dashboard Page:**
- Create: `frontend/src/pages/DashboardPage.tsx`
- Create: `frontend/src/components/DashboardCards/MetricCard.tsx`
- Create: `frontend/src/components/Charts/RegionChart.tsx`
- Create: `frontend/src/components/Charts/StatusPieChart.tsx`
- Create: `frontend/src/services/dashboardService.ts`

**FRONTEND-AGENT — Routing:**
- Create: `frontend/src/App.tsx` (React Router with role-based routes)

**Validation Gate 2:**
```bash
ruff check backend/
cd frontend && npm run lint && npm run type-check
```

---

### Phase 3: Quality (3 agents in parallel)

**TEST-AGENT:**
- Read: `skills/TESTING.md`
- Create: `backend/tests/conftest.py` (test DB, fixtures)
- Create: `backend/tests/test_auth.py` (auth endpoint tests)
- Create: `backend/tests/test_projects.py` (CRUD tests, role-based access tests)
- Create: `backend/tests/test_dashboard.py` (metrics accuracy tests)
- Create: `frontend/src/__tests__/` (component tests with RTL)
- Target: 80%+ coverage

**REVIEW-AGENT:**
- Security audit: SQL injection, XSS, CSRF, rate limiting
- Role enforcement: Verify marcom/sales/management access controls
- Input validation: All endpoints validate enums and required fields
- Performance: Query optimization, pagination, indexing

**DEVOPS-AGENT:**
- Final Docker build verification
- Health check endpoint
- Production-ready docker-compose

**Final Validation:**
```bash
pytest backend/tests -v --cov --cov-fail-under=80
cd frontend && npm test
docker-compose build
docker-compose up -d
curl http://localhost:8000/health
```

---

## VALIDATION GATES

| Gate | Commands | Pass Criteria |
|------|----------|---------------|
| 1 - Foundation | `pip install -r requirements.txt`, `alembic upgrade head`, `npm install`, `docker-compose config` | All commands succeed |
| 2 - Modules | `ruff check backend/`, `npm run lint`, `npm run type-check` | Zero errors |
| 3 - Quality | `pytest --cov --cov-fail-under=80`, `npm test` | 80%+ coverage, all tests pass |
| Final | `docker-compose build`, `docker-compose up -d`, `curl localhost:8000/health` | Build succeeds, health check returns 200 |

---

## FILE MANIFEST

### Backend (17 files)
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── project.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── project.py
│   │   └── dashboard.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── projects.py
│   │   └── dashboard.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── projects.py
│   │   └── dashboard.py
│   └── auth/
│       ├── __init__.py
│       ├── jwt.py
│       └── dependencies.py
├── alembic/
├── tests/
│   ├── conftest.py
│   ├── test_auth.py
│   ├── test_projects.py
│   └── test_dashboard.py
├── requirements.txt
├── Dockerfile
└── alembic.ini
```

### Frontend (22 files)
```
frontend/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── types/
│   │   ├── user.ts
│   │   └── project.ts
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── projectService.ts
│   │   └── dashboardService.ts
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── ProjectTable/
│   │   │   ├── ProjectTable.tsx
│   │   │   ├── FilterBar.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── ProjectForm/
│   │   │   └── ProjectForm.tsx
│   │   ├── DashboardCards/
│   │   │   └── MetricCard.tsx
│   │   └── Charts/
│   │       ├── RegionChart.tsx
│   │       └── StatusPieChart.tsx
│   └── pages/
│       ├── LoginPage.tsx
│       ├── ProjectsPage.tsx
│       ├── ProjectDetailPage.tsx
│       ├── ProjectFormPage.tsx
│       ├── DashboardPage.tsx
│       └── ProfilePage.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
└── Dockerfile
```

### Infrastructure (4 files)
```
docker-compose.yml
.env.example
.gitignore
```

---

## ENVIRONMENT VARIABLES

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

## NEXT STEP

Execute with parallel agents:
```bash
/execute-prp PRPs/sparq-dashboard-prp.md
```
