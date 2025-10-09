import { defineStore, createPinia, setActivePinia } from "pinia";
import { ref, computed, readonly } from "vue";
import type { Tag, TaskList, SubTask, Task, TaskCreate } from "@/types";
import { locales } from "@/locales/schedulerLocales/index";
import { currentLanguage } from "@/main";
import {
  createTag,
  createTask,
  createTaskCategory,
  deleteTask,
  getTags,
  getTaskCategories,
  getTasks,
  updateTask as updateTaskAPI,
  toggleTaskComplete as toggleTaskAPI,
  getTasksByDate,
  updateTaskCategory,
  deleteTaskCategory,
  updateTagService,
  deleteTagService,
} from "@/api/appService";
import { useNotificationStore } from "./notificationStore";
import type { AxiosResponse } from "axios";

setActivePinia(createPinia());
const notificationStore = useNotificationStore();

export const useTaskStore = defineStore("task", () => {
  // State
  const tasks = ref<Task[]>([]);
  const taskLists = ref<TaskList[]>([]);
  const tags = ref<Tag[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const tasksByDate = ref<Map<string, Task[]>>(new Map());

  // Getters (Computed)
  const completedTasks = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) =>
        task.is_completed &&
        (task.scheduled_date === today || task.dead_line === today),
    );
  });

  const pendingTasks = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) =>
        !task.is_completed &&
        (task.scheduled_date === today || task.dead_line === today),
    );
  });

  const tasksByCategory = computed(() => (categoryId: number | null) => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) =>
        task.category === categoryId &&
        (task.scheduled_date === today || task.dead_line === today),
    );
  });

  const tasksByPriority = computed(() => (priority: "L" | "M" | "H") => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) =>
        task.priority_level === priority &&
        (task.scheduled_date === today || task.dead_line === today),
    );
  });

  const tasksByTag = computed(() => (tagId: number) => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) =>
        task.tags.some((tag) => tag.id === tagId) &&
        (task.scheduled_date === today || task.dead_line === today),
    );
  });

  const overdueTasks = computed(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    return tasks.value.filter(
      (task) =>
        task.dead_line &&
        new Date(task.dead_line) < now &&
        !task.is_completed &&
        (task.scheduled_date === today || task.dead_line === today),
    );
  });

  const todayTasks = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) =>
        task.scheduled_date === today ||
        (task.dead_line && task.dead_line === today),
    );
  });

  const upcomingTasks = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) => task.scheduled_date && task.scheduled_date > today,
    );
  });

  const taskStats = computed(() => ({
    total: tasks.value.length,
    completed: completedTasks.value.length,
    pending: pendingTasks.value.length,
    overdue: overdueTasks.value.length,
  }));

  const tasksForDate = computed(() => (date: string) => {
    return tasksByDate.value.get(date) || [];
  });

  // Task Actions
  const fetchTasks = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getTasks();
      tasks.value = Array.isArray(response.data)
        ? response.data
        : (response.data as any).task || [];
      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      tasksByDate.value.set(
        today,
        tasks.value.filter(
          (task: Task) =>
            task.scheduled_date === today ||
            (task.dead_line && task.dead_line === today),
        ),
      );
      tasksByDate.value.set(
        tomorrowStr,
        tasks.value.filter(
          (task: Task) =>
            task.scheduled_date === tomorrowStr ||
            (task.dead_line && task.dead_line === tomorrowStr),
        ),
      );
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorFetchingTasks ||
        "Error fetching tasks";
      console.error("Error fetching tasks:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchTasksByDate = async (date: string): Promise<void> => {
    if (tasksByDate.value.has(date)) {
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const response = await getTasksByDate(date);
      // const response = await getTasks({ scheduled_date: date });
      const fetchedTasks = Array.isArray(response.data)
        ? response.data
        : response.data.tasks || [];
      tasksByDate.value.set(date, fetchedTasks);
      tasks.value = [
        ...tasks.value.filter(
          (task) => task.scheduled_date !== date && task.dead_line !== date,
        ),
        ...fetchedTasks,
      ];
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorFetchingTasks ||
        "Error fetching tasks";
      console.error(`Error fetching tasks for date ${date}:`, err);
      notificationStore.showError(
        locales[currentLanguage.value].errorFetchingTasks ||
          "Error fetching tasks",
      );
    } finally {
      loading.value = false;
    }
  };

  const addTask = async (taskData: TaskCreate): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await createTask(taskData);
      tasks.value.push(response.data);
      if (
        taskData.scheduled_date &&
        tasksByDate.value.has(taskData.scheduled_date)
      ) {
        tasksByDate.value.get(taskData.scheduled_date)!.push(response.data);
      }
      if (taskData.dead_line && tasksByDate.value.has(taskData.dead_line)) {
        tasksByDate.value.get(taskData.dead_line)!.push(response.data);
      }
      updateTaskListCount(taskData.category);
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorCreatingTask ||
        "Error creating task";
      console.error("Error creating task:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateTask = async (
    taskId: number,
    updates: Partial<Task>,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const updateData = {
        title: updates.title,
        description: updates.description,
        category: updates.category,
        priority_level: updates.priority_level,
        scheduled_date: updates.scheduled_date,
        dead_line: updates.dead_line,
        is_completed: updates.is_completed,
        tags: updates.tags?.map((tag) => tag.id) || [],
        subTasks:
          updates.subTasks?.map((st) => ({
            title: st.title,
            is_completed: st.is_completed,
          })) || [],
      };

      const response = await updateTaskAPI(taskId, updateData);
      const taskIndex = tasks.value.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) throw new Error("Task not found");

      const oldCategory = tasks.value[taskIndex].category;
      const oldScheduledDate = tasks.value[taskIndex].scheduled_date;
      const oldDeadline = tasks.value[taskIndex].dead_line;

      tasks.value[taskIndex] = {
        ...response.data,
        updated_at: new Date().toISOString(),
      };

      if (oldScheduledDate && tasksByDate.value.has(oldScheduledDate)) {
        tasksByDate.value.set(
          oldScheduledDate,
          tasksByDate.value
            .get(oldScheduledDate)!
            .filter((task) => task.id !== taskId),
        );
      }
      if (oldDeadline && tasksByDate.value.has(oldDeadline)) {
        tasksByDate.value.set(
          oldDeadline,
          tasksByDate.value
            .get(oldDeadline)!
            .filter((task) => task.id !== taskId),
        );
      }
      if (
        updates.scheduled_date &&
        tasksByDate.value.has(updates.scheduled_date)
      ) {
        tasksByDate.value.get(updates.scheduled_date)!.push(response.data);
      }
      if (updates.dead_line && tasksByDate.value.has(updates.dead_line)) {
        tasksByDate.value.get(updates.dead_line)!.push(response.data);
      }

      if (oldCategory !== updates.category) {
        updateTaskListCount(oldCategory);
        updateTaskListCount(updates.category);
      }
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorUpdatingTask ||
        "Error updating task";
      console.error("Error updating task:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const removeTask = async (taskId: number): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      await deleteTask(taskId);
      const taskIndex = tasks.value.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) throw new Error("Task not found");

      const categoryId = tasks.value[taskIndex].category;
      const scheduledDate = tasks.value[taskIndex].scheduled_date;
      const deadline = tasks.value[taskIndex].dead_line;

      tasks.value.splice(taskIndex, 1);

      if (scheduledDate && tasksByDate.value.has(scheduledDate)) {
        tasksByDate.value.set(
          scheduledDate,
          tasksByDate.value
            .get(scheduledDate)!
            .filter((task) => task.id !== taskId),
        );
      }
      if (deadline && tasksByDate.value.has(deadline)) {
        tasksByDate.value.set(
          deadline,
          tasksByDate.value.get(deadline)!.filter((task) => task.id !== taskId),
        );
      }

      updateTaskListCount(categoryId);
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorDeletingTask ||
        "Error deleting task";
      console.error("Error deleting task:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const toggleTaskComplete = async (taskId: number): Promise<void> => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      try {
        const newCompletionStatus = !task.is_completed;
        await toggleTaskAPI(taskId, newCompletionStatus);
        task.is_completed = newCompletionStatus;
        task.updated_at = new Date().toISOString();
      } catch (err) {
        error.value =
          locales[currentLanguage.value].errorUpdatingTask ||
          "Error updating task";
        console.error("Error toggling task completion:", err);
        throw err;
      }
    }
  };

  // SubTask Actions
  const addSubTask = async (
    taskId: number,
    subTaskData: Omit<SubTask, "id">,
  ): Promise<void> => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      const newSubTask: SubTask = {
        ...subTaskData,
        id: Date.now(),
      };
      task.subTasks.push(newSubTask);
      await updateTask(taskId, { subTasks: task.subTasks });
    }
  };

  const updateSubTask = async (
    taskId: number,
    subTaskId: number,
    updates: Partial<SubTask>,
  ): Promise<void> => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      const subTaskIndex = task.subTasks.findIndex((st) => st.id === subTaskId);
      if (subTaskIndex !== -1) {
        task.subTasks[subTaskIndex] = {
          ...task.subTasks[subTaskIndex],
          ...updates,
        };
        await updateTask(taskId, { subTasks: task.subTasks });
      }
    }
  };

  const deleteSubTask = async (
    taskId: number,
    subTaskId: number,
  ): Promise<void> => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      task.subTasks = task.subTasks.filter((st) => st.id !== subTaskId);
      await updateTask(taskId, { subTasks: task.subTasks });
    }
  };

  const toggleSubTaskComplete = async (
    taskId: number,
    subTaskId: number,
  ): Promise<void> => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      const subTask = task.subTasks.find((st) => st.id === subTaskId);
      if (subTask) {
        await updateSubTask(taskId, subTaskId, {
          is_completed: !subTask.is_completed,
        });
      }
    }
  };

  // TaskList Actions
  const fetchTaskLists = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getTaskCategories();
      taskLists.value = response.data;
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorFetchingLists ||
        "Error fetching task lists";
      console.error("Error fetching task lists:", err);
    } finally {
      loading.value = false;
    }
  };

  const addTaskList = async (
    listData: Omit<TaskList, "id" | "task_count">,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await createTaskCategory(listData);
      taskLists.value.push(response.data);
    } catch (err) {
      if ((err as any).status == 400) {
        notificationStore.showError(
          locales[currentLanguage.value].TheListIsAlreadyExists,
        );
      } else {
        notificationStore.showError(
          locales[currentLanguage.value].errorCreatingList,
        );
      }
    } finally {
      loading.value = false;
    }
  };

  const updateTaskList = async (
    listId: number,
    updates: Omit<TaskList, "id">,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await updateTaskCategory(listId, updates);

      const listIndex = taskLists.value.findIndex((list) => list.id === listId);
      if (listIndex === -1) throw new Error("List not found");
      taskLists.value[listIndex] = {
        ...response.data,
      };
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorUpdatingList ||
        "Error updating task list";
      console.error("Error updating task list:", err);
    } finally {
      loading.value = false;
    }
  };

  const deleteTaskList = async (listId: number): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      await deleteTaskCategory(listId);

      taskLists.value = taskLists.value.filter((list) => list.id !== listId);

      tasks.value = tasks.value.map((task) =>
        task.category === listId ? { ...task, category: null } : task,
      );

      tasksByDate.value.forEach((tasks, date) => {
        tasksByDate.value.set(
          date,
          tasks.map((task) =>
            task.category === listId ? { ...task, category: null } : task,
          ),
        );
      });
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorDeletingList ||
        "Error deleting task list";
      console.error("Error deleting task list:", err);
    } finally {
      loading.value = false;
    }
  };

  const updateTaskListCount = (categoryId: number | null | undefined): void => {
    if (categoryId) {
      const list = taskLists.value.find((l) => l.id === categoryId);
      if (list) {
        const today = new Date().toISOString().split("T")[0];
        list.task_count = tasks.value.filter(
          (t) =>
            t.category === categoryId &&
            (t.scheduled_date === today || t.dead_line === today),
        ).length;
      }
    }
  };

  // Tag Actions
  const fetchTags = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getTags();
      tags.value = response.data;
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorFetchingTags ||
        "Error fetching tags";
      console.error("Error fetching tags:", err);
    } finally {
      loading.value = false;
    }
  };

  const addTag = async (tagData: Omit<Tag, "id">): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await createTag(tagData);
      tags.value.push(response.data);
    } catch (err) {
      if ((err as any).status == 400) {
        notificationStore.showError(
          locales[currentLanguage.value].TheTagIsAlreadyExists,
        );
      } else {
        notificationStore.showError(
          locales[currentLanguage.value].errorCreatingTag,
        );
      }
    } finally {
      loading.value = false;
    }
  };

  const updateTag = async (
    tagId: number,
    updates: Omit<Tag, "id">,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response: AxiosResponse<Tag> = await updateTagService(
        tagId,
        updates,
      );
      const tagIndex = tags.value.findIndex((tag) => tag.id === tagId);
      if (tagIndex === -1) throw new Error("Tag not found");
      tags.value[tagIndex] = response.data;

      tasks.value = tasks.value.map((task) => {
        if (task.tags.some((tag) => tag.id === tagId)) {
          return {
            ...task,
            tags: task.tags.map((tag) =>
              tag.id === tagId ? response.data : tag,
            ),
          };
        }
        return task;
      });
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorUpdatingTag || "Error updating tag";
      console.error("Error updating tag:", err);
    } finally {
      loading.value = false;
    }
  };

  const deleteTag = async (tagId: number): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      await deleteTagService(tagId);

      tags.value = tags.value.filter((tag) => tag.id !== tagId);

      tasks.value = tasks.value.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => tag.id !== tagId),
      }));

      tasksByDate.value.forEach((tasks, date) => {
        tasksByDate.value.set(
          date,
          tasks.map((task) => ({
            ...task,
            tags: task.tags.filter((tag) => tag.id !== tagId),
          })),
        );
      });
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorDeletingTag || "Error deleting tag";
      console.error("Error deleting tag:", err);
    } finally {
      loading.value = false;
    }
  };

  // Utility Actions
  const clearError = (): void => {
    error.value = null;
  };

  const searchTasks = (query: string): Task[] => {
    const lowercaseQuery = query.toLowerCase();
    return tasks.value.filter(
      (task) =>
        task.title.toLowerCase().includes(lowercaseQuery) ||
        task.description.toLowerCase().includes(lowercaseQuery) ||
        task.tags.some((tag) =>
          tag.title.toLowerCase().includes(lowercaseQuery),
        ),
    );
  };

  const getTaskById = (taskId: number): Task | undefined => {
    return tasks.value.find((task) => task.id === taskId);
  };

  const getTagById = (tagId: number): Tag | undefined => {
    return tags.value.find((tag) => tag.id === tagId);
  };

  const getTaskListById = (listId: number): TaskList | undefined => {
    return taskLists.value.find((list) => list.id === listId);
  };

  // Initialize store
  const initialize = async (): Promise<void> => {
    await Promise.all([fetchTasks(), fetchTaskLists(), fetchTags()]);
  };

  return {
    // State
    tasks: tasks,
    taskLists: taskLists,
    tags: tags,
    loading: readonly(loading),
    error: readonly(error),
    tasksByDate: readonly(tasksByDate),

    // Getters
    completedTasks,
    pendingTasks,
    tasksByCategory,
    tasksByPriority,
    tasksByTag,
    overdueTasks,
    todayTasks,
    upcomingTasks,
    taskStats,
    tasksForDate,

    // Task Actions
    fetchTasks,
    fetchTasksByDate,
    addTask,
    updateTask,
    deleteTask: removeTask,
    toggleTaskComplete,

    // SubTask Actions
    addSubTask,
    updateSubTask,
    deleteSubTask,
    toggleSubTaskComplete,

    // TaskList Actions
    fetchTaskLists,
    addTaskList,
    updateTaskList,
    deleteTaskList,

    // Tag Actions
    fetchTags,
    addTag,
    updateTag,
    deleteTag,

    // Utility Actions
    clearError,
    searchTasks,
    getTaskById,
    getTagById,
    getTaskListById,
    initialize,
  };
});
