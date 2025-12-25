# MicroSaaS Development Playbook

> **Clone. Define. Build.** Go from idea to production-ready SaaS in hours.

A comprehensive **Context Engineering + Parallel Agent System** for building full-stack MicroSaaS products with Claude Code.

---

## The Promise

```
You: "I want to build an invoice management SaaS"

This Template:
├── 6 specialized agents working in parallel
├── 13 battle-tested skills for consistent code
├── Automated validation at every step
└── Production-ready code in ~30 minutes
```

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           THE PLAYBOOK FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. CLONE              2. SETUP                 3. GENERATE                 │
│  ┌──────────┐         ┌──────────────┐         ┌──────────────┐            │
│  │ git clone│  ───►   │/setup-project│  ───►   │ /generate-prp│            │
│  │ template │         │              │         │ INITIAL.md   │            │
│  └──────────┘         │ Interactive  │         │              │            │
│                       │ wizard asks: │         │ Creates full │            │
│                       │ • Product    │         │ blueprint    │            │
│                       │ • Modules    │         │ (PRP file)   │            │
│                       │ • Tech Stack │         │              │            │
│                       │              │         │              │            │
│                       │ Generates:   │         │              │            │
│                       │ • INITIAL.md │         │              │            │
│                       │ • CLAUDE.md  │         │              │            │
│                       └──────────────┘         └──────────────┘            │
│                                                       │                     │
│                                                       ▼                     │
│  4. BUILD WITH PARALLEL AGENTS                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  /execute-prp PRPs/your-product-prp.md                              │   │
│  │                                                                      │   │
│  │  PHASE 1: Foundation (4 agents in parallel)                         │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐       │   │
│  │  │ DATABASE   │ │ BACKEND    │ │ FRONTEND   │ │ DEVOPS     │       │   │
│  │  │ AGENT      │ │ AGENT      │ │ AGENT      │ │ AGENT      │       │   │
│  │  │ All models │ │ Structure  │ │ Structure  │ │ Docker     │       │   │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘       │   │
│  │                                                                      │   │
│  │  PHASE 2: Modules (Backend + Frontend parallel per module)          │   │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐       │   │
│  │  │ AUTH MODULE     │ │ CORE MODULE 1   │ │ CORE MODULE 2   │       │   │
│  │  │ BE + FE parallel│ │ BE + FE parallel│ │ BE + FE parallel│       │   │
│  │  └─────────────────┘ └─────────────────┘ └─────────────────┘       │   │
│  │                                                                      │   │
│  │  PHASE 3: Quality (3 agents in parallel)                            │   │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐                      │   │
│  │  │ TEST-AGENT │ │ REVIEW     │ │ RESEARCH   │                      │   │
│  │  │ 80%+ cover │ │ Security   │ │ Best prax  │                      │   │
│  │  └────────────┘ └────────────┘ └────────────┘                      │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  5. DONE!                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Backend API with all endpoints                                    │   │
│  │ ✅ Frontend with all pages and components                            │   │
│  │ ✅ Database models and migrations                                    │   │
│  │ ✅ Authentication (JWT + OAuth)                                      │   │
│  │ ✅ Docker + CI/CD ready                                              │   │
│  │ ✅ Tests with 80%+ coverage                                          │   │
│  │ ✅ Security reviewed                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Clone the Template

```bash
# Clone directly into your project folder
git clone https://github.com/manojkanur/FullStackDevelopmentTemplate.git my-saas-name
cd my-saas-name

# Remove template git history and start fresh
rm -rf .git
git init
git add .
git commit -m "Initial commit from MicroSaaS template"
```

Replace `my-saas-name` with your actual project name (e.g., `invoicegen`, `taskflow`, `clienthub`).

### 2. Define Your Product

**Option A: Interactive Setup (Recommended)**

```bash
/setup-project
```

The wizard will ask you about:
- Product name and description
- Tech stack preferences
- Core modules and features
- MVP scope

Then it generates customized `INITIAL.md` and `CLAUDE.md` for your project.

**Option B: Manual Setup**

Edit `INITIAL.md` with your product definition:

```markdown
## PRODUCT
### Name: InvoiceFlow
### Description: Invoice management SaaS for freelancers

## TECH STACK
- [x] FastAPI + Python
- [x] React + TypeScript
- [x] PostgreSQL
- [x] Stripe (for payments)

## MODULES

### Module 1: Authentication
[Pre-filled - just customize if needed]

### Module 2: Invoices
**Models:**
- Invoice: id, user_id, client_name, amount, status, due_date
- InvoiceItem: id, invoice_id, description, quantity, price

**API Endpoints:**
- GET /invoices - List user's invoices
- POST /invoices - Create invoice
- GET /invoices/{id} - Get invoice
- PUT /invoices/{id} - Update invoice
- POST /invoices/{id}/send - Send to client

**Frontend Pages:**
- /invoices - Invoice list
- /invoices/new - Create invoice
- /invoices/{id} - Invoice detail

### Module 3: Clients
[Define your client management module]

### Module 4: Dashboard
[Define your dashboard]
```

### 3. Generate the Blueprint

```bash
/generate-prp INITIAL.md
```

This creates `PRPs/invoiceflow-prp.md` with:
- Complete system architecture
- All database schemas
- All API endpoints
- All frontend pages
- Parallel execution plan
- Validation gates

### 4. Build with Parallel Agents

```bash
/execute-prp PRPs/invoiceflow-prp.md
```

Watch as 6 agents build your product in parallel:
- **Phase 1:** Database + Backend + Frontend + DevOps (all parallel)
- **Phase 2:** Auth + Invoices + Clients + Dashboard (all parallel)
- **Phase 3:** Tests + Security Review + Best Practices (all parallel)

### 5. Run Your Product

```bash
docker-compose up -d

# Frontend: http://localhost:3000
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## Architecture

```
your-product/
│
├── INITIAL.md                   # YOUR PRODUCT DEFINITION
├── CLAUDE.md                    # Global rules for all agents
│
├── .claude/commands/            # Slash commands
│   ├── generate-prp.md          # /generate-prp
│   └── execute-prp.md           # /execute-prp
│
├── skills/                      # 13 skill files (HOW to build)
│   ├── database-schema/         # SQLAlchemy patterns
│   ├── fastapi-backend/         # API patterns
│   ├── jwt-auth/                # JWT implementation
│   ├── google-oauth/            # OAuth 2.0 flow
│   ├── react-frontend/          # React + TypeScript
│   ├── frontend-ui/             # Chakra/Tailwind + animations
│   ├── api-integration/         # Axios + React Query
│   ├── error-handling/          # Exception patterns
│   ├── testing-strategy/        # pytest + RTL
│   ├── deployment/              # Docker + CI/CD
│   ├── performance/             # Optimization
│   ├── documentation/           # OpenAPI + docs
│   └── dev-orchestrator/        # Project structure
│
├── agents/                      # 6 agent definitions (WHO builds)
│   ├── ORCHESTRATOR.md          # Coordinates all agents
│   ├── database-agent.md        # Database specialist
│   ├── backend-agent.md         # API specialist
│   ├── frontend-agent.md        # UI specialist
│   ├── research-agent.md        # Best practices
│   └── other-agents.md          # Test, Review, DevOps
│
├── PRPs/                        # Generated blueprints
│   └── templates/prp_base.md
│
├── examples/                    # Code patterns to follow
│
├── backend/                     # GENERATED: FastAPI app
│   ├── app/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   └── services/
│   └── tests/
│
└── frontend/                    # GENERATED: React app
    └── src/
        ├── pages/
        ├── components/
        ├── hooks/
        └── services/
