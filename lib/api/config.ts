export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://147.93.28.223:3010";

export const ENDPOINTS = {
    auth: {
        login: () => "/api/auth/login",
        refresh: () => "/api/auth/refresh",
        logout: () => "/api/auth/logout", // May or may not exist
    },
    profile: {
        get: () => "/api/profile",
    },
    categories: {
        post: () => "/api/categories",            // POST: Create a new category
        get: () => "/api/categories",              // GET: List all categories
        getById: (id: string) => `/api/categories/${id}`, // GET: Get category by ID
        update: (id: string) => `/api/categories/${id}`,  // PUT: Update a category
        delete: (id: string) => `/api/categories/${id}`,  // DELETE: Delete a category
    },
    courses: {
        post: () => "/api/courses",               // POST: Create a new course
        get: () => "/api/courses",                // GET: List all courses
        getById: (id: string) => `/api/courses/${id}`, // GET: Get course by ID
        update: (id: string) => `/api/courses/${id}`,  // PUT: Update a course
        delete: (id: string) => `/api/courses/${id}`,  // DELETE: Delete a course
    },
    trainingCentres: {
        post: () => "/api/training-centres",      // POST: Create a new training centre
        get: () => "/api/training-centres",       // GET: List all training centres
        getById: (id: string) => `/api/training-centres/${id}`, // GET: Get training centre by ID
        update: (id: string) => `/api/training-centres/${id}`,  // PUT: Update a training centre
        delete: (id: string) => `/api/training-centres/${id}`,  // DELETE: Delete a training centre
    },
}