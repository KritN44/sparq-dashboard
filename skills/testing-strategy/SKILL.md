# Testing Strategy Skill

## Purpose
Implement comprehensive testing for FastAPI backend and React frontend.

## Backend Testing (pytest)

### Setup
```bash
pip install pytest pytest-asyncio pytest-cov httpx
```

### Conftest Fixtures

```python
# tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.auth.jwt import create_access_token

TEST_DATABASE_URL = "postgresql://test:test@localhost/test_db"
engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        yield db
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db):
    from app.models.user import User
    from app.auth.jwt import get_password_hash
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("testpassword"),
        full_name="Test User"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def auth_headers(test_user):
    token = create_access_token(data={"sub": str(test_user.id)})
    return {"Authorization": f"Bearer {token}"}
```

### API Tests

```python
# tests/test_users.py
from fastapi import status

class TestUserEndpoints:
    def test_get_users_unauthorized(self, client):
        response = client.get("/api/v1/users")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_users_authorized(self, client, auth_headers):
        response = client.get("/api/v1/users", headers=auth_headers)
        assert response.status_code == status.HTTP_200_OK

    def test_create_user(self, client):
        response = client.post("/api/v1/auth/register", json={
            "email": "new@example.com",
            "password": "securepassword123"
        })
        assert response.status_code == status.HTTP_201_CREATED
        assert response.json()["email"] == "new@example.com"

    def test_create_user_duplicate(self, client, test_user):
        response = client.post("/api/v1/auth/register", json={
            "email": test_user.email,
            "password": "password123"
        })
        assert response.status_code == status.HTTP_400_BAD_REQUEST
```

### Service Tests

```python
# tests/test_user_service.py
import pytest
from app.services import user_service
from app.exceptions import NotFoundError

def test_get_user_exists(db, test_user):
    user = user_service.get_user(db, test_user.id)
    assert user.email == test_user.email

def test_get_user_not_found(db):
    with pytest.raises(NotFoundError):
        user_service.get_user(db, 99999)
```

## Frontend Testing (Vitest)

### Setup
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event msw
```

### Mock Service Worker

```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/v1/auth/me', (req, res, ctx) => {
    return res(ctx.json({ id: 1, email: 'test@example.com' }));
  }),
  
  rest.post('/api/v1/auth/login', (req, res, ctx) => {
    return res(ctx.json({
      access_token: 'mock_token',
      refresh_token: 'mock_refresh'
    }));
  }),
];

// src/test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';
export const server = setupServer(...handlers);
```

### Component Tests

```typescript
// src/components/__tests__/LoginForm.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '../forms/LoginForm';

describe('LoginForm', () => {
  it('renders inputs', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits with valid data', async () => {
    const user = userEvent.setup();
    render(<LoginForm />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });
});
```

### Hook Tests

```typescript
// src/hooks/__tests__/usePosts.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePosts } from '../usePosts';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

test('fetches posts', async () => {
  const { result } = renderHook(() => usePosts(1), { wrapper });
  await waitFor(() => expect(result.current.isSuccess).toBe(true));
});
```

## Running Tests

```bash
# Backend
pytest                    # Run all
pytest -v                 # Verbose
pytest --cov=app         # Coverage

# Frontend
npm test                  # Run tests
npm run test:coverage    # With coverage
```

## Best Practices
- Use fixtures for test data
- Test success and error cases
- Mock external dependencies
- Maintain 80%+ coverage
- Clean up between tests
