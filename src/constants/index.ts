// ============= API CONSTANTS =============

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/jwt/create/",
    REGISTER: "/api/auth/users/",
    REFRESH: "/api/auth/refresh/",
  },
  TASKS: {
    BASE: "/api/schedule/tasks/",
    CREATE: "/api/schedule/tasks/full-create/",
    UPDATE: (id: number) => `/api/schedule/tasks/${id}/update/`,
    DELETE: (id: number) => `/api/schedule/tasks/${id}/`,
    SUBTASKS: (taskId: number) => `/api/schedule/tasks/${taskId}/sub-tasks/`,
  },
  CATEGORIES: {
    BASE: "/api/schedule/categories/",
    UPDATE: (id: number) => `/api/schedule/categories/${id}/`,
    DELETE: (id: number) => `/api/schedule/categories/${id}/`,
  },
  TAGS: {
    BASE: "/api/schedule/tags/",
    UPDATE: (id: number) => `/api/schedule/tags/${id}/`,
    DELETE: (id: number) => `/api/schedule/tags/${id}/`,
  },
} as const;

// ============= APP CONSTANTS =============

export const APP_CONFIG = {
  API_TIMEOUT: 10000,
  NOTIFICATION_DURATION: 5000,
  DEBOUNCE_DELAY: 300,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;

// ============= ROUTE CONSTANTS =============

export const ROUTES = {
  HOME: "/",
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  SCHEDULER: {
    BASE: "/scheduler",
    TASKS: "/scheduler/tasks",
    CALENDAR: "/scheduler/tasks/calendar",
  },
} as const;

// ============= PRIORITY CONSTANTS =============

export const PRIORITY_LEVELS = {
  LOW: "L",
  MEDIUM: "M",
  HIGH: "H",
} as const;

export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.LOW]: "bg-green-500",
  [PRIORITY_LEVELS.MEDIUM]: "bg-yellow-500",
  [PRIORITY_LEVELS.HIGH]: "bg-red-500",
} as const;

// ============= DATE CONSTANTS =============

export const DATE_FORMATS = {
  API: "YYYY-MM-DD",
  DISPLAY: "MMM DD",
  FULL: "MMMM DD, YYYY",
} as const;

// ============= VALIDATION CONSTANTS =============

export const VALIDATION_RULES = {
  TASK_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 200,
  },
  TASK_DESCRIPTION: {
    MAX_LENGTH: 1000,
  },
  TAG_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 50,
  },
  LIST_TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 100,
  },
} as const;

