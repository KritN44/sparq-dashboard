# Performance Skill

## Purpose
Optimize FastAPI backend and React frontend for speed and scalability.

## Database Optimization

### Avoid N+1 Queries
```python
from sqlalchemy.orm import joinedload, selectinload

# Bad - N+1 queries
posts = db.query(Post).all()
for post in posts:
    print(post.author.name)  # Each = 1 query

# Good - Eager loading
posts = db.query(Post).options(
    joinedload(Post.author),
    selectinload(Post.comments)
).all()
```

### Connection Pooling
```python
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=10,
    pool_timeout=30,
    pool_recycle=1800,
    pool_pre_ping=True,
)
```

### Indexes
```python
class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True)
    slug = Column(String, unique=True, index=True)
    author_id = Column(Integer, ForeignKey("users.id"), index=True)
    
    __table_args__ = (
        Index('ix_posts_author_created', 'author_id', 'created_at'),
    )
```

## Caching with Redis

```python
import redis
import json
from functools import wraps

redis_client = redis.Redis(host='localhost', port=6379)

def cache(ttl: int = 300):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{args}:{kwargs}"
            cached = redis_client.get(key)
            if cached:
                return json.loads(cached)
            result = await func(*args, **kwargs)
            redis_client.setex(key, ttl, json.dumps(result))
            return result
        return wrapper
    return decorator

@cache(ttl=600)
async def get_popular_posts(db, limit=10):
    return db.query(Post).order_by(Post.views.desc()).limit(limit).all()
```

## Background Tasks

```python
from fastapi import BackgroundTasks

@router.post("/users")
async def create_user(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = user_service.create_user(db, user)
    background_tasks.add_task(send_welcome_email, db_user.email)
    return db_user
```

## Response Compression

```python
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

## Pagination
```python
@router.get("/posts")
async def get_posts(page: int = 1, per_page: int = 20, db: Session = Depends(get_db)):
    offset = (page - 1) * per_page
    total = db.query(func.count(Post.id)).scalar()
    posts = db.query(Post).offset(offset).limit(per_page).all()
    return {"items": posts, "total": total, "page": page}
```

## Frontend: Code Splitting

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

## Frontend: React Query Caching

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,  // 5 minutes
      cacheTime: 30 * 60 * 1000, // 30 minutes
    },
  },
});
```

## Frontend: Memoization

```typescript
import { memo, useMemo, useCallback } from 'react';

const PostCard = memo(({ post }) => <div>{post.title}</div>);

function Dashboard({ data }) {
  const stats = useMemo(() => calculateStats(data), [data]);
  const handleClick = useCallback(() => { /* ... */ }, []);
  return <div>{stats}</div>;
}
```

## Frontend: Virtual Lists

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      {virtualizer.getVirtualItems().map(item => (
        <div key={item.key}>{items[item.index].title}</div>
      ))}
    </div>
  );
}
```

## Best Practices
- Use eager loading for relationships
- Configure connection pooling
- Implement Redis caching
- Use background tasks
- Enable compression
- Paginate all lists
- Code split routes
- Memoize components
- Use virtual lists
- Add database indexes
