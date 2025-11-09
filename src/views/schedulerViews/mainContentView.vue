<template>
  <div
    class="h-full bg-white rounded-xl p-6 lg:shadow-lg flex flex-col overflow-hidden"
  >
    <!-- Header -->
    <div class="flex-shrink-0">
      <PageHeader
        :title="getActiveItemTitle()"
        :task-count="tasks.length"
        :add-task-text="locales[currentLanguage].addNewTask"
        @toggle-mobile-menu="$emit('toggle-mobile-menu')"
        @add-task="$emit('add-task')"
      />
    </div>

    <!-- Calendar Navigation Buttons -->
    <div v-if="activeItem === 'calendar'" class="flex-shrink-0">
      <CalendarNavigation
        :selected-date="selectedDate"
        :is-rtl="currentLanguage === 'fa'"
        :previous-day-text="
          locales[currentLanguage].previousDay || 'Previous Day'
        "
        :today-text="locales[currentLanguage].today || 'Today'"
        :next-day-text="locales[currentLanguage].nextDay || 'Next Day'"
        @previous-day="$emit('previous-day')"
        @today="$emit('today')"
        @next-day="$emit('next-day')"
        @update:selectedDate="handleDateUpdate"
      />
    </div>

    <!-- Loading Animation -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <LoadingSpinner />
    </div>

    <!-- Task List -->
    <div v-else class="flex-1 space-y-3 overflow-y-auto scrollbar-hide min-h-0">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        :is-selected="!!(selectedTask && selectedTask.id === task.id)"
        :current-language="currentLanguage"
        :subtasks-text="
          locales[currentLanguage].subtasks?.toLowerCase() || 'subtasks'
        "
        :is-toggling="togglingTaskIds?.[task.id] || false"
        @task-selected="$emit('task-selected', $event)"
        @toggle-completion="$emit('toggle-task-completion', $event)"
      />

      <!-- Empty State -->
      <EmptyState
        v-if="tasks.length === 0 && !isLoading"
        :title="locales[currentLanguage].noTasks"
        :description="locales[currentLanguage].noTasksDescription"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task, Locale } from "@/types/index";
import { ref, watch } from "vue";
import TaskCard from "@/components/scheduler/mainContentComponents/TaskCard.vue";
import CalendarNavigation from "@/components/scheduler/mainContentComponents/CalendarNavigation.vue";
import PageHeader from "@/components/scheduler/mainContentComponents/PageHeader.vue";
import LoadingSpinner from "@/components/scheduler/mainContentComponents/LoadingSpinner.vue";
import EmptyState from "@/components/scheduler/mainContentComponents/EmptyState.vue";
import { useTaskListStore } from "@/store";

const taskStore = useTaskListStore();

// Props
const props = defineProps<{
  currentLanguage: string;
  locales: Record<string, Locale>;
  activeItem: string;
  tasks: Task[];
  selectedTask: Task | null;
  isLoading: boolean;
  currentDate: string;
  togglingTaskIds?: Record<number, boolean>;
}>();

// Reactive data for date picker
const selectedDate = ref<string>(props.currentDate);

// Sync selectedDate with currentDate prop
watch(
  () => props.currentDate,
  (newDate) => {
    selectedDate.value = newDate;
  },
);

// Methods
const handleDateUpdate = (date: string) => {
  selectedDate.value = date;
  emit("update:selectedDate", date);
};

// Emits
const emit = defineEmits<{
  "toggle-mobile-menu": [];
  "add-task": [];
  "previous-day": [];
  today: [];
  "next-day": [];
  "update:selectedDate": [date: string];
  "task-selected": [task: Task];
  "toggle-task-completion": [taskId: string | number];
}>();

// Helper Functions
const getActiveItemTitle = (): string => {
  const translations: Record<string, string> = {
    all: props.locales[props.currentLanguage].allTasks || "All Tasks",
    today: props.locales[props.currentLanguage].today || "Today",
    upcoming: props.locales[props.currentLanguage].upcoming || "Upcoming",
    completed: props.locales[props.currentLanguage].completed || "Completed",
    calendar: props.locales[props.currentLanguage].calendar || "Calendar",
  };

  if (translations[props.activeItem]) {
    return translations[props.activeItem];
  }

  if (props.activeItem.startsWith("category-")) {
    const categoryId = parseInt(props.activeItem.split("-")[1]);
    const taskIndex = taskStore.taskLists.findIndex(
      (list) => list.id === categoryId,
    );
    return taskStore.taskLists[taskIndex].title || `Category ${categoryId}`;
  }

  return props.activeItem;
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
