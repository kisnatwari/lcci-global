# API Client System

This directory contains API client utilities and endpoint configurations.

## Structure

- **`config.ts`** - API base URL and endpoint definitions
- **`client.ts`** - Client-side API client (includes auth tokens automatically)
- **`server-client.ts`** - Server-side API client (reads from encrypted session)
- **`profile.ts`** - Profile API functions

## Usage

### Client-Side API Calls
```typescript
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/config';

// GET request
const data = await apiClient.get(ENDPOINTS.categories.get());

// POST request
const result = await apiClient.post(ENDPOINTS.categories.post(), { name: 'New Category' });
```

### Server-Side API Calls
```typescript
import { getServerApiClient } from '@/lib/api/server-client';
import { ENDPOINTS } from '@/lib/api/config';

const client = await getServerApiClient();
const profile = await client.get(ENDPOINTS.profile.get());
```

### Profile API
```typescript
import { getProfile, getServerProfile } from '@/lib/api/profile';

// Client-side
const profile = await getProfile();

// Server-side
const profile = await getServerProfile();
```

## Endpoints

All endpoints are defined in `config.ts`. Add new endpoints there following the pattern:
```typescript
export const ENDPOINTS = {
  auth: {
    login: () => "/api/auth/login",
    refresh: () => "/api/auth/refresh",
  },
  profile: {
    get: () => "/api/profile",
  },
  // ... more endpoints
};
```

