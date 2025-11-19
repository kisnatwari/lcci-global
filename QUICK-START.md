# Quick Start Guide

## 🚀 Getting Started

### 1. Environment Setup

Create `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://147.93.28.223:3010

# Encryption Key (32+ characters, keep secret!)
ENCRYPTION_KEY=your-32-character-secret-key-here!!

# JWT Secret (from backend, for token validation)
JWT_SECRET=your-jwt-secret-from-backend
```

### 2. Import Patterns

**✅ Use index files for clean imports:**
```typescript
// Auth
import { setAuthSession, getAuthSession, logout, getUserRole } from '@/lib/auth';

// API
import { apiClient, ENDPOINTS, getProfile } from '@/lib/api';

// Server Auth
import { getServerSession, requireRole } from '@/lib/auth/server-auth';
```

### 3. Common Operations

#### Login
```typescript
import { setAuthSession } from '@/lib/auth';
import { apiClient, ENDPOINTS } from '@/lib/api';

const response = await apiClient.post(ENDPOINTS.auth.login(), formData);
setAuthSession(
  response.data.accessToken,
  response.data.refreshToken,
  'admin',
  userId
);
```

#### Check Auth (Client)
```typescript
import { getAuthSession, getUserRole } from '@/lib/auth';

const session = getAuthSession();
const role = getUserRole();
```

#### Check Auth (Server)
```typescript
import { requireAuth, requireRole } from '@/lib/auth/server-auth';

// Require any auth
const session = await requireAuth();

// Require specific role
const session = await requireRole('admin');
```

#### API Call (Client)
```typescript
import { apiClient, ENDPOINTS } from '@/lib/api';

const data = await apiClient.get(ENDPOINTS.categories.get());
```

#### API Call (Server)
```typescript
import { getServerApiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api';

const client = await getServerApiClient();
const profile = await client.get(ENDPOINTS.profile.get());
```

#### Logout
```typescript
import { logout } from '@/lib/auth';

await logout();
// Handle navigation in your component
```

## 📁 Key Files

- **`proxy.ts`** - Route protection (Next.js 16)
- **`lib/auth/index.ts`** - Auth exports (use this!)
- **`lib/api/index.ts`** - API exports (use this!)
- **`README-AUTH.md`** - Complete auth documentation
- **`CODE-STRUCTURE.md`** - Codebase organization guide

## 🔒 Security

- Tokens are **encrypted** before storage
- Single **encrypted cookie** stores all session data
- **Role-based** access control
- **Token validation** (when JWT_SECRET set)

## 📝 Notes

- Logout doesn't redirect automatically (test first)
- Profile API endpoint: `/api/profile`
- Routes protected: `/admin/*`
- Session expires: 7 days

