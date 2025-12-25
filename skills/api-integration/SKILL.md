# API Integration Skill

## Purpose
Connect React frontend to FastAPI backend with proper authentication, error handling, and data fetching.

## Axios Client Setup

```typescript
// services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(`${API_URL}/api/v1/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

## Auth Service

```typescript
// services/auth.ts
import api from './api';

interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

interface User {
  id: number;
  email: string;
  full_name: string | null;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthTokens> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post<AuthTokens>('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    this.setTokens(response.data);
    return response.data;
  },

  async register(email: string, password: string, fullName?: string): Promise<User> {
    const response = await api.post<User>('/auth/register', {
      email, password, full_name: fullName
    });
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/auth/me');
    return response.data;
  },

  setTokens(tokens: AuthTokens) {
    localStorage.setItem('access_token', tokens.access_token);
    localStorage.setItem('refresh_token', tokens.refresh_token);
  },

  clearTokens() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  googleLogin() {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/google`;
  },

  logout() {
    this.clearTokens();
    window.location.href = '/login';
  }
};
```

## Resource Services

```typescript
// services/posts.ts
import api from './api';
import { Post, PaginatedResponse } from '../types';

export const postService = {
  async getAll(page = 1, perPage = 10): Promise<PaginatedResponse<Post>> {
    const response = await api.get('/posts', { params: { page, per_page: perPage } });
    return response.data;
  },

  async getById(id: number): Promise<Post> {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  async create(data: Partial<Post>): Promise<Post> {
    const response = await api.post('/posts', data);
    return response.data;
  },

  async update(id: number, data: Partial<Post>): Promise<Post> {
    const response = await api.patch(`/posts/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/posts/${id}`);
  }
};
```

## React Query Integration

```typescript
// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/posts';
import { Post } from '../types';

export function usePosts(page = 1) {
  return useQuery({
    queryKey: ['posts', page],
    queryFn: () => postService.getAll(page),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Post>) => postService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Post> }) =>
      postService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => postService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
```

## Usage in Components

```typescript
// pages/PostsPage.tsx
import { usePosts, useDeletePost } from '../hooks/usePosts';

export function PostsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = usePosts(page);
  const deletePost = useDeletePost();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      {data?.items.map(post => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <button onClick={() => deletePost.mutate(post.id)}>Delete</button>
        </div>
      ))}
      
      <div>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page} of {data?.pages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page === data?.pages}>
          Next
        </button>
      </div>
    </div>
  );
}
```

## Best Practices
- Use axios interceptors for auth
- Implement token refresh automatically
- Use React Query for server state
- Create service modules per resource
- Handle loading and error states
- Invalidate cache after mutations
