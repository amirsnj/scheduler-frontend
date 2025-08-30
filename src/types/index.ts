// Base interfaces
export interface Tag {
  id: number;
  title: string;
}

export interface TaskList {
  id: number;
  title: string;
  task_count: number;
}

export interface SubTask {
  id: number;
  title: string;
  is_completed: boolean;
}

// 🔥 اصلاح SubTaskCreate - اضافه کردن id و is_completed
export interface SubTaskCreate {
  id?: number; // اختیاری برای زیرتسک‌های جدید
  title: string;
  is_completed?: boolean; // اختیاری، پیش‌فرض false
}

// Task interfaces
export interface Task {
  id: number;
  title: string;
  description: string;
  category?: number | null;
  priority_level: 'L' | 'M' | 'H';
  scheduled_date: string;
  dead_line?: string | null;
  is_completed: boolean;
  subTasks: SubTask[];
  tags: Tag[];
  updated_at: string;
}

// 🔥 اصلاح TaskCreate - اضافه کردن is_completed
export interface TaskCreate {
  title: string;
  description?: string;
  category?: number | null;
  priority_level?: 'L' | 'M' | 'H';
  scheduled_date?: string;
  dead_line?: string | null;
  is_completed?: boolean; // اضافه شده
  tags: number[];
  subTasks: SubTaskCreate[]; // حالا شامل id و is_completed
}

// Locale interface for translations
export interface Locale {
  [key: string]: string;
}