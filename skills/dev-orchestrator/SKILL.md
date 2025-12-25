# Dev Orchestrator Skill

## Purpose
Guide developers through building full-stack applications with FastAPI + React + PostgreSQL + JWT + Google OAuth. This skill coordinates all other skills.

## Tech Stack
- **Backend**: Python FastAPI
- **Frontend**: React with TypeScript
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Auth**: JWT tokens + Google OAuth 2.0

## Project Structure
```
project/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry
│   │   ├── config.py            # Settings & env vars
│   │   ├── database.py          # DB connection
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── routers/             # API routes
│   │   ├── services/            # Business logic
│   │   ├── auth/                # JWT & OAuth
│   │   └── utils/               # Helpers
│   ├── alembic/                 # DB migrations
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── types/
│   │   └── utils/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## Skill Selection Guide

| Task | Use This Skill |
|------|----------------|
| Design API endpoints | `02-fastapi-backend` |
| Create database models | `03-database-schema` |
| Implement JWT auth | `04-jwt-auth` |
| Add Google OAuth | `05-google-oauth` |
| Build React components | `06-react-frontend` |
| Connect frontend to API | `07-api-integration` |
| Handle errors | `08-error-handling` |
| Write tests | `09-testing-strategy` |
| Deploy application | `10-deployment` |
| Optimize performance | `11-performance` |
| Generate documentation | `12-documentation` |

## Development Phases

### Phase 1: Foundation
1. Set up project structure
2. Configure database connection
3. Implement authentication (JWT + OAuth)
4. Create base models and schemas

### Phase 2: Core Features
1. Design and implement API endpoints
2. Build React pages and components
3. Connect frontend to backend
4. Add validation and error handling

### Phase 3: Production
1. Write comprehensive tests
2. Optimize performance
3. Set up Docker deployment
4. Add monitoring and logging

## Quick Start Commands
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Database
docker-compose up -d postgres
alembic upgrade head
```

## Environment Variables
```env
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback

# Frontend
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your-client-id
```
