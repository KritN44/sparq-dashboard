# INITIAL.md - Sparq Dashboard Product Definition

> A collaborative dashboard for Marcom, Sales, and Management teams to track project progress from brief to campaign.

---

## PRODUCT

### Name
Sparq Dashboard

### Description
Sparq Dashboard is an internal tool that enables the Marcom team to create and manage project entries tracking client work from brand description through video production to campaign signup. Sales teams get real-time visibility into project statuses, and Management gets an executive dashboard with key metrics across regions and deliverables.

### Target Users
- **Marcom Team** — Creates and updates project entries
- **Sales Team** — Views project statuses (read-only)
- **CEO/Management** — Views aggregate metrics and dashboards

### Type
- [x] SaaS (Internal Tool)

---

## TECH STACK

### Backend
- [x] FastAPI + Python

### Frontend
- [x] React + Vite + TypeScript

### Database
- [x] PostgreSQL + SQLAlchemy

### Authentication
- [x] Email/Password (placeholder — SSO + role-based to be configured at deployment)

### UI Framework
- [x] Chakra UI

### Payments
- [ ] None required (internal tool)

---

## MODULES

### Module 1: Authentication (Required)

**Description:** User authentication and role-based authorization

**Models:**
- User: id, email, hashed_password, full_name, role (marcom | sales | management), is_active, created_at, updated_at
- RefreshToken: id, user_id (FK), token, expires_at, revoked

**Roles:**
- `marcom` — Can create, edit, delete project entries
- `sales` — Can view all project entries (read-only)
- `management` — Can view all project entries + management dashboard metrics

**API Endpoints:**
- POST /auth/register - Create new account (admin assigns role)
- POST /auth/login - Login with email/password
- POST /auth/refresh - Refresh access token
- POST /auth/logout - Revoke refresh token
- GET /auth/me - Get current user profile
- PUT /auth/me - Update profile

**Frontend Pages:**
- /login - Login page
- /profile - User profile page (protected)

---

### Module 2: Projects (Core Module)

**Description:** Marcom team creates and manages project entries tracking client work through the production pipeline. Sales team views all entries in read-only mode.

**Models:**
```
Project:
  - id: int (PK)
  - user_id: int (FK → User, created_by)
  - region: enum (TN, Kerala, AP, Telangana, Gujarat, Delhi, Mumbai)
  - city: str
  - salesperson_name: str
  - brand_name: str
  - category: enum (FMCG, Industrial Goods)
  - status: enum (
      Brand description generated,
      Deck in progress,
      Deck Shared,
      Client approved,
      Client rejected,
      Video production in progress,
      Video submitted for review,
      Video approved,
      Campaign signed up
    )
  - created_at: datetime
  - updated_at: datetime
```

**API Endpoints:**
```
GET    /api/v1/projects          - List all projects (with filters by region, status, category)
POST   /api/v1/projects          - Create project (Marcom only)
GET    /api/v1/projects/{id}     - Get project details
PUT    /api/v1/projects/{id}     - Update project (Marcom only)
DELETE /api/v1/projects/{id}     - Delete project (Marcom only)
GET    /api/v1/projects/export   - Export projects as CSV
```

**Frontend Pages:**
```
/projects           - List all projects (filterable table view)
/projects/new       - Create new project entry (Marcom only)
/projects/{id}      - Project detail view
/projects/{id}/edit - Edit project entry (Marcom only)
```

---

### Module 3: Management Dashboard

**Description:** Executive dashboard for CEO/Management with aggregate metrics and visual charts.

**API Endpoints:**
```
GET /api/v1/dashboard/metrics              - All dashboard metrics
GET /api/v1/dashboard/clients-by-region    - Client count per region
GET /api/v1/dashboard/briefs-approved      - Number of briefs approved (Client approved status)
GET /api/v1/dashboard/videos-generated     - Number of videos generated (Video submitted for review + Video approved)
GET /api/v1/dashboard/videos-approved      - Number of videos approved
GET /api/v1/dashboard/campaigns-completed  - Number of campaigns done via SparQ (Campaign signed up)
```

**Frontend Pages:**
```
/dashboard          - Main dashboard with metric cards and charts
  - Clients per region (bar/pie chart)
  - Briefs approved count
  - Videos generated count
  - Videos approved count
  - Campaigns completed count
  - Status distribution chart
```

---

## MVP SCOPE

### Must Have (MVP)
- [x] User registration and login with role assignment
- [x] Marcom can create, edit, and delete project entries
- [x] Sales can view all project entries with filters
- [x] Management dashboard with key metrics
- [x] Role-based access control (Marcom/Sales/Management)

### Nice to Have (Post-MVP)
- [ ] SSO integration (at deployment)
- [ ] Email notifications on status changes
- [ ] File uploads (decks, videos, briefs)
- [ ] Export dashboard metrics as PDF
- [ ] Activity log (who changed what)
- [ ] Advanced filtering and search

---

## ACCEPTANCE CRITERIA

### Authentication
- [ ] User can register with email/password
- [ ] User can login with email/password
- [ ] JWT tokens work correctly with refresh
- [ ] Protected routes redirect to login
- [ ] Role-based access enforced on all endpoints

### Projects
- [ ] Marcom user can create a project entry with all fields
- [ ] Marcom user can edit and delete their project entries
- [ ] Sales user can view all project entries (cannot edit/delete)
- [ ] Projects list supports filtering by region, status, category
- [ ] Status enum is enforced on all entries

### Dashboard
- [ ] Management user can view dashboard with all metrics
- [ ] Clients per region metric is accurate
- [ ] Briefs approved count is accurate
- [ ] Videos generated/approved counts are accurate
- [ ] Campaigns completed count is accurate

### Quality
- [ ] All API endpoints documented in OpenAPI
- [ ] Backend test coverage 80%+
- [ ] Frontend TypeScript strict mode passes
- [ ] Docker builds and runs successfully

---

## SPECIAL REQUIREMENTS

### Security
- [x] Rate limiting on auth endpoints
- [x] Input validation on all endpoints
- [x] SQL injection prevention (SQLAlchemy ORM)
- [x] XSS prevention
- [x] Role-based access control on all protected routes

### Deployment Notes
- SSO + role-based auth to be configured by DevOps engineer at deployment
- Current Email/Password auth serves as placeholder

---

## AGENTS

> These agents will build your product:

| Agent | Role | Works On |
|-------|------|----------|
| DATABASE-AGENT | Creates all models and migrations | User, Project models |
| BACKEND-AGENT | Builds API endpoints and services | Auth, Projects, Dashboard APIs |
| FRONTEND-AGENT | Creates UI pages and components | Login, Projects list/form, Dashboard |
| DEVOPS-AGENT | Sets up Docker, CI/CD, environments | Infrastructure |
| TEST-AGENT | Writes unit and integration tests | All code |
| REVIEW-AGENT | Security and code quality audit | All code |

---

# READY?

```bash
/generate-prp INITIAL.md
```

Then:

```bash
/execute-prp PRPs/sparq-dashboard-prp.md
```
