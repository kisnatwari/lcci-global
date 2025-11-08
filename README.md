# LCCI Global - Course Showcase Website

A modern, developer-friendly Next.js 16 application for showcasing LCCI courses and qualifications.

## Project Structure

```
lcci-global/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage (/)
│   ├── courses/           # Courses listing page (/courses)
│   ├── about/             # About page (/about)
│   ├── contact-us/        # Contact page (/contact-us)
│   ├── login/             # Login page (/login)
│   └── dashboards/        # Dashboards section (to be implemented)
├── components/
│   └── website/           # Website-specific components
│       ├── Header.tsx     # Site header/navigation
│       ├── Footer.tsx     # Site footer
│       └── CourseCard.tsx # Course card component
├── data/
│   └── courses.json       # Course data (JSON)
├── lib/
│   └── courses.ts         # Course data utilities
├── types/
│   └── course.ts          # TypeScript types for courses
└── public/                # Static assets
```

## Features

### Pages
- **Homepage (/)**: Features hero section, featured courses, and course type information
- **Courses (/courses)**: Complete course listing with filtering by type (guided/self-paced)
- **About (/about)**: Information about LCCI, mission, values, and offerings
- **Contact Us (/contact-us)**: Contact form and information
- **Login (/login)**: Multiple login flows:
  - Regular B2C: Google login
  - Cambridge Students: School Name + School Code
  - SQA Students: SCN number
  - Admin: Email + Password

### Course Types
1. **Guided Courses**: Instructor-led courses for schools/colleges/corporate training
2. **Self-Paced Courses**: Materials provided by admin, accessible via student dashboard

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Tech Stack
- **Next.js 16**: React framework with App Router
- **React 19**: Latest React version
- **TypeScript**: Type safety
- **Tailwind CSS v4**: Styling
- **JSON Data**: Course data stored in JSON (no API calls needed for now)

## Data Structure

Courses are stored in `data/courses.json` with the following structure:

```typescript
{
  id: string;
  title: string;
  description: string;
  type: "guided" | "self-paced";
  category: string;
  duration: string;
  level: string;
  featured: boolean;
  image: string;
  instructor: string;
  price: string;
  format: string;
}
```

## Code Organization

- **Components**: Reusable UI components in `components/website/`
- **Utilities**: Helper functions in `lib/`
- **Types**: TypeScript definitions in `types/`
- **Data**: JSON data files in `data/`

## Future Enhancements

- Dashboard section (student/admin dashboards)
- API integration for course data
- User authentication
- Course enrollment functionality
- Payment integration
