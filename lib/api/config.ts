export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://147.93.28.223:3010";

export const ENDPOINTS = {
    auth: {
        login: () => "/api/auth/login",
        register: () => "/api/auth/register",
        registerRequestOtp: () => "/api/auth/register/request-otp",
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
    enrollments: {
        post: () => "/api/enrollments",           // POST: Create a new enrollment
        get: () => "/api/enrollments",            // GET: List all enrollments (Admin only)
        getMe: () => "/api/enrollments/me",       // GET: List my enrollments (authenticated user)
        getById: (id: string) => `/api/enrollments/${id}`, // GET: Get enrollment by ID
        markMaterialComplete: (enrollmentId: string) => `/api/enrollments/${enrollmentId}/completions/materials`, // POST: Mark material as complete
        markQuizComplete: (enrollmentId: string) => `/api/enrollments/${enrollmentId}/completions/quizzes`, // POST: Mark quiz as complete
    },
    promoCodes: {
        post: () => "/api/promo-codes",           // POST: Create a new promo code
        get: () => "/api/promo-codes",            // GET: List all promo codes
        getById: (id: string) => `/api/promo-codes/${id}`, // GET: Get promo code by ID
        update: (id: string) => `/api/promo-codes/${id}`,  // PUT: Update a promo code
        delete: (id: string) => `/api/promo-codes/${id}`,  // DELETE: Delete a promo code
    },
    certificates: {
        getById: (id: string) => `/api/certificates/${id}`, // GET: Get certificate by ID
        getByUser: (userId: string) => `/api/certificates/user/${userId}`, // GET: List certificates for a user
    },
    stats: {
        get: () => "/api/stats", // GET: Get admin dashboard statistics
    },
    sqaStudents: {
        get: () => "/api/sqa-students", // GET: List all SQA students
    },
    blogs: {
        post: () => "/api/cms/blogs", // POST: Create a new blog
        get: () => "/api/cms/blogs", // GET: List all blogs
        getById: (id: string) => `/api/cms/blogs/${id}`, // GET: Get blog by ID
        update: (id: string) => `/api/cms/blogs/${id}`, // PUT: Update blog by ID
        delete: (id: string) => `/api/cms/blogs/${id}`, // DELETE: Delete blog by ID
        getBySlug: (slug: string) => `/api/cms/blogs/slug/${slug}`, // GET: Get blog by slug
    },
}