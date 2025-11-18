# LCCI Global - Project Structure

This document outlines the codebase organization for easy navigation and future development.

## Overview

The project is organized into two main sections:
1. **Public Website** - Marketing pages and public-facing content
2. **Dashboards** - Role-based dashboards (admin, student, etc.)

---

## Directory Structure

```
lcci-global/
├── app/                          # Next.js App Router
│   ├── _homepage/                # Homepage sections (components)
│   ├── about/                    # About page
│   ├── contact-us/               # Contact page
│   ├── courses/                  # Courses listing page
│   ├── (dashboards)/             # Route group (hidden from URL)
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── layout.tsx        # Admin layout wrapper
│   │   │   ├── page.tsx          # Admin dashboard home (/admin)
│   │   │   ├── learners/         # Admin subpages (/admin/learners)
│   │   │   ├── courses/          # Admin subpages (/admin/courses)
│   │   │   └── ...
│   │   └── student/              # Student dashboard (future)
│   │       ├── layout.tsx
│   │       ├── page.tsx          # (/student)
│   │       └── ...
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
│
├── components/
│   ├── dashboards/               # Dashboard-specific components
│   │   └── shared/               # Reusable dashboard components
│   │       ├── DashboardLayout.tsx
│   │       ├── DashboardSidebar.tsx
│   │       ├── DashboardHeader.tsx
│   │       ├── StatCard.tsx
│   │       └── QuickActionButton.tsx
│   └── website/                  # Public website components
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── LoginModal.tsx
│       ├── CourseCard.tsx
│       └── ...
│
├── lib/
│   ├── dashboards/               # Dashboard configurations
│   │   ├── admin/
│   │   │   └── config.ts         # Admin nav & settings
│   │   └── student/
│   │       └── config.ts         # Student nav & settings
│   └── courses.ts                # Course utilities
│
├── data/                         # Static data files
└── types/                        # TypeScript type definitions
```

---

## Key Principles

### 1. Separation of Concerns
- **Public pages** (`app/about`, `app/courses`, etc.) use website components
- **Dashboard pages** (`app/dashboards/*`) use dashboard components
- Shared utilities live in `lib/`

### 2. Reusability
- Dashboard components in `components/dashboards/shared/` are reusable
- Configuration files in `lib/dashboards/` centralize settings
- Each dashboard type can customize via config

### 3. Scalability
- Easy to add new dashboard types (e.g., `app/dashboards/instructor/`)
- Easy to add new subpages to existing dashboards
- Configuration-driven navigation makes changes simple

---

## Adding a New Dashboard Type

1. **Create config**: `lib/dashboards/[role]/config.ts`
   ```typescript
   export const roleSidebarConfig = { ... };
   export const roleHeaderConfig = { ... };
   ```

2. **Create layout**: `app/(dashboards)/[role]/layout.tsx`
   ```typescript
   "use client";
   import DashboardLayout from "@/components/dashboards/shared/DashboardLayout";
   import { roleSidebarConfig, roleHeaderConfig } from "@/lib/dashboards/[role]/config";
   
   export default function RoleLayout({ children }) {
     return (
       <DashboardLayout
         sidebarConfig={roleSidebarConfig}
         headerConfig={roleHeaderConfig}
       >
         {children}
       </DashboardLayout>
     );
   }
   ```

3. **Create pages**: `app/(dashboards)/[role]/page.tsx` and subpages

   **Note**: The `(dashboards)` route group is hidden from URLs. So:
   - File: `app/(dashboards)/admin/page.tsx` → URL: `/admin`
   - File: `app/(dashboards)/admin/learners/page.tsx` → URL: `/admin/learners`

---

## Adding a New Subpage

1. Create folder: `app/(dashboards)/[role]/[subpage]/`
2. Create `page.tsx` in that folder
3. Add navigation item to `lib/dashboards/[role]/config.ts` with correct URL

Example:
- Create `app/(dashboards)/admin/learners/page.tsx` → URL: `/admin/learners`
- Add to `adminSidebarConfig.navItems`:
  ```typescript
  {
    label: "Learners",
    href: "/admin/learners",  // Note: /admin, not /dashboards/admin
    icon: Users,
  }
  ```

---

## Component Organization

### Shared Dashboard Components
Located in `components/dashboards/shared/`:
- **DashboardLayout**: Main wrapper (handles sidebar + header)
- **DashboardSidebar**: Navigation sidebar (config-driven)
- **DashboardHeader**: Top header with search
- **StatCard**: Metric display card
- **QuickActionButton**: Quick action button

### Website Components
Located in `components/website/`:
- Public-facing components (Header, Footer, CourseCard, etc.)

---

## Configuration Files

### Dashboard Configs (`lib/dashboards/[role]/config.ts`)
- **sidebarConfig**: Navigation items, title, subtitle, icon
- **headerConfig**: Search placeholder, user info

### Benefits
- Single source of truth for navigation
- Easy to update without touching components
- Type-safe with TypeScript

---

## Best Practices

1. **Keep pages focused**: Each page should have a single responsibility
2. **Use shared components**: Don't duplicate dashboard UI code
3. **Update configs**: Add navigation items to config files, not hardcode
4. **Document changes**: Update README files when adding new patterns
5. **Type safety**: Use TypeScript types for all configs and props

---

## Future Enhancements

- [ ] Student dashboard implementation
- [ ] Instructor/trainer dashboard
- [ ] Partner institution dashboard
- [ ] API integration for dashboard data
- [ ] Authentication & authorization
- [ ] Role-based access control

---

## Questions?

Refer to the README files in:
- `app/dashboards/README.md` - Dashboard pages structure
- `components/dashboards/README.md` - Dashboard components
- `lib/dashboards/README.md` - Dashboard configurations

