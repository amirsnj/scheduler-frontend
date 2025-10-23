import { defineStore } from "pinia";
import { useTaskStore } from "./taskStore";
import { useTaskListStore } from "./taskListStore";
import { useTagStore } from "./tagStore";

export const useMainStore = defineStore("main", () => {
  // Initialize all stores
  const initialize = async (): Promise<void> => {
    const taskStore = useTaskStore();
    const taskListStore = useTaskListStore();
    const tagStore = useTagStore();
    
    await Promise.all([
      taskStore.fetchTasks(),
      taskListStore.fetchTaskLists(),
      tagStore.fetchTags(),
    ]);
  };

  return {
    // Combined actions
    initialize,
  };
});

