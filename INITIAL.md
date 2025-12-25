# INITIAL.md - Product Definition Template

> Define your **entire MicroSaaS product** here. Then run `/generate-prp INITIAL.md` to create a comprehensive implementation blueprint.

---

## PRODUCT

### Name
[Your product name]

### Description
[What does your product do? Who is it for? What problem does it solve?]

### Type
- [ ] SaaS (Software as a Service)
- [ ] Marketplace
- [ ] Platform
- [ ] API Service
- [ ] Other: ____________

---

## TECH STACK

> Check your preferred technologies. Defaults are recommended for most projects.

### Backend
- [x] FastAPI + Python 3.11+ (recommended)
- [ ] Express + Node.js + TypeScript
- [ ] Django + Python
- [ ] Other: ____________

### Frontend
- [x] React + TypeScript + Vite (recommended)
- [ ] Next.js + TypeScript
- [ ] Vue 3 + TypeScript
- [ ] Other: ____________

### Database
- [x] PostgreSQL (recommended)
- [ ] MySQL
- [ ] MongoDB
- [ ] SQLite (dev only)

### Authentication
- [x] JWT + bcrypt (recommended)
- [ ] Session-based
- [ ] Auth0 / Clerk
- [ ] Supabase Auth

### OAuth Providers (optional)
- [x] Google OAuth 2.0
- [ ] GitHub OAuth
- [ ] Microsoft OAuth
- [ ] None

### UI Framework
- [x] Chakra UI (recommended)
- [ ] Tailwind CSS + shadcn/ui
- [ ] MUI (Material UI)
- [ ] Mantine

### Payments (optional)
- [ ] Dodo Payments (recommended - simple API, great for startups)
- [ ] Stripe (most popular, extensive features)
- [ ] LemonSqueezy (handles taxes, great for digital products)
- [ ] Paddle (merchant of record, handles compliance)
- [ ] None (free product or add later)

---

## MODULES

> Define all the modules/features your product needs. Each module will be built in parallel.

### Module 1: Authentication (Required)

**Description:** User authentication and authorization

**Models:**
- User: id, email, hashed_password, full_name, is_active, is_verified, oauth_provider, created_at
- RefreshToken: id, user_id, token, expires_at, revoked

**API Endpoints:**
- POST /auth/register - Create new account
- POST /auth/login - Login with email/password
- POST /auth/refresh - Refresh access token
- POST /auth/logout - Revoke refresh token
- GET /auth/me - Get current user profile
- PUT /auth/me - Update profile
- POST /auth/forgot-password - Request password reset
- POST /auth/reset-password - Reset password with token
- GET /auth/google - Start Google OAuth (if enabled)
- GET /auth/google/callback - Google OAuth callback

**Frontend Pages:**
- /login - Login page
- /register - Registration page
- /forgot-password - Forgot password page
- /reset-password - Reset password page
- /profile - User profile page (protected)

---

### Module 2: [Your Core Module]

**Description:** [What does this module do?]

**Models:**
```
[ModelName]:
  - id: int (primary key)
  - user_id: int (foreign key to User)
  - [field]: [type]
  - [field]: [type]
  - created_at: datetime
  - updated_at: datetime
```

**API Endpoints:**
```
GET    /api/[resource]         - List all (with pagination)
POST   /api/[resource]         - Create new
GET    /api/[resource]/{id}    - Get by ID
PUT    /api/[resource]/{id}    - Update by ID
DELETE /api/[resource]/{id}    - Delete by ID
```

**Frontend Pages:**
```
/[resource]          - List page
/[resource]/new      - Create page
/[resource]/{id}     - Detail page
/[resource]/{id}/edit - Edit page
```

---

### Module 3: [Another Module]

[Repeat the same structure for each module]

---

### Module 4: Dashboard (Optional)

**Description:** User dashboard with overview and stats

**Frontend Pages:**
- /dashboard - Main dashboard with widgets
- /settings - User settings

---

### Module 5: Admin Panel (Optional)

**Description:** Admin-only management interface

**API Endpoints:**
```
GET  /admin/users        - List all users
PUT  /admin/users/{id}   - Update user (activate/deactivate)
GET  /admin/stats        - Get platform statistics
```

**Frontend Pages:**
- /admin - Admin dashboard (protected, admin only)
- /admin/users - User management

