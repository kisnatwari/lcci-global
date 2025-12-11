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
        batch: (courseId: string) => `/api/courses/${courseId}/quizzes/batch`,  // POST: Bulk upload quizzes
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
        get: (params?: {
            limit?: number;
            offset?: number;
            sortBy?: string;
            sortOrder?: "asc" | "desc";
            search?: string;
            userId?: string;
            courseId?: string;
            status?: "enrolled" | "completed" | "cancelled";
        }) => {
            const queryParams = new URLSearchParams();
            if (params?.limit) queryParams.append('limit', params.limit.toString());
            if (params?.offset) queryParams.append('offset', params.offset.toString());
            if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
            if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
            if (params?.search) queryParams.append('search', params.search);
            if (params?.userId) queryParams.append('userId', params.userId);
            if (params?.courseId) queryParams.append('courseId', params.courseId);
            if (params?.status) queryParams.append('status', params.status);
            const query = queryParams.toString();
            return `/api/enrollments${query ? `?${query}` : ''}`;
        },
        getByCourse: (courseId: string) => `/api/enrollments/${courseId}`, // GET: Get enrollments by course ID
        getMe: () => "/api/enrollments/me",       // GET: List my enrollments (authenticated user)
        getById: (id: string) => `/api/enrollments/${id}`, // GET: Get enrollment by ID
        markMaterialComplete: (enrollmentId: string) => `/api/enrollments/${enrollmentId}/completions/materials`, // POST: Mark material as complete
        markQuizComplete: (enrollmentId: string) => `/api/enrollments/${enrollmentId}/completions/quizzes`, // POST: Mark quiz as complete
        updateLastAccessed: () => "/api/enrollments/last-accessed", // POST: Update last accessed time for a course
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
        getByCourse: (courseId: string) => `/api/certificates/course/${courseId}`, // GET: Get certificate by course ID
    },
    stats: {
        get: () => "/api/stats", // GET: Get admin dashboard statistics
    },
    sqaStudents: {
        get: (page?: number, limit?: number, search?: string) => {
            const params = new URLSearchParams();
            if (page) params.append('page', page.toString());
            if (limit) params.append('limit', limit.toString());
            if (search && search.trim()) params.append('search', search.trim());
            const query = params.toString();
            return `/api/sqa-students${query ? `?${query}` : ''}`;
        },
    },
    blogs: {
        post: () => "/api/cms/blogs", // POST: Create a new blog
        get: () => "/api/cms/blogs", // GET: List all blogs
        getById: (id: string) => `/api/cms/blogs/${id}`, // GET: Get blog by ID
        update: (id: string) => `/api/cms/blogs/${id}`, // PUT: Update blog by ID
        delete: (id: string) => `/api/cms/blogs/${id}`, // DELETE: Delete blog by ID
        getBySlug: (slug: string) => `/api/cms/blogs/slug/${slug}`, // GET: Get blog by slug
    },
    faqs: {
        post: () => "/api/cms/faqs", // POST: Create a new FAQ
        get: () => "/api/cms/faqs", // GET: List all FAQs
        getById: (id: string) => `/api/cms/faqs/${id}`, // GET: Get FAQ by ID
        update: (id: string) => `/api/cms/faqs/${id}`, // PUT: Update FAQ by ID
        delete: (id: string) => `/api/cms/faqs/${id}`, // DELETE: Delete FAQ by ID
    },
}