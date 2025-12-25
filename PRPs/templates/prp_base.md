# PRP Base Template

> Product Requirements Prompt (PRP) - Comprehensive implementation blueprint
> This template guides AI agents through building complete features.

---

# [FEATURE NAME]

## METADATA
```yaml
name: "[Feature Name]"
version: "1.0"
created: "[Date]"
status: "pending"
estimated_time: "[X hours]"
complexity: "[low/medium/high]"
```

---

## 1. OBJECTIVE

### What We're Building
[Clear description of the end state]

### Why We're Building It
[Business value and user benefit]

### Success Criteria
- [ ] [Criterion 1]
- [ ] [Criterion 2]
- [ ] [Criterion 3]

---

## 2. CONTEXT - MUST READ

### Skills to Reference
```yaml
skills:
  - file: skills/[skill-name]/SKILL.md
    why: "[What pattern to follow]"
  - file: skills/[skill-name]/SKILL.md
    why: "[What pattern to follow]"
```

### Examples to Follow
```yaml
examples:
  - file: examples/[example-file]
    why: "[Pattern to replicate]"
```

### Documentation
```yaml
docs:
  - url: "[Documentation URL]"
    section: "[Specific section]"
    critical: "[Key insight]"
```

### Critical Notes
```
⚠️ IMPORTANT: [Critical requirement that must not be overlooked]

⚠️ GOTCHA: [Common mistake to avoid]

⚠️ DEPENDENCY: [External dependency or requirement]
```

---

## 3. ARCHITECTURE

### System Design
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  [ASCII diagram of the architecture]                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow
```
[Step 1] → [Step 2] → [Step 3] → [Result]
```

### File Structure
```
project/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── [new_model.py]      ← CREATE
│   │   ├── schemas/
│   │   │   └── [new_schema.py]     ← CREATE
│   │   ├── routers/
│   │   │   └── [new_router.py]     ← CREATE
│   │   └── services/
│   │       └── [new_service.py]    ← CREATE
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   └── [NewPage.tsx]       ← CREATE
│   │   └── components/
│   │       └── [NewComponent.tsx]  ← CREATE
```

---

## 4. DATABASE SCHEMA

### Models
```python
# models/[model_name].py

class [ModelName](Base, TimestampMixin):
    __tablename__ = "[table_name]"
    
    id = Column(Integer, primary_key=True, index=True)
    # ... fields
```

### Relationships
```
[Model A] ──1:N──► [Model B]
[Model B] ──N:M──► [Model C]
```

### Migration
```bash
alembic revision --autogenerate -m "[migration description]"
alembic upgrade head
```

---

## 5. IMPLEMENTATION TASKS

### Phase 1: Foundation
**Agent: database-agent**

#### Task 1.1: Create Database Model
```yaml
action: CREATE
file: backend/app/models/[model_name].py
pattern: Follow skills/database-schema/SKILL.md
includes:
  - Model class with fields
  - Relationships
  - Indexes
```

#### Task 1.2: Create Migration
```yaml
action: RUN
command: alembic revision --autogenerate -m "[description]"
then: alembic upgrade head
```

### Phase 2: Backend
**Agent: backend-agent**

#### Task 2.1: Create Schemas
```yaml
action: CREATE
file: backend/app/schemas/[schema_name].py
includes:
  - [Name]Create schema
  - [Name]Update schema
  - [Name]Response schema
```

#### Task 2.2: Create Service
```yaml
action: CREATE
file: backend/app/services/[service_name].py
includes:
  - CRUD functions
  - Business logic
  - Error handling
```

#### Task 2.3: Create Router
```yaml
action: CREATE
file: backend/app/routers/[router_name].py
endpoints:
  - GET /[resource] - List all
  - POST /[resource] - Create new
  - GET /[resource]/{id} - Get one
  - PATCH /[resource]/{id} - Update
  - DELETE /[resource]/{id} - Delete
```

#### Task 2.4: Register Router
```yaml
action: MODIFY
file: backend/app/main.py
add: app.include_router([router].router, prefix="/api/v1")
```

### Phase 3: Frontend
**Agent: frontend-agent**

#### Task 3.1: Create Types
```yaml
action: CREATE
file: frontend/src/types/[type_name].ts
includes:
  - Interface definitions
  - API response types
```

#### Task 3.2: Create API Service
```yaml
action: CREATE
file: frontend/src/services/[service_name].ts
includes:
  - API client methods
  - Error handling
```

#### Task 3.3: Create Hooks
```yaml
action: CREATE
file: frontend/src/hooks/use[Feature].ts
includes:
  - React Query hooks
  - Mutations
```

#### Task 3.4: Create Components
```yaml
action: CREATE
file: frontend/src/components/[ComponentName].tsx
includes:
  - Component with props
  - TypeScript types
  - Chakra UI styling
  - Framer Motion animations
```

#### Task 3.5: Create Pages
```yaml
action: CREATE
file: frontend/src/pages/[PageName].tsx
includes:
  - Page component
  - Data fetching
  - Error/loading states
```

#### Task 3.6: Add Routes
```yaml
action: MODIFY
file: frontend/src/App.tsx
add: Route for new page
```

### Phase 4: Testing
**Agent: test-agent**

#### Task 4.1: Backend Tests
```yaml
action: CREATE
file: backend/tests/test_[feature].py
includes:
  - API endpoint tests
  - Service tests
  - Edge cases
coverage: 80%+
```

#### Task 4.2: Frontend Tests
```yaml
action: CREATE
file: frontend/src/__tests__/[Feature].test.tsx
includes:
  - Component tests
  - Hook tests
  - MSW mock handlers
```

---

## 6. VALIDATION GATES

### After Each Phase

```bash
# Phase 1: Database
alembic upgrade head
pytest backend/tests/test_models.py -v

# Phase 2: Backend
ruff check backend/app
pytest backend/tests -v
curl http://localhost:8000/docs  # Check Swagger

# Phase 3: Frontend
cd frontend && npm run lint
cd frontend && npm run type-check
cd frontend && npm test

# Phase 4: Integration
docker-compose up -d
# Manual testing of full flow
```

### Final Validation

```bash
# All tests pass
pytest backend/tests -v --cov=app
cd frontend && npm test -- --coverage

# Lint passes
ruff check backend/ --fix
cd frontend && npm run lint

# Build succeeds
docker-compose build

# App runs
docker-compose up -d
curl http://localhost:8000/health
```

---

## 7. DELIVERABLES

### Files Created
- [ ] `backend/app/models/[model].py`
- [ ] `backend/app/schemas/[schema].py`
- [ ] `backend/app/services/[service].py`
- [ ] `backend/app/routers/[router].py`
- [ ] `backend/alembic/versions/[migration].py`
- [ ] `backend/tests/test_[feature].py`
- [ ] `frontend/src/types/[types].ts`
- [ ] `frontend/src/services/[service].ts`
- [ ] `frontend/src/hooks/use[Feature].ts`
- [ ] `frontend/src/components/[Component].tsx`
- [ ] `frontend/src/pages/[Page].tsx`
- [ ] `frontend/src/__tests__/[Feature].test.tsx`

### API Endpoints
- [ ] `GET /api/v1/[resource]`
- [ ] `POST /api/v1/[resource]`
- [ ] `GET /api/v1/[resource]/{id}`
- [ ] `PATCH /api/v1/[resource]/{id}`
- [ ] `DELETE /api/v1/[resource]/{id}`

### Test Coverage
- [ ] Backend: 80%+
- [ ] Frontend: 80%+

---

## 8. ROLLBACK PLAN

If implementation fails:

```bash
# Revert database
alembic downgrade -1

# Revert code
git checkout -- .

# Or specific files
git checkout -- backend/app/models/[file].py
```

---

## 9. POST-IMPLEMENTATION

### Documentation
- [ ] Update README.md
- [ ] Add API documentation
- [ ] Update Swagger descriptions

### Monitoring
- [ ] Add logging
- [ ] Add error tracking
- [ ] Add performance metrics

---

## EXECUTION COMMAND

```
/execute-prp PRPs/[this-file-name].md
```