---

## MVP SCOPE

> What features are essential for launch? Check all that apply.

### Must Have (MVP)
- [x] User registration and login
- [x] [Core feature 1]
- [x] [Core feature 2]
- [ ] [Core feature 3]

### Nice to Have (Post-MVP)
- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

### Future
- [ ] [Feature 1]
- [ ] [Feature 2]

---

## ACCEPTANCE CRITERIA

> Define what "done" looks like for your MVP.

### Authentication
- [ ] User can register with email/password
- [ ] User can login with email/password
- [ ] User can login with Google (if enabled)
- [ ] JWT tokens work correctly with refresh
- [ ] Protected routes redirect to login
- [ ] Password reset flow works

### [Core Module]
- [ ] User can create [resource]
- [ ] User can view list of [resources]
- [ ] User can edit their [resources]
- [ ] User can delete their [resources]
- [ ] Proper validation and error handling

### Quality
- [ ] All API endpoints documented in OpenAPI
- [ ] Backend test coverage 80%+
- [ ] Frontend TypeScript strict mode passes
- [ ] Docker builds and runs successfully
- [ ] CI/CD pipeline passes

---

## SPECIAL REQUIREMENTS

> Any specific requirements, integrations, or gotchas to consider.

### Security
- [ ] Rate limiting on auth endpoints
- [ ] CSRF protection for OAuth
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention
- [ ] XSS prevention

### Performance
- [ ] Pagination on list endpoints
- [ ] Database indexes on frequently queried fields
- [ ] Lazy loading on frontend

### Integrations
- [ ] Email service for password reset (SendGrid/Resend/etc.)
- [ ] File upload (S3/Cloudinary/etc.)
- [ ] Payment processing (Stripe/etc.)
- [ ] Analytics (Mixpanel/Segment/etc.)

### Other
[Add any other requirements here]

---

## REFERENCE

### Examples to Follow
> Reference code patterns from the examples/ folder

- `examples/README.md` - JWT utilities, auth router, API client patterns

### Skills to Use
> The agents will automatically use these, but you can reference specific ones

| Module | Skill |
|--------|-------|
| Database | skills/database-schema/SKILL.md |
| Backend API | skills/fastapi-backend/SKILL.md |
| Authentication | skills/jwt-auth/SKILL.md |
| OAuth | skills/google-oauth/SKILL.md |
| Frontend | skills/react-frontend/SKILL.md |
| UI Components | skills/modern-ui-kit/SKILL.md |
| API Integration | skills/api-integration/SKILL.md |
| Error Handling | skills/error-handling/SKILL.md |
| Testing | skills/testing-strategy/SKILL.md |
| Deployment | skills/deployment/SKILL.md |
| Performance | skills/performance/SKILL.md |
| Documentation | skills/documentation/SKILL.md |
| Orchestration | skills/dev-orchestrator/SKILL.md |

---

## AGENTS

> These 6 agents will build your product in parallel:

| Agent | Role | Works On |
|-------|------|----------|
| DATABASE-AGENT | Creates all models and migrations | All database models |
| BACKEND-AGENT | Builds API endpoints and services | All modules' backends |
| FRONTEND-AGENT | Creates UI pages and components | All modules' frontends |
| DEVOPS-AGENT | Sets up Docker, CI/CD, environments | Infrastructure |
| TEST-AGENT | Writes unit and integration tests | All code |
| REVIEW-AGENT | Security and code quality audit | All code |

---

# READY?

After completing this template, run:

```bash
/generate-prp INITIAL.md
```

This creates a comprehensive PRP (Product Requirements Prompt) in `PRPs/[product-name]-prp.md`.

Then execute with parallel agents:

```bash
/execute-prp PRPs/[product-name]-prp.md
```

The ORCHESTRATOR will coordinate all 6 agents to build your product:
- Phase 1: Database + Backend + Frontend + DevOps (all parallel)
- Phase 2: All modules (Backend + Frontend parallel per module)
- Phase 3: Test + Review + Research (all parallel)

---

**Estimated build time:** Depends on complexity
- Simple (2-3 modules): ~15-20 minutes
- Medium (4-5 modules): ~25-35 minutes
- Complex (6+ modules): ~40-60 minutes
