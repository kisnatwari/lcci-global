export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://147.93.28.223:3010";

export const ENDPOINTS = {
    auth: {
        login: () => "/api/auth/login",
        register: () => "/api/auth/register",
        refresh: () => "/api/auth/refresh-token",
        logout: () => "/api/auth/logout", // May or may not exist
    },
    profile: {
        me: () => "/api/profile/me",
        all: () => "/api/profile",
        getById: (userId: string) => `/api/profile/${userId}`,
        update: () => "/api/profile",
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
    materials: {
        post: (courseId: string) => `/api/courses/${courseId}/materials`, // POST: Create a new material for a course
        get: () => "/api/materials",              // GET: List all materials
        getByCourse: (courseId: string) => `/api/courses/${courseId}/materials`, // GET: Materials by course
        getById: (courseId: string, materialId: string) => `/api/courses/${courseId}/materials/${materialId}`, // GET: Get material by ID
        update: (courseId: string, materialId: string) => `/api/courses/${courseId}/materials/${materialId}`,  // PUT: Update a material
        delete: (courseId: string, materialId: string) => `/api/courses/${courseId}/materials/${materialId}`,  // DELETE: Delete a material
    },
    quizzes: {
        post: (courseId: string) => `/api/courses/${courseId}/quizzes`, // POST: Create a new quiz for a course
        get: () => "/api/quizzes",                // GET: List all quizzes
        getByCourse: (courseId: string) => `/api/courses/${courseId}/quizzes`, // GET: Quizzes by course
        getById: (courseId: string, quizId: string) => `/api/courses/${courseId}/quizzes/${quizId}`, // GET: Get quiz by ID
        update: (courseId: string, quizId: string) => `/api/courses/${courseId}/quizzes/${quizId}`,  // PUT: Update a quiz
        delete: (courseId: string, quizId: string) => `/api/courses/${courseId}/quizzes/${quizId}`,  // DELETE: Delete a quiz
    },
    quizQuestions: {
        post: (quizId: string) => `/api/quizzes/${quizId}/questions`, // POST: Create a new question for a quiz
        get: () => "/api/quiz-questions",         // GET: List all questions
        getByQuiz: (quizId: string) => `/api/quizzes/${quizId}/questions`, // GET: Questions by quiz
        getById: (quizId: string, questionId: string) => `/api/quizzes/${quizId}/questions/${questionId}`, // GET: Get question by ID
        update: (quizId: string, questionId: string) => `/api/quizzes/${quizId}/questions/${questionId}`,  // PUT: Update a question
        delete: (quizId: string, questionId: string) => `/api/quizzes/${quizId}/questions/${questionId}`,  // DELETE: Delete a question
    },
    upload: {
        file: () => "/api/upload",
    },
}