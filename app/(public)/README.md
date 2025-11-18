# Public Pages Route Group

This folder contains all public-facing website pages.

## Structure

- `(public)/page.tsx` - Homepage (`/`)
- `(public)/about/page.tsx` - About page (`/about`)
- `(public)/contact-us/page.tsx` - Contact page (`/contact-us`)
- `(public)/courses/page.tsx` - Courses page (`/courses`)

## URL Structure

The route group name `(public)` does NOT appear in the URL.

Examples:
- `app/(public)/page.tsx` → `/`
- `app/(public)/about/page.tsx` → `/about`
- `app/(public)/contact-us/page.tsx` → `/contact-us`

## Components

Homepage sections are located in `app/_homepage/` (shared across the site).

