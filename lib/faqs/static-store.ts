/**
 * Static FAQ Store
 * 
 * This is a temporary static data store for FAQs.
 * Once the API is ready, replace this with API calls.
 * 
 * Structure matches expected API response:
 * {
 *   id: string;
 *   question: string;
 *   answer: string;
 *   orderIndex: number;
 *   isActive: boolean;
 *   createdAt: string;
 *   updatedAt: string;
 * }
 */

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "lcci_faqs";

// Default FAQs (initial data)
const defaultFAQs: FAQ[] = [
  {
    id: "1",
    question: "What qualifications does LCCI offer?",
    answer: "LCCI specialises in communication, leadership, customer experience and other soft-skills programmes. From executive communication labs to leadership presence accelerators and coaching certifications, our stackable pathways support learners throughout their professional journey.",
    orderIndex: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    question: "Are LCCI certificates recognized globally?",
    answer: "Yes, LCCI qualifications are recognized by employers, universities and professional bodies in over 100 countries. Our certificates have been trusted since 1887 and are valued for their practical, industry-relevant content that prepares learners for real-world challenges.",
    orderIndex: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    question: "What is the difference between guided and self-paced courses?",
    answer: "Guided programmes feature instructor-led sessions with fixed schedules, regular assessments and cohort-based learning—ideal for schools and training centers. Self-paced courses allow you to learn on your own timeline with access to all materials and support resources—perfect for working professionals balancing multiple commitments.",
    orderIndex: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    question: "How can my institution partner with LCCI?",
    answer: "We welcome partnerships with schools, colleges and training providers worldwide. Contact our team to learn about centre approval, programme delivery models, tutor training, marketing support and how we can help you enhance your academic portfolio with internationally-recognized qualifications.",
    orderIndex: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    question: "What support is available for learners?",
    answer: "All learners receive access to comprehensive study materials, online resources and expert support throughout their programme. Guided course students benefit from live instructor sessions, while self-paced learners can reach our support team via email. We're committed to helping every learner succeed.",
    orderIndex: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Get all FAQs from localStorage or return defaults
 */
export function getFAQs(): FAQ[] {
  if (typeof window === "undefined") {
    // Server-side: return defaults
    return defaultFAQs;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : defaultFAQs;
    }
  } catch (error) {
    console.error("Failed to load FAQs from localStorage:", error);
  }

  // Initialize with defaults if not found
  setFAQs(defaultFAQs);
  return defaultFAQs;
}

/**
 * Save FAQs to localStorage
 */
export function setFAQs(faqs: FAQ[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(faqs));
  } catch (error) {
    console.error("Failed to save FAQs to localStorage:", error);
  }
}

/**
 * Get a single FAQ by ID
 */
export function getFAQById(id: string): FAQ | null {
  const faqs = getFAQs();
  return faqs.find((faq) => faq.id === id) || null;
}

/**
 * Create a new FAQ
 */
export function createFAQ(faq: Omit<FAQ, "id" | "createdAt" | "updatedAt">): FAQ {
  const faqs = getFAQs();
  const newFAQ: FAQ = {
    ...faq,
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  faqs.push(newFAQ);
  setFAQs(faqs);
  return newFAQ;
}

/**
 * Update an existing FAQ
 */
export function updateFAQ(id: string, updates: Partial<Omit<FAQ, "id" | "createdAt">>): FAQ | null {
  const faqs = getFAQs();
  const index = faqs.findIndex((faq) => faq.id === id);
  
  if (index === -1) return null;
  
  faqs[index] = {
    ...faqs[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  setFAQs(faqs);
  return faqs[index];
}

/**
 * Delete an FAQ
 */
export function deleteFAQ(id: string): boolean {
  const faqs = getFAQs();
  const filtered = faqs.filter((faq) => faq.id !== id);
  
  if (filtered.length === faqs.length) return false;
  
  setFAQs(filtered);
  return true;
}

/**
 * Get active FAQs sorted by orderIndex (for public display)
 */
export function getActiveFAQs(): FAQ[] {
  return getFAQs()
    .filter((faq) => faq.isActive)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}

