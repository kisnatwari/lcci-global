# Codebase Structure Guide

## Overview

This document explains the organization and structure of the codebase to help you understand where everything is and how it works.

## Directory Structure

```
lcci-global/
├── app/                          # Next.js App Router
│   ├── (dashboards)/            # Dashboard routes (route group)
│   │   └── admin/               # Admin dashboard pages
│   ├── (public)/                # Public routes (route group)
│   │   ├── page.tsx             # Homepage
│   │   ├── about/               # About page
│   │   ├── courses/              # Courses page
│   │   ├── contact-us/          # Contact page
│   │   └── login/                # Login page
│   └── _homepage/               # Homepage sections (not routes)
│
├── components/
│   ├── ui/                      # Shadcn UI components
│   ├── website/                 # Public website components
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Footer
│   │   ├── LoginModal.tsx      # Login/Register modal
│   │   ├── PageHeader.tsx      # Subpage headers
│   │   └── ...                 # Other website components
│   └── dashboards/
│       └── admin/              # Admin dashboard components
│           ├── AdminSidebar.tsx
│           ├── AdminHeader.tsx
│           └── ...
│
├── lib/
│   ├── auth/                   # Authentication system
│   │   ├── index.ts            # Main exports (use this!)
│   │   ├── session.ts          # Session data & encryption
│   │   ├── cookies.ts          # Cookie management
│   │   ├── token.ts            # JWT validation
│   │   ├── simple-encrypt.ts   # Encryption utilities
│   │   ├── server-auth.ts      # Server-side auth helpers
│   │   ├── logout.ts           # Logout function
│   │   └── README.md           # Auth documentation
│   │
│   └── api/                    # API client system
│       ├── index.ts            # Main exports (use this!)
│       ├── config.ts           # API endpoints
│       ├── client.ts           # Client-side API client
│       ├── server-client.ts    # Server-side API client
│       ├── profile.ts          # Profile API functions
│       └── README.md           # API documentation
│
├── proxy.ts                    # Route protection (Next.js 16)
└── README-AUTH.md              # Complete auth system docs
```

## Key Concepts

### 1. Route Groups
- `(dashboards)` - Dashboard routes (doesn't affect URL)
- `(public)` - Public website routes (doesn't affect URL)

### 2. Authentication Flow

```
Login → Encrypt Session → Store Cookie → 
  → Proxy Checks → Validate Token → 
  → Allow/Deny Access
```

### 3. Session Storage
- **Location**: Encrypted cookie (`auth.session`)
- **Format**: JSON encrypted with XOR cipher
- **Content**: `{ accessToken, refreshToken, role, userId, expiresAt }`

### 4. API Calls
- **Client**: `apiClient` from `@/lib/api` (auto-includes token)
- **Server**: `getServerApiClient()` from `@/lib/api` (reads from cookie)

## Import Patterns

### ✅ Recommended (Clean Imports)
```typescript
// Auth functions
import { setAuthSession, getAuthSession, logout } from '@/lib/auth';

// API functions
import { apiClient, ENDPOINTS, getProfile } from '@/lib/api';

// Server auth
import { getServerSession, requireRole } from '@/lib/auth/server-auth';
```

### ❌ Avoid (Direct File Imports)
```typescript
// Don't do this
import { setAuthSession } from '@/lib/auth/cookies';
import { apiClient } from '@/lib/api/client';
```

## Common Tasks

### Add a New API Endpoint
1. Add to `lib/api/config.ts`:
```typescript
export const ENDPOINTS = {
  // ... existing
  newFeature: {
    get: () => "/api/new-feature",
    post: () => "/api/new-feature",
  },
};
```

2. Use it:
```typescript
import { apiClient, ENDPOINTS } from '@/lib/api';
const data = await apiClient.get(ENDPOINTS.newFeature.get());
```

### Protect a New Route
1. Add to `proxy.ts` matcher:
```typescript
export const config = {
  matcher: [
    '/admin/:path*',
    '/new-protected-route/:path*', // Add here
  ],
};
```

2. Add protection logic in `proxy.ts` function.

### Add Role-Based Redirect
Update `components/website/LoginModal.tsx` redirect logic:
```typescript
const role = selectedRole?.toLowerCase();
if (role === "newrole") {
  window.location.href = "/new-dashboard";
}
```

## File Responsibilities

| File | Purpose |
|------|---------|
| `proxy.ts` | Route protection (replaces middleware.ts) |
| `lib/auth/index.ts` | Auth system exports |
| `lib/api/index.ts` | API system exports |
| `lib/auth/session.ts` | Session encryption/decryption |
| `lib/auth/cookies.ts` | Cookie read/write operations |
| `lib/auth/token.ts` | JWT validation |
| `lib/api/client.ts` | Client-side API calls |
| `lib/api/server-client.ts` | Server-side API calls |

## Testing Checklist

- [ ] Login stores encrypted session
- [ ] Logout clears session (no redirect)
- [ ] `/admin` routes protected
- [ ] API calls include token
- [ ] Profile API works
- [ ] Role-based redirects work

## Environment Variables

Required in `.env.local`:
```env
ENCRYPTION_KEY=your-32-char-secret-key
JWT_SECRET=your-jwt-secret-from-backend
NEXT_PUBLIC_API_BASE_URL=your-api-url
```

## Next Steps

1. Test logout functionality
2. Test profile API endpoint
3. Verify all routes are protected
4. Test role-based redirects
5. Add more API endpoints as needed

