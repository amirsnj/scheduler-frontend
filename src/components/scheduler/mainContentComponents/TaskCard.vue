<template>
  <div
    class="p-4 border border-gray-200 rounded-lg cursor-pointer transition-all hover:shadow-md"
    :class="[
      {
        'border-blue-500 bg-blue-50': isSelected,
      },
      { 'opacity-60': task.is_completed },
    ]"
    @click="$emit('task-selected', task)"
  >
    <!-- Task Header -->
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center gap-3 flex-1">
        <!-- Completion Checkbox -->
        <button
          @click.stop="$emit('toggle-completion', task.id)"
          class="flex-shrink-0 w-5 h-5 rounded border-2 transition-colors flex items-center justify-center"
          :class="
            task.is_completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          "
        >
          <svg
            v-if="task.is_completed"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </button>

        <!-- Task Title -->
        <h3
          class="font-medium text-gray-900 flex-1"
          :class="{ 'line-through': task.is_completed }"
        >
          {{ task.title }}
        </h3>
      </div>

      <!-- Priority Indicator -->
      <div
        class="w-2 h-2 rounded-full flex-shrink-0"
        :class="getPriorityColor(task.priority_level)"
        :title="getPriorityText(task.priority_level)"
      ></div>
    </div>

    <!-- Task Description -->
    <div v-if="task.description" class="mb-3 text-sm text-gray-600 ml-8">
      {{ task.description }}
    </div>

    <!-- Task Info -->
    <div
      class="flex flex-wrap items-center justify-between gap-y-2 text-sm text-gray-500 ml-8"
    >
      <div class="flex items-center gap-4">
        <!-- Scheduled Date -->
        <div v-if="task.scheduled_date" class="flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="mb-1"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>{{ formatDate(task.scheduled_date) }}</span>
        </div>

        <!-- Deadline -->
        <div v-if="task.dead_line" class="flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="mb-[3px]"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span :class="{ 'text-red-500': isOverdue(task.dead_line) }">
            {{ formatDate(task.dead_line) }}
          </span>
        </div>

        <!-- Subtasks Count -->
        <div v-if="task.subTasks.length > 0" class="flex items-center gap-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="mb-1"
          >
            <polyline points="9,11 12,14 22,4" />
            <path
              d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"
            />
          </svg>
          <span>
            {{ getCompletedSubtasksCount(task) }}/{{ task.subTasks.length }}
            {{ subtasksText }}
          </span>
        </div>
      </div>

      <!-- Tags -->
      <div class="flex items-center gap-2">
        <span
          v-for="tag in task.tags.slice(0, 2)"
          :key="tag.id"
          class="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium"
        >
          {{ tag.title }}
        </span>
        <span
          v-if="task.tags.length > 2"
          class="px-2 py-1 bg-gray-100 text-gray-500 rounded-full text-xs"
        >
          +{{ task.tags.length - 2 }}
        </span>
      </div>
    </div>

    <!-- Subtask Progress Bar -->
    <div v-if="task.subTasks.length > 0" class="mt-3 ml-8">
      <div class="w-full bg-gray-200 rounded-full h-1.5">
        <div
          class="bg-green-500 h-1.5 rounded-full transition-all duration-300"
          :style="{ width: `${getSubtaskProgress(task)}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "@/types/index";

// Props
const props = defineProps<{
  task: Task;
  isSelected: boolean;
  currentLanguage: string;
  subtasksText: string;
}>();

// Emits
defineEmits<{
  "task-selected": [task: Task];
  "toggle-completion": [taskId: string | number];
}>();

// Helper Functions
const getPriorityColor = (level: "L" | "M" | "H"): string => {
  const colors = {
    L: "bg-green-500",
    M: "bg-yellow-500",
    H: "bg-orange-500",
  };
  return colors[level] || "bg-gray-500";
};

const getPriorityText = (level: "L" | "M" | "H"): string => {
  const priorities = {
    L: "Low Priority",
    M: "Medium Priority",
    H: "High Priority",
  };
  return priorities[level] || "Unknown Priority";
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(
    props.currentLanguage === "fa" ? "fa-IR" : "en-US",
    {
      month: "short",
      day: "numeric",
    },
  );
};

const isOverdue = (deadlineString: string): boolean => {
  const deadline = new Date(deadlineString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadline < today;
};

const getCompletedSubtasksCount = (task: Task): number => {
  return task.subTasks.filter((subtask) => subtask.is_completed).length;
};

const getSubtaskProgress = (task: Task): number => {
  if (task.subTasks.length === 0) return 0;
  const completedCount = getCompletedSubtasksCount(task);
  return Math.round((completedCount / task.subTasks.length) * 100);
};
</script>
