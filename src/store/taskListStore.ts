import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ITaskList } from "@/types";
import { locales } from "@/locales/schedulerLocales/index";
import { currentLanguage } from "@/main";
import {
  createTaskCategory,
  getTaskCategories,
  updateTaskCategory,
  deleteTaskCategory,
} from "@/api/appService";
import { useNotificationStore } from "./notificationStore";
import { useTaskStore } from "./taskStore";

export const useTaskListStore = defineStore("taskList", () => {
  // State
  const taskLists = ref<ITaskList[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters
  const getTaskListById = computed(() => (listId: number) => {
    return taskLists.value.find((list) => list.id === listId);
  });

  // Actions
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
    listData: Omit<ITaskList, "id" | "task_count">,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await createTaskCategory(listData);
      taskLists.value.push(response.data);
    } catch (err) {
      const notificationStore = useNotificationStore();
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
    updates: Omit<ITaskList, "id" | "task_count">,
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

      // Update tasks that were in this category
      const taskStore = useTaskStore();
      taskStore.tasks = taskStore.tasks.map((task) =>
        task.category === listId ? { ...task, category: null } : task,
      );

      // Note: tasksByDate updates are handled in the task store
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
        const taskStore = useTaskStore();
        const today = new Date().toISOString().split("T")[0];
        list.task_count = taskStore.tasks.filter(
          (t) =>
            t.category === categoryId &&
            (t.scheduled_date === today || t.dead_line === today),
        ).length;
      }
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  return {
    // State
    taskLists,
    loading,
    error,

    // Getters
    getTaskListById,

    // Actions
    fetchTaskLists,
    addTaskList,
    updateTaskList,
    deleteTaskList,
    updateTaskListCount,
    clearError,
  };
});
