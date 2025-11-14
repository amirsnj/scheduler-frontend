import type { AxiosResponse } from "axios";
import type { ISubTask, ITag, ITask, ITaskCreate, ITaskList, ITaskUpdate } from "@/types";
import apiClient from "./axios";

// ============= TYPE DEFINITIONS =============

export interface TaskUpdate {
  title?: string;
  description?: string;
  category?: number | null;
  priority_level?: "L" | "M" | "H";
  scheduled_date?: string;
  start_time?: string;
  end_time?: string;
  dead_line?: string | null;
  is_completed?: boolean;
}

// ============= TASK CATEGORY SERVICES =============

export const getTaskCategories = async (): Promise<
  AxiosResponse<ITaskList[]>
> => {
  const response = await apiClient.get("/api/schedule/categories/");
  return response;
};

export const createTaskCategory = async (data: Omit<ITaskList, 'id' | 'task_count'>): Promise<AxiosResponse<ITaskList>> => {
  const response = await apiClient.post("/api/schedule/categories/", data);
  return response;
};

export const updateTaskCategory = async (
  id: number,
  data: Omit<ITaskList, 'id' | 'task_count'>,
): Promise<AxiosResponse<ITaskList>> => {
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
): Promise<AxiosResponse<ITaskList>> => {
  const response = await apiClient.get(`/api/schedule/categories/${id}/`);
  return response;
};

// ============= TASK SERVICES =============

export const getTasksByDate = async (date: string): Promise<AxiosResponse<ITask[]>> => {
  try {
    const response = await apiClient.get(
      `/api/schedule/tasks/?category=&scheduled_date=${date}`,
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getTasks = async (params?: {
  scheduled_date?: string;
  category?: number;
  priority_level?: string;
  is_completed?: boolean;
  dead_line?: string;
}): Promise<AxiosResponse<ITask[]>> => {
  const response = await apiClient.get("/api/schedule/tasks/", { params });
  return response;
};

export const createTask = async (
  data: ITaskCreate,
): Promise<AxiosResponse<ITask>> => {
  console.log(data)
  const response = await apiClient.post(
    "/api/schedule/tasks/full-create/",
    data,
  );
  return response;
};

export const getTask = async (id: number): Promise<AxiosResponse<ITask>> => {
  const response = await apiClient.get(`/api/schedule/tasks/${id}/`);
  return response;
};

export const updateTask = async (id: number, data: Omit<ITaskCreate, 'tags' | 'subTasks'>): Promise<AxiosResponse<ITask>> => {
  const response = await apiClient.put(`/api/schedule/tasks/${id}/`, data)
  return response
}

export const partialUpdateTask = async (
  id: number,
  data: Partial<TaskUpdate>,
): Promise<AxiosResponse<ITask>> => {
  const response = await apiClient.patch(`/api/schedule/tasks/${id}/`, data);
  return response;
};

export const deleteTask = async (id: number): Promise<AxiosResponse<void>> => {
  const response = await apiClient.delete(`/api/schedule/tasks/${id}/`);
  return response;
};


export const partialUpdateSubTask = async (
  taskId: number,
  subTaskId: number,
  data: Partial<{ title: string; is_completed: boolean }>,
): Promise<AxiosResponse<ISubTask>> => {
  const response = await apiClient.patch(
    `/api/schedule/tasks/${taskId}/sub-tasks/${subTaskId}/`,
    data,
  );
  return response;
};

// ============= TAG SERVICES =============

export const getTags = async (): Promise<AxiosResponse<ITag[]>> => {
  const response = await apiClient.get("/api/schedule/tags/");
  return response;
};

export const createTag = async (data: Omit<ITag, 'id'>): Promise<AxiosResponse<ITag>> => {
  const response = await apiClient.post("/api/schedule/tags/", data);
  return response;
};

export const getTag = async (id: number): Promise<AxiosResponse<ITag>> => {
  const response = await apiClient.get(`/api/schedule/tags/${id}/`);
  return response;
};

export const updateTagService = async (
  id: number,
  data: Omit<ITag, 'id'>,
): Promise<AxiosResponse<ITag>> => {
  const response = await apiClient.put(`/api/schedule/tags/${id}/`, data);
  return response;
};

export const deleteTagService = async (
  id: number,
): Promise<AxiosResponse<void>> => {
  const response = await apiClient.delete(`/api/schedule/tags/${id}/`);
  return response;
};

// Quick toggle functions
export const toggleTaskCompletion = async (
  taskId: number,
  currentStatus: boolean,
): Promise<AxiosResponse<ITask>> => {
  return partialUpdateTask(taskId, { is_completed: !currentStatus });
};

export const toggleSubTaskCompletion = async (
  taskId: number,
  subTaskId: number,
  currentStatus: boolean,
): Promise<AxiosResponse<ISubTask>> => {
  return partialUpdateSubTask(taskId, subTaskId, {
    is_completed: !currentStatus,
  });
};


// ============= TASK UPDATE SERVICES =============

export const fullUpdateTask = async (taskId: number, taskData: ITaskUpdate): Promise<AxiosResponse<ITask>> => {
  console.log(taskData)
  const response = await apiClient.put(
    `/api/schedule/tasks/${taskId}/update/`,
    taskData,
  );
  return response;
};

// export const toggleTaskComplete = async (
//   taskId: number,
//   isCompleted: boolean,
// ) => {
//   const response = await apiClient.patch(
//     `/api/schedule/tasks/${taskId}/update/`,
//     {
//       is_completed: isCompleted,
//     },
//   );
//   return response;
// };

// Export the configured axios instance for custom requests
export { apiClient };
