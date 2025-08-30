import { defineStore } from "pinia";
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
  updateTask as updateTaskAPI, // 🔥 اضافه کردن import جدید
  toggleTaskComplete as toggleTaskAPI, // 🔥 اضافه کردن import جدید
} from "@/api/appService";
import { useNotificationStore } from "./notificationStore";

const notificationStore = useNotificationStore();

export const useTaskStore = defineStore("task", () => {
  // State - بدون تغییر
  const tasks = ref<Task[]>([]);
  const taskLists = ref<TaskList[]>([]);
  const tags = ref<Tag[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters (Computed) - بدون تغییر
  const completedTasks = computed(() =>
    tasks.value.filter((task) => task.is_completed),
  );

  const pendingTasks = computed(() =>
    tasks.value.filter((task) => !task.is_completed),
  );

  const tasksByCategory = computed(
    () => (categoryId: number | null) =>
      tasks.value.filter((task) => task.category === categoryId),
  );

  const tasksByPriority = computed(
    () => (priority: "L" | "M" | "H") =>
      tasks.value.filter((task) => task.priority_level === priority),
  );

  const tasksByTag = computed(
    () => (tagId: number) =>
      tasks.value.filter((task) => task.tags.some((tag) => tag.id === tagId)),
  );

  const overdueTasks = computed(() => {
    const now = new Date();
    return tasks.value.filter(
      (task) =>
        task.dead_line && new Date(task.dead_line) < now && !task.is_completed,
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

  // Task Actions
  const fetchTasks = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await getTasks();
      tasks.value = response.data;
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorFetchingTasks ||
        "Error fetching tasks";
      console.error("Error fetching tasks:", err);
    } finally {
      loading.value = false;
    }
  };

  const addTask = async (taskData: TaskCreate): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await createTask(taskData);
      console.log(response.data);
      tasks.value.push(response.data);
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

  // 🔥 اصلاح کامل updateTask
  const updateTask = async (
    taskId: number,
    updates: Partial<Task>,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      // آماده‌سازی داده‌ها برای ارسال به بک‌اند
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

      // ارسال به بک‌اند
      console.log(updateData);
      const response = await updateTaskAPI(taskId, updateData);

      // آپدیت داده‌های محلی با پاسخ سرور
      const taskIndex = tasks.value.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) throw new Error("Task not found");

      const oldCategory = tasks.value[taskIndex].category;

      // استفاده از داده‌های برگردانده شده از سرور
      tasks.value[taskIndex] = {
        ...response.data,
        updated_at: new Date().toISOString(),
      };

      // آپدیت شمارش category ها
      if (oldCategory !== updates.category) {
        updateTaskListCount(oldCategory);
        updateTaskListCount(updates.category);
      }

      console.log("Task updated successfully:", response.data);
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorUpdatingTask ||
        "Error updating task";
      console.error("Error updating task:", err);
      throw err; // re-throw برای نمایش خطا در UI
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
      tasks.value.splice(taskIndex, 1);
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

  // 🔥 اصلاح toggleTaskComplete
  const toggleTaskComplete = async (taskId: number): Promise<void> => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      try {
        // ارسال به API
        const newCompletionStatus = !task.is_completed;
        await toggleTaskAPI(taskId, newCompletionStatus);

        // آپدیت محلی
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

  // SubTask Actions - بدون تغییر
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

  // TaskList Actions - بدون تغییر
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
      console.log(err);
      if (err.status == 400) {
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
    updates: Partial<TaskList>,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const listIndex = taskLists.value.findIndex((list) => list.id === listId);
      if (listIndex === -1) throw new Error("List not found");
      taskLists.value[listIndex] = {
        ...taskLists.value[listIndex],
        ...updates,
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
      taskLists.value = taskLists.value.filter((list) => list.id !== listId);
      tasks.value = tasks.value.filter((task) => task.category !== listId);
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
        list.task_count = tasks.value.filter(
          (t) => t.category === categoryId,
        ).length;
      }
    }
  };

  // Tag Actions - بدون تغییر
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
      if (err.status == 400) {
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
    updates: Partial<Tag>,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const tagIndex = tags.value.findIndex((tag) => tag.id === tagId);
      if (tagIndex === -1) throw new Error("Tag not found");
      tags.value[tagIndex] = { ...tags.value[tagIndex], ...updates };
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
      tags.value = tags.value.filter((tag) => tag.id !== tagId);
      tasks.value.forEach((task) => {
        task.tags = task.tags.filter((tag) => tag.id !== tagId);
      });
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorDeletingTag || "Error deleting tag";
      console.error("Error deleting tag:", err);
    } finally {
      loading.value = false;
    }
  };

  // Utility Actions - بدون تغییر
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
    tasks: readonly(tasks),
    taskLists: readonly(taskLists),
    tags: readonly(tags),
    loading: readonly(loading),
    error: readonly(error),

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

    // Task Actions
    fetchTasks,
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
