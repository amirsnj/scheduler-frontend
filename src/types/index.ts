// ============= BASE INTERFACES =============

export interface ITag {
  id: number;
  title: string;
}

export interface ITaskList {
  id: number;
  title: string;
  task_count?: number;
}

export interface ISubTask {
  id?: number;
  title: string;
  is_completed: boolean;
}

// ============= TASK INTERFACES =============

export interface ITask {
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
  updated_at: string;
  created_at: string;
  subTasks: ISubTask[];
  tags: ITag[];
}

export interface ITaskCreate {
  title: string;
  description?: string;
  category?: number | null;
  priority_level?: "L" | "M" | "H";
  scheduled_date?: string | null;
  dead_line?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_completed?: boolean | false;
  tags: number[];
  subTasks: ISubTask[];
}

export interface ITaskUpdate {
  title: string;
  description?: string;
  category?: number | null;
  priority_level?: "L" | "M" | "H";
  scheduled_date?: string | null;
  dead_line?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  is_completed?: boolean | false;
  tags: number[];
  subTasks: ISubTask[];
}

// ============= UTILITY INTERFACES =============

export interface ILocale {
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
