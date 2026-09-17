import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ITaskList } from "@/types";
import { locales } from "@/locales/schedulerLocales/index";
import { currentLanguage } from "@/main";
import { useNotificationStore } from "./notificationStore";
import { useTaskStore } from "./taskStore";
import to from "await-to-js";
import { getCategory } from "@/api/generated/endpoints";

export const useTaskListStore = defineStore("taskList", () => {
  // State
  const taskLists = ref<ITaskList[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const categoryService = getCategory();

  // Getters
  const getTaskListById = computed(() => (listId: number) => {
    return taskLists.value.find((list) => list.id === listId);
  });

  // Actions
  const fetchTaskLists = async (): Promise<void> => {
    loading.value = true;
    error.value = null;

    const [err, resp] = await to(
      categoryService.categoryControllerGetAll({ offset: 0, limit: 1000 }),
    );

    if (err) {
      error.value =
        locales[currentLanguage.value].errorFetchingLists ||
        "Error fetching task lists";
      console.error("Error fetching task lists:", err);
    }

    taskLists.value = resp!.results!.map((data) => {
      return {
        id: data.id,
        title: data.title,
      };
    });

    loading.value = false;
  };

  const addTaskList = async (
    listData: Omit<ITaskList, "id" | "task_count">,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    const notificationStore = useNotificationStore();
    try {
      const response = await categoryService.categoryControllerCreate(listData);
      taskLists.value.push(response.result!);

      notificationStore.showSuccess(locales[currentLanguage.value].listCreated);
    } catch (err: any) {
      const error = err?.response?.data;

      debugger;
      if (error.status == 400) {
        const message = Array.isArray(error.message)
          ? (error as any)?.message?.[0]
          : (error as any).message;

        notificationStore.showError(message ?? "Validation Error");
      } else if ((err as any).status == 409) {
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
      const response = await categoryService.categoryControllerUpdateOne(
        listId,
        updates,
      );

      const listIndex = taskLists.value.findIndex((list) => list.id === listId);
      if (listIndex === -1) throw new Error("List not found");
      const target = taskLists.value[listIndex];

      taskLists.value[listIndex] = {
        ...target,
        title: response!.result!.title,
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
      await categoryService.categoryControllerDelete(listId);

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
