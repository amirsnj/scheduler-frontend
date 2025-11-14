import { computed, ref } from "vue";
import type { ITask } from "@/types";

export function useTaskFilters(tasks: any) {
  const searchQuery = ref<string>("");
  const selectedPriority = ref<string>("");
  const selectedCategory = ref<number | null>(null);
  const selectedTag = ref<number | null>(null);
  const showCompleted = ref<boolean>(true);

  const filteredTasks = computed(() => {
    let filtered = tasks.value;

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      filtered = filtered.filter((task: ITask) =>
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some((tag) => tag.title.toLowerCase().includes(query))
      );
    }

    // Priority filter
    if (selectedPriority.value) {
      filtered = filtered.filter((task: ITask) => 
        task.priority_level === selectedPriority.value
      );
    }

    // Category filter
    if (selectedCategory.value) {
      filtered = filtered.filter((task: ITask) => 
        task.category === selectedCategory.value
      );
    }

    // Tag filter
    if (selectedTag.value) {
      filtered = filtered.filter((task: ITask) => 
        task.tags.some((tag) => tag.id === selectedTag.value)
      );
    }

    // Completed filter
    if (!showCompleted.value) {
      filtered = filtered.filter((task: ITask) => !task.is_completed);
    }

    return filtered;
  });

  const clearFilters = () => {
    searchQuery.value = "";
    selectedPriority.value = "";
    selectedCategory.value = null;
    selectedTag.value = null;
    showCompleted.value = true;
  };

  const hasActiveFilters = computed(() => {
    return !!(
      searchQuery.value ||
      selectedPriority.value ||
      selectedCategory.value ||
      selectedTag.value ||
      !showCompleted.value
    );
  });

  return {
    // State
    searchQuery,
    selectedPriority,
    selectedCategory,
    selectedTag,
    showCompleted,

    // Computed
    filteredTasks,
    hasActiveFilters,

    // Methods
    clearFilters,
  };
}

