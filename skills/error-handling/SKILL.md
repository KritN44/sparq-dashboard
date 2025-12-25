# Error Handling Skill

## Purpose
Implement consistent error handling across FastAPI backend and React frontend.

## Custom Exceptions (Backend)

```python
# exceptions.py
from fastapi import status

class AppException(Exception):
    def __init__(self, message: str, code: str, status_code: int = 500, details: dict = None):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}

class NotFoundError(AppException):
    def __init__(self, resource: str, identifier):
        super().__init__(f"{resource} not found", "NOT_FOUND", 404, {"resource": resource})

class ValidationError(AppException):
    def __init__(self, message: str, errors: list = None):
        super().__init__(message, "VALIDATION_ERROR", 422, {"errors": errors or []})

class AuthenticationError(AppException):
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, "AUTH_ERROR", 401)

class AuthorizationError(AppException):
    def __init__(self, message: str = "Permission denied"):
        super().__init__(message, "FORBIDDEN", 403)

class ConflictError(AppException):
    def __init__(self, message: str):
        super().__init__(message, "CONFLICT", 409)
```

## Global Exception Handlers

```python
# main.py
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import logging

logger = logging.getLogger(__name__)

app = FastAPI()

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    logger.error(f"{exc.code}: {exc.message}", extra={"path": request.url.path})
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message, "code": exc.code, **exc.details}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = [{"loc": e["loc"], "msg": e["msg"]} for e in exc.errors()]
    return JSONResponse(
        status_code=422,
        content={"detail": "Validation error", "code": "VALIDATION_ERROR", "errors": errors}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred", "code": "INTERNAL_ERROR"}
    )
```

## Frontend Error Handler

```typescript
// utils/errorHandler.ts
import { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';

interface ApiError {
  detail: string;
  code: string;
  errors?: Array<{ loc: string[]; msg: string }>;
}

export const ERROR_MESSAGES: Record<string, string> = {
  NOT_FOUND: 'The requested resource was not found',
  AUTH_ERROR: 'Please sign in to continue',
  FORBIDDEN: 'You do not have permission for this action',
  VALIDATION_ERROR: 'Please check your input',
  CONFLICT: 'This item already exists',
  INTERNAL_ERROR: 'Something went wrong. Please try again.',
};

export function handleApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiError = error.response?.data as ApiError;
    const message = ERROR_MESSAGES[apiError?.code] || apiError?.detail || 'An error occurred';
    toast.error(message);
    return message;
  }
  toast.error('An unexpected error occurred');
  return 'An unexpected error occurred';
}

export function getFieldError(errors: ApiError['errors'], field: string): string | undefined {
  return errors?.find(e => e.loc.includes(field))?.msg;
}
```

## React Error Boundary

```typescript
// components/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught:', error, errorInfo);
    // Send to error tracking (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

## Usage in Service Layer

```python
# services/user_service.py
from app.exceptions import NotFoundError, ConflictError

def get_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User", user_id)
    return user

def create_user(db: Session, user_data: UserCreate) -> User:
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise ConflictError("Email already registered")
    # Create user...
```

## Best Practices
- Use custom exceptions for business errors
- Register global exception handlers
- Return consistent error format: {detail, code}
- Log errors with context
- Never expose internal errors
- Implement React Error Boundaries
