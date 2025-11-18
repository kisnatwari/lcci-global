export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://147.93.28.223:3010";

export const ENDPOINTS = {
    categories: {
        post: () => "/categories",            // POST: Create a new category
        get: () => "/categories",              // GET: List all categories
        getById: (id: string) => `/categories/${id}`, // GET: Get category by ID
        update: (id: string) => `/categories/${id}`,  // PUT: Update a category
        delete: (id: string) => `/categories/${id}`,  // DELETE: Delete a category
    },
}