# Authentication System

This directory contains the authentication and session management system.

## Structure

### Core Files

- **`session.ts`** - Session data structure and encryption/decryption
- **`cookies.ts`** - Cookie management (client & server-side)
- **`token.ts`** - JWT token validation and parsing
- **`encryption.ts`** - Node.js encryption (server-side)
- **`simple-encrypt.ts`** - Cross-platform encryption (browser & server)
- **`server-auth.ts`** - Server-side authentication helpers
- **`logout.ts`** - Logout functionality

## How It Works

### 1. Login Flow
```
User logs in → API returns tokens → 
  → Encrypt tokens + role → Store in cookie → 
  → Redirect based on role
```

### 2. Session Storage
- **Format**: Encrypted JSON in single cookie (`auth.session`)
- **Content**: `{ accessToken, refreshToken, role, userId, expiresAt }`
- **Encryption**: XOR cipher + base64 (works in browser & Node.js)

### 3. Route Protection
- **Middleware/Proxy**: Checks encrypted session → Validates token → Checks role
- **Server Components**: Use `getServerSession()` from `server-auth.ts`

### 4. API Calls
- **Client**: `apiClient` automatically includes decrypted token
- **Server**: `getServerApiClient()` reads from encrypted session

## Usage Examples

### Client-Side
```typescript
import { getAuthSession, getUserRole } from '@/lib/auth/cookies';

const session = getAuthSession();
const role = getUserRole();
```

### Server-Side
```typescript
import { getServerSession } from '@/lib/auth/server-auth';

const session = await getServerSession();
if (!session) redirect('/login');
```

### Require Role
```typescript
import { requireRole } from '@/lib/auth/server-auth';

const session = await requireRole('admin');
```

## Environment Variables

- `ENCRYPTION_KEY` - Secret key for encrypting sessions (32+ chars)
- `JWT_SECRET` - Secret for validating JWT tokens (from backend)

