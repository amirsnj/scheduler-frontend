import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ITag } from "@/types";
import { locales } from "@/locales/schedulerLocales/index";
import { currentLanguage } from "@/main";
import {
  createTag,
  getTags,
  updateTagService,
  deleteTagService,
} from "@/api/appService";
import { useNotificationStore } from "./notificationStore";
import { useTaskStore } from "./taskStore";
import type { AxiosResponse } from "axios";

export const useTagStore = defineStore("tag", () => {
  // State
  const tags = ref<ITag[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // Getters
  const getTagById = computed(() => (tagId: number) => {
    return tags.value.find((tag) => tag.id === tagId);
  });

  // Actions
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

  const addTag = async (tagData: Omit<ITag, "id">): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await createTag(tagData);
      tags.value.push(response.data);
    } catch (err) {
      const notificationStore = useNotificationStore();
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
    updates: Omit<ITag, "id">,
  ): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response: AxiosResponse<ITag> = await updateTagService(
        tagId,
        updates,
      );
      const tagIndex = tags.value.findIndex((tag) => tag.id === tagId);
      if (tagIndex === -1) throw new Error("Tag not found");
      tags.value[tagIndex] = response.data;

      // Update tasks that have this tag
      const taskStore = useTaskStore();
      taskStore.tasks = taskStore.tasks.map((task) => {
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

      // Update tasks that had this tag
      const taskStore = useTaskStore();
      taskStore.tasks = taskStore.tasks.map((task) => ({
        ...task,
        tags: task.tags.filter((tag) => tag.id !== tagId),
      }));

      // Note: tasksByDate updates are handled in the task store
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorDeletingTag || "Error deleting tag";
      console.error("Error deleting tag:", err);
    } finally {
      loading.value = false;
    }
  };

  const clearError = (): void => {
    error.value = null;
  };

  return {
    // State
    tags,
    loading,
    error,

    // Getters
    getTagById,

    // Actions
    fetchTags,
    addTag,
    updateTag,
    deleteTag,
    clearError,
  };
});