```

---

## The 6 Agents

| Agent | Skill Files | What It Creates |
|-------|-------------|-----------------|
| **DATABASE-AGENT** | `database-schema` | Models, migrations, relationships |
| **BACKEND-AGENT** | `fastapi-backend`, `jwt-auth`, `google-oauth`, `error-handling` | Routers, services, schemas, auth |
| **FRONTEND-AGENT** | `react-frontend`, `frontend-ui`, `api-integration` | Pages, components, hooks, context |
| **DEVOPS-AGENT** | `deployment`, `documentation` | Docker, CI/CD, env files |
| **TEST-AGENT** | `testing-strategy` | pytest tests, RTL tests, 80%+ coverage |
| **REVIEW-AGENT** | All skills | Security audit, performance review |

---

## The 13 Skills

| Skill | Purpose |
|-------|---------|
| `dev-orchestrator` | Project structure and development phases |
| `database-schema` | SQLAlchemy models, migrations, relationships |
| `fastapi-backend` | REST API design, router patterns |
| `jwt-auth` | JWT tokens, password hashing, refresh tokens |
| `google-oauth` | OAuth 2.0 flow with security |
| `react-frontend` | Component architecture, hooks, context |
| `frontend-ui` | UI framework, animations, design patterns |
| `api-integration` | Axios client, interceptors, React Query |
| `error-handling` | Custom exceptions, global handlers |
| `testing-strategy` | pytest fixtures, mocks, RTL patterns |
| `deployment` | Docker, docker-compose, GitHub Actions |
| `performance` | Caching, optimization, lazy loading |
| `documentation` | OpenAPI docs, READMEs, comments |

---

## Parallel Execution Deep Dive

The key innovation is **maximum parallelization**. Here's how agents work together:

### Phase 1: Foundation (4 Parallel Agents)

```python
# All 4 agents spawn simultaneously:
Task(prompt="DATABASE-AGENT: Create all models...", run_in_background=true)
Task(prompt="BACKEND-AGENT: Create project structure...", run_in_background=true)
Task(prompt="FRONTEND-AGENT: Initialize React app...", run_in_background=true)
Task(prompt="DEVOPS-AGENT: Create Docker files...", run_in_background=true)
```

### Phase 2: Modules (Parallel Per Module)

```python
# For each module, Backend + Frontend work in parallel:
# Auth Module
Task(prompt="BACKEND-AGENT: Auth endpoints...", run_in_background=true)
Task(prompt="FRONTEND-AGENT: Auth pages...", run_in_background=true)

# Invoices Module (runs parallel with Auth)
Task(prompt="BACKEND-AGENT: Invoice endpoints...", run_in_background=true)
Task(prompt="FRONTEND-AGENT: Invoice pages...", run_in_background=true)

# All modules run simultaneously!
```

### Phase 3: Quality (3 Parallel Agents)

```python
Task(prompt="TEST-AGENT: Write all tests...", run_in_background=true)
Task(prompt="REVIEW-AGENT: Security audit...", run_in_background=true)
Task(prompt="RESEARCH-AGENT: Validate best practices...", run_in_background=true)
```

---

## Example: Complete SaaS in 30 Minutes

### Input: INITIAL.md

```markdown
## PRODUCT
### Name: TaskFlow
### Description: Project management for small teams

## MODULES

### Module 1: Authentication (standard)

### Module 2: Projects
- Project: id, user_id, name, description, status
- POST/GET/PUT/DELETE /projects

### Module 3: Tasks
- Task: id, project_id, title, status, assignee_id, due_date
- POST/GET/PUT/DELETE /projects/{id}/tasks

### Module 4: Team
- TeamMember: id, project_id, user_id, role
- Invite/remove team members

### Module 5: Dashboard
- Overview with project stats
```

### Output: Full Application

```
backend/
├── app/
│   ├── models/
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── team_member.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── projects.py
│   │   ├── tasks.py
│   │   └── team.py
│   └── services/
│       ├── auth_service.py
│       ├── project_service.py
│       └── task_service.py
└── tests/
    ├── test_auth.py
    ├── test_projects.py
    └── test_tasks.py

frontend/
└── src/
    ├── pages/
    │   ├── LoginPage.tsx
    │   ├── DashboardPage.tsx
    │   ├── ProjectsPage.tsx
    │   └── TasksPage.tsx
    ├── components/
    │   ├── auth/
    │   ├── projects/
    │   └── tasks/
    └── context/
        └── AuthContext.tsx

