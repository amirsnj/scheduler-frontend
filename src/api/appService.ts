import type { AxiosResponse } from "axios";
import type { SubTask, Tag, Task, TaskCreate, TaskList } from "@/types";
import apiClient from "./axios";

// ============= TYPE DEFINITIONS =============

export interface TaskUpdate {
  title?: string;
  description?: string;
  category?: number | null;
  priority_level?: "L" | "M" | "H";
  scheduled_date?: string;
  dead_line?: string | null;
  is_completed?: boolean;
}

// ============= TASK CATEGORY SERVICES =============

export const getTaskCategories = async (): Promise<
  AxiosResponse<TaskList[]>
> => {
  const response = await apiClient.get("/api/schedule/categories/");
  return response;
};

export const createTaskCategory = async (data: {
  title: string;
}): Promise<AxiosResponse<TaskList>> => {
  const response = await apiClient.post("/api/schedule/categories/", data);
  return response;
};

export const updateTaskCategory = async (
  id: number,
  data: { title: string },
): Promise<AxiosResponse<TaskList>> => {
  const response = await apiClient.put(`/api/schedule/categories/${id}/`, data);
  return response;
};

export const deleteTaskCategory = async (
  id: number,
): Promise<AxiosResponse<void>> => {
  const response = await apiClient.delete(`/api/schedule/categories/${id}/`);
  return response;
};

export const getTaskCategory = async (
  id: number,
): Promise<AxiosResponse<TaskList>> => {
  const response = await apiClient.get(`/api/schedule/categories/${id}/`);
  return response;
};

// ============= TASK SERVICES =============

export const getTasks = async (params?: {
  scheduled_date?: string;
  category?: number;
  priority_level?: string;
  is_completed?: boolean;
  dead_line?: string;
}): Promise<AxiosResponse<Task[]>> => {
  const response = await apiClient.get("/api/schedule/tasks/", { params });
  return response;
};

export const createTask = async (
  data: TaskCreate,
): Promise<AxiosResponse<Task>> => {
  const response = await apiClient.post(
    "/api/schedule/tasks/full-create/",
    data,
  );
  return response;
};

export const getTask = async (id: number): Promise<AxiosResponse<Task>> => {
  const response = await apiClient.get(`/api/schedule/tasks/${id}/`);
  return response;
};

// export const updateTask = async (id: number, data: TaskUpdate): Promise<AxiosResponse<Task>> => {
//   const response = await apiClient.put(`/api/schedule/tasks/${id}/`, data)
//   return response
// }

export const partialUpdateTask = async (
  id: number,
  data: Partial<TaskUpdate>,
): Promise<AxiosResponse<Task>> => {
  const response = await apiClient.patch(`/api/schedule/tasks/${id}/`, data);
  return response;
};

export const deleteTask = async (id: number): Promise<AxiosResponse<void>> => {
  const response = await apiClient.delete(`/api/schedule/tasks/${id}/`);
  return response;
};

// ============= SUBTASK SERVICES =============

export const getSubTasks = async (
  taskId: number,
): Promise<AxiosResponse<SubTask[]>> => {
  const response = await apiClient.get(
    `/api/schedule/tasks/${taskId}/sub-tasks/`,
  );
  return response;
};

export const createSubTask = async (
  taskId: number,
  data: { title: string; is_completed?: boolean },
): Promise<AxiosResponse<SubTask>> => {
  const response = await apiClient.post(
    `/api/schedule/tasks/${taskId}/sub-tasks/`,
    data,
  );
  return response;
};

export const getSubTask = async (
  taskId: number,
  subTaskId: number,
): Promise<AxiosResponse<SubTask>> => {
  const response = await apiClient.get(
    `/api/schedule/tasks/${taskId}/sub-tasks/${subTaskId}/`,
  );
  return response;
};

export const updateSubTask = async (
  taskId: number,
  subTaskId: number,
  data: { title?: string; is_completed?: boolean },
): Promise<AxiosResponse<SubTask>> => {
  const response = await apiClient.put(
    `/api/schedule/tasks/${taskId}/sub-tasks/${subTaskId}/`,
    data,
  );
  return response;
};

export const partialUpdateSubTask = async (
  taskId: number,
  subTaskId: number,
  data: Partial<{ title: string; is_completed: boolean }>,
): Promise<AxiosResponse<SubTask>> => {
  const response = await apiClient.patch(
    `/api/schedule/tasks/${taskId}/sub-tasks/${subTaskId}/`,
    data,
  );
  return response;
};

export const deleteSubTask = async (
  taskId: number,
  subTaskId: number,
): Promise<AxiosResponse<void>> => {
  const response = await apiClient.delete(
    `/api/schedule/tasks/${taskId}/sub-tasks/${subTaskId}/`,
  );
  return response;
};

// ============= TAG SERVICES =============

export const getTags = async (): Promise<AxiosResponse<Tag[]>> => {
  const response = await apiClient.get("/api/schedule/tags/");
  return response;
};

export const createTag = async (data: {
  title: string;
}): Promise<AxiosResponse<Tag>> => {
  const response = await apiClient.post("/api/schedule/tags/", data);
  return response;
};

export const getTag = async (id: number): Promise<AxiosResponse<Tag>> => {
  const response = await apiClient.get(`/api/schedule/tags/${id}/`);
  return response;
};

export const updateTag = async (
  id: number,
  data: { title: string },
): Promise<AxiosResponse<Tag>> => {
  const response = await apiClient.put(`/api/schedule/tags/${id}/`, data);
  return response;
};

export const deleteTag = async (id: number): Promise<AxiosResponse<void>> => {
  const response = await apiClient.delete(`/api/schedule/tags/${id}/`);
  return response;
};

// Quick toggle functions
export const toggleTaskCompletion = async (
  taskId: number,
  currentStatus: boolean,
): Promise<AxiosResponse<Task>> => {
  return partialUpdateTask(taskId, { is_completed: !currentStatus });
};

export const toggleSubTaskCompletion = async (
  taskId: number,
  subTaskId: number,
  currentStatus: boolean,
): Promise<AxiosResponse<SubTask>> => {
  return partialUpdateSubTask(taskId, subTaskId, {
    is_completed: !currentStatus,
  });
};

// Batch operations
export const bulkUpdateTasks = async (
  taskIds: number[],
  updates: TaskUpdate,
): Promise<AxiosResponse<Task>[]> => {
  const promises = taskIds.map((id) => partialUpdateTask(id, updates));
  return Promise.all(promises);
};

export const bulkDeleteTasks = async (
  taskIds: number[],
): Promise<AxiosResponse<void>[]> => {
  const promises = taskIds.map((id) => deleteTask(id));
  return Promise.all(promises);
};

// Export the configured axios instance for custom requests
export { apiClient };

//clude
export const updateTask = async (taskId: number, taskData: any) => {
  const response = await apiClient.put(
    `/api/schedule/tasks/${taskId}/update/`,
    taskData,
  );
  return response;
};

// اگه تابع toggleTaskComplete وجود نداره، این رو هم اضافه کن
export const toggleTaskComplete = async (
  taskId: number,
  isCompleted: boolean,
) => {
  const response = await apiClient.patch(
    `/api/schedule/tasks/${taskId}/update/`,
    {
      is_completed: isCompleted,
    },
  );
  return response;
};
