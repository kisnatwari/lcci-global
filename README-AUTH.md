# Authentication System Documentation

## Overview

This project uses an encrypted session-based authentication system similar to Auth.js patterns. All tokens and user data are encrypted before storage in cookies.

## Architecture

```
┌─────────────┐
│   Login     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Encrypt Session │ (tokens + role + userId)
└──────┬──────────┘
       │
       ▼
┌──────────────┐
│ Store Cookie │ (auth.session)
└──────┬───────┘
       │
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Proxy    │   │ API     │   │ Server  │
│ (Route   │   │ Client  │   │ Auth    │
│ Protect) │   │         │   │         │
└──────────┘   └──────────┘   └──────────┘
```

## File Structure

```
lib/
├── auth/
│   ├── index.ts              # Main exports (use this for imports)
│   ├── session.ts            # Session data structure & encryption
│   ├── cookies.ts            # Cookie management (client & server)
│   ├── token.ts              # JWT validation
│   ├── simple-encrypt.ts     # Cross-platform encryption
│   ├── server-auth.ts        # Server-side auth helpers
│   ├── logout.ts             # Logout functionality
│   └── README.md             # Detailed auth docs
│
├── api/
│   ├── index.ts              # Main exports (use this for imports)
│   ├── config.ts             # API endpoints configuration
│   ├── client.ts              # Client-side API client
│   ├── server-client.ts       # Server-side API client
│   ├── profile.ts             # Profile API functions
│   └── README.md              # API usage docs
│
proxy.ts                       # Route protection (Next.js 16)
```

## Quick Start

### 1. Environment Variables

Create `.env.local`:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://your-api-url

# Encryption Key (32+ characters, keep secret!)
ENCRYPTION_KEY=your-32-character-secret-key-here!!

# JWT Secret (from backend, for token validation)
JWT_SECRET=your-jwt-secret-from-backend
```

### 2. Login

```typescript
import { setAuthSession } from '@/lib/auth';

// After successful login API call
setAuthSession(
  response.data.accessToken,
  response.data.refreshToken,
  'admin',  // role
  userId    // optional
);
```

### 3. Protect Routes

Routes are automatically protected by `proxy.ts` for `/admin/*` paths.

For Server Components:
```typescript
import { requireAuth, requireRole } from '@/lib/auth';

// Require any authenticated user
const session = await requireAuth();

// Require specific role
const session = await requireRole('admin');
```

### 4. Make API Calls

**Client-side:**
```typescript
import { apiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api';

const data = await apiClient.get(ENDPOINTS.categories.get());
```

**Server-side:**
```typescript
import { getServerApiClient } from '@/lib/api';
import { ENDPOINTS } from '@/lib/api';

const client = await getServerApiClient();
const profile = await client.get(ENDPOINTS.profile.get());
```

### 5. Get User Profile

```typescript
import { getProfile, getServerProfile } from '@/lib/api';

// Client-side
const profile = await getProfile();

// Server-side
const profile = await getServerProfile();
```

### 6. Logout

```typescript
import { logout } from '@/lib/auth';

await logout();
// Note: No automatic redirect - handle navigation in component
```

## Session Data Structure

```typescript
{
  accessToken: string;    // JWT access token
  refreshToken: string;   // JWT refresh token
  role: string;           // User role (admin, learner, etc.)
  userId?: string;       // User ID (extracted from token)
  expiresAt?: number;     // Session expiration timestamp
}
```

## Security Features

✅ **Encrypted Storage** - Tokens encrypted before storing in cookies  
✅ **Single Cookie** - All session data in one encrypted cookie  
✅ **Role-Based Access** - Role stored in session for quick checks  
✅ **Token Validation** - JWT signature verification (when secret set)  
✅ **Expiration Checks** - Both token and session expiration validated  
✅ **Route Protection** - Automatic protection via proxy.ts  

## Common Patterns

### Check if User is Authenticated
```typescript
import { getAuthSession } from '@/lib/auth';

const session = getAuthSession();
if (session) {
  // User is logged in
}
```

### Get User Role
```typescript
import { getUserRole } from '@/lib/auth';

const role = getUserRole();
if (role === 'admin') {
  // User is admin
}
```

### Server-Side Auth Check
```typescript
import { getServerSession } from '@/lib/auth/server-auth';

const session = await getServerSession();
if (!session) {
  redirect('/login');
}
```

## Troubleshooting

### "JWT signature verification failed"
- Set `JWT_SECRET` in `.env.local` matching your backend secret
- Or system will use unverified decode (less secure)

### "ENCRYPTION_KEY not set"
- Set `ENCRYPTION_KEY` in `.env.local` (32+ characters)
- Required for encrypting session data

### Session not persisting
- Check cookie settings (secure, sameSite)
- Verify encryption/decryption is working
- Check browser console for errors

## Migration Notes

- **Old**: `middleware.ts` → **New**: `proxy.ts` (Next.js 16)
- **Old**: Separate cookies for tokens → **New**: Single encrypted session cookie
- **Old**: localStorage tokens → **New**: Encrypted cookie only (localStorage kept for compatibility)