docker-compose.yml
.github/workflows/ci.yml
```

---

## Validation Gates

The system validates at every phase:

| Phase | Validation | Command |
|-------|------------|---------|
| 1 | Migrations apply | `alembic upgrade head` |
| 1 | Docker config valid | `docker-compose config` |
| 2 | Backend linting | `ruff check backend/` |
| 2 | Frontend types | `npm run type-check` |
| 3 | Test coverage | `pytest --cov-fail-under=80` |
| Final | Build succeeds | `docker-compose build` |
| Final | Services healthy | `curl localhost:8000/health` |

---

## Customization

### Different Tech Stack

Edit the `TECH STACK` section in `INITIAL.md`:

```markdown
## TECH STACK
- [ ] FastAPI + Python
- [x] Express + Node.js + TypeScript  # Switch to Node.js
- [x] Next.js + TypeScript             # Use Next.js
- [x] Tailwind + shadcn/ui             # Different UI
```

### Add Integrations

```markdown
## SPECIAL REQUIREMENTS
### Integrations
- [x] Stripe for payments
- [x] SendGrid for emails
- [x] S3 for file uploads
```

### Different Auth

```markdown
## TECH STACK
### Authentication
- [ ] JWT + bcrypt
- [x] Auth0          # Use Auth0 instead
- [ ] Supabase Auth
```

---

## Commands Reference

### `/setup-project` (Start Here!)

```bash
/setup-project
```

Interactive wizard that collects your project requirements and generates:
- **INITIAL.md** - Complete product definition
- **CLAUDE.md** - Project-specific rules and conventions

The wizard asks about:
- Product name and description
- Tech stack (backend, frontend, UI, auth)
- Core modules and their entities
- Additional features (payments, emails, etc.)
- MVP scope and priorities

### `/generate-prp`

```bash
/generate-prp INITIAL.md
```

Reads your product definition and generates a comprehensive PRP with:
- System architecture
- Database schemas
- All API endpoints
- All frontend pages
- Agent assignments
- Parallel execution plan

### `/execute-prp`

```bash
/execute-prp PRPs/your-product-prp.md
```

Executes the PRP with 6 parallel agents:
- Spawns agents in optimal order
- Validates after each phase
- Reports progress in real-time
- Generates final summary

### Full Workflow

```
/setup-project              # Step 1: Interactive setup
    ↓
/generate-prp INITIAL.md    # Step 2: Generate blueprint
    ↓
/execute-prp PRPs/xxx.md    # Step 3: Build with agents
    ↓
docker-compose up -d        # Step 4: Run your app!
```

---

## Troubleshooting

### Agents not running in parallel?

Ensure Claude Code's Task tool is being used with `run_in_background=true`. The ORCHESTRATOR should spawn multiple agents in a single message.

### Validation gate failed?

Check the specific error:
- `alembic upgrade head` - Model/migration issue
- `ruff check` - Python linting error
- `npm run type-check` - TypeScript error
- `pytest` - Test failure

### PRP incomplete?

Add more detail to INITIAL.md:
- Be specific about models and fields
- List all API endpoints explicitly
- Define all frontend pages

---

## Contributing

1. Fork the repository
2. Add new skills in `skills/[name]/SKILL.md`
3. Add new agents in `agents/[name].md`
4. Update examples
5. Submit PR

---

## Roadmap

### Planned Skills
- [ ] `stripe-billing` - Payment integration
- [ ] `email-service` - Transactional emails
- [ ] `file-upload` - S3/Cloudinary
- [ ] `websockets` - Real-time features
- [ ] `multi-tenant` - SaaS multi-tenancy

### Planned Agents
- [ ] `payment-agent` - Stripe/billing
- [ ] `security-agent` - Hardening
- [ ] `infrastructure-agent` - Cloud deployment

---

## License

MIT License - Build anything you want!

---

**Built for developers who ship fast.**
