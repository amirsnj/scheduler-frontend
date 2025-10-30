// ============= BASE INTERFACES =============

export interface Tag {
  id: number;
  title: string;
}

export interface TaskList {
  id: number;
  title: string;
  task_count?: number;
}

export interface SubTask {
  id: number;
  title: string;
  is_completed: boolean;
}

export interface SubTaskCreate {
  id?: number;
  title: string;
  is_completed?: boolean;
}

// ============= TASK INTERFACES =============

export interface Task {
  id: number;
  title: string;
  description: string;
  category?: number | null;
  priority_level: "L" | "M" | "H";
  scheduled_date: string;
  dead_line?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_completed: boolean;
  subTasks: SubTask[];
  tags: Tag[];
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  category?: number | null;
  priority_level?: "L" | "M" | "H";
  scheduled_date?: string;
  dead_line?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_completed?: boolean;
  tags: number[];
  subTasks: SubTaskCreate[];
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  category?: number | null;
  priority_level?: "L" | "M" | "H";
  scheduled_date?: string;
  dead_line?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_completed?: boolean;
  tags?: number[];
  subTasks?: SubTaskCreate[];
}

// ============= UTILITY INTERFACES =============

export interface Locale {
  [key: string]: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ============= CONSTANTS =============

export const PriorityLevel = {
  LOW: "L",
  MEDIUM: "M",
  HIGH: "H",
} as const;

export const TaskStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  OVERDUE: "overdue",
} as const;

export type PriorityLevelType =
  (typeof PriorityLevel)[keyof typeof PriorityLevel];
export type TaskStatusType = (typeof TaskStatus)[keyof typeof TaskStatus];

// ============= User Info =============

export interface IUserInfo {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}
