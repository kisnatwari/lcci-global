# Dashboards Route Group

This folder contains all dashboard-related pages and layouts.

## Structure

- `(dashboards)/admin/` - Admin dashboard pages
- `(dashboards)/student/` - Student dashboard pages
- `(dashboards)/[other-roles]/` - Other role-specific dashboards

## URL Structure

The route group name `(dashboards)` does NOT appear in the URL.

Examples:
- `app/(dashboards)/admin/page.tsx` → `/admin`
- `app/(dashboards)/admin/categories/page.tsx` → `/admin/categories`
- `app/(dashboards)/student/page.tsx` → `/student`

## Layouts

Each dashboard role can have its own layout:
- `app/(dashboards)/admin/layout.tsx` - Admin-specific layout
- `app/(dashboards)/student/layout.tsx` - Student-specific layout

