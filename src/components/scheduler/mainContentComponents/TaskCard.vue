<template>
  <div
    class="group relative rounded-xl border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-gray-300 overflow-hidden"
    :class="[
      {
        'bg-blue-50': isSelected,
        'opacity-70 hover:opacity-80': task.is_completed,
      },
    ]"
    @click="$emit('task-selected', task)"
  >
    <!-- Priority Accent Bar -->
    <div
      class="absolute top-0 left-0 right-0 h-1 transition-all duration-300"
      :class="getPriorityColor(task.priority_level)"
    ></div>

    <div class="p-4 sm:p-5">
      <!-- Task Header -->
      <div class="flex items-start gap-3 mb-3">
        <!-- Completion Checkbox -->
        <button
          @click.stop="$emit('toggle-completion', task.id)"
          :disabled="isToggling"
          class="flex-shrink-0 mt-0.5 w-6 h-6 rounded-lg border-2 transition-all duration-200 flex items-center justify-center hover:scale-110 disabled:hover:scale-100 disabled:cursor-not-allowed disabled:opacity-70"
          :class="
            task.is_completed
              ? 'bg-green-500 border-green-500 text-white shadow-sm'
              : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
          "
        >
          <!-- Loading Spinner -->
          <svg
            v-if="isToggling"
            class="w-4 h-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-opacity="0.25"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-dasharray="31.416"
              stroke-dashoffset="23.562"
            />
          </svg>
          <!-- Checkmark (when completed and not loading) -->
          <svg
            v-else-if="task.is_completed"
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </button>

        <!-- Task Title & Priority -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-3 mt-1">
            <h3
              class="font-semibold text-gray-900 text-base sm:text-lg leading-tight transition-all duration-200"
              :class="{
                'line-through text-gray-500': task.is_completed,
                'group-hover:text-blue-600': !task.is_completed,
              }"
            >
              {{ task.title }}
            </h3>

            <!-- Priority Badge -->
            <!-- <span
              class="flex-shrink-0 px-2.5 pt-1 rounded-full text-xs font-semibold uppercase tracking-wide"
              :class="getPriorityBadgeClass(task.priority_level)"
            >
              {{ getPriorityText(task.priority_level) }}
            </span> -->
          </div>

          <!-- Task Description -->
          <p
            v-if="task.description"
            class="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-2"
            :class="{ 'text-gray-400': task.is_completed }"
          >
            {{ task.description }}
          </p>
        </div>
      </div>

      <!-- Subtask Progress Bar -->
      <div v-if="task.subTasks.length > 0" class="mb-4 pl-9">
        <div class="flex items-center justify-between mb-1.5">
          <div
            class="flex items-center gap-1.5 text-xs font-medium text-gray-600"
          >
            <svg
              class="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="9,11 12,14 22,4" />
              <path
                d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"
              />
            </svg>
            <span class="mt-1">
              {{ getCompletedSubtasksCount(task) }}/{{ task.subTasks.length }}
              {{ subtasksText }}
            </span>
          </div>
          <span class="text-xs font-semibold text-gray-500">
            {{ getSubtaskProgress(task) }}%
          </span>
        </div>
        <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            class="h-2 rounded-full transition-all duration-500 ease-out"
            :class="task.is_completed ? 'bg-green-500' : 'bg-blue-500'"
            :style="{ width: `${getSubtaskProgress(task)}%` }"
          ></div>
        </div>
      </div>

      <!-- Task Metadata -->
      <div class="flex flex-col gap-2.5 pl-9">
        <!-- Date and Time Row -->
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          <!-- Scheduled Date -->
          <div
            v-if="task.scheduled_date"
            class="flex items-center gap-1.5 text-gray-600"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span class="font-medium mt-1">{{
              formatDate(task.scheduled_date)
            }}</span>
            <span
              v-if="task.dead_line"
              class="font-medium transition-colors mt-1"
              :class="
                isOverdue(task.dead_line) ? 'text-red-600' : 'text-gray-600'
              "
            >
              → {{ formatDate(task.dead_line) }}
            </span>
            <span
              v-if="task.dead_line && isOverdue(task.dead_line)"
              class="px-2 py-0.5 mt-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold"
            >
              Overdue
            </span>
          </div>

          <!-- Time Range -->
          <div
            v-if="task.start_time"
            class="flex items-center gap-1.5 text-gray-600"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12,6 12,12 16,14" />
            </svg>
            <span class="font-medium mt-1">{{
              formatTime(task.start_time)
            }}</span>
            <span v-if="task.end_time" class="font-medium mt-1">
              → {{ formatTime(task.end_time) }}
            </span>
          </div>
        </div>

        <!-- Tags Row -->
        <div
          v-if="task.tags.length > 0"
          class="flex items-center flex-wrap gap-2"
        >
          <span
            v-for="tag in task.tags.slice(0, 2)"
            :key="tag.id"
            class="px-2 pt-1.5 pb-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium"
          >
            {{ tag.title }}
          </span>
          <span
            v-if="task.tags.length > 2"
            class="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold"
          >
            +{{ task.tags.length - 2 }} more
          </span>
        </div>
      </div>
    </div>

    <!-- Hover Indicator -->
    <div
      class="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      :class="{ 'scale-x-100': isSelected }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import type { ITask } from "@/types/index";

// Props
const props = defineProps<{
  task: ITask;
  isSelected: boolean;
  currentLanguage: string;
  subtasksText: string;
  isToggling?: boolean;
}>();

// Emits
defineEmits<{
  "task-selected": [task: ITask];
  "toggle-completion": [taskId: string | number];
}>();

// Helper Functions
const getPriorityColor = (level: "L" | "M" | "H"): string => {
  const colors = {
    L: "bg-gradient-to-r from-green-400 to-emerald-500",
    M: "bg-gradient-to-r from-yellow-400 to-orange-400",
    H: "bg-gradient-to-r from-orange-500 to-red-500",
  };
  return colors[level] || "bg-gray-400";
};

// const getPriorityBadgeClass = (level: "L" | "M" | "H"): string => {
//   const classes = {
//     L: "bg-green-100 text-green-700 border border-green-200",
//     M: "bg-yellow-100 text-yellow-700 border border-yellow-200",
//     H: "bg-red-100 text-red-700 border border-red-200",
//   };
//   return classes[level] || "bg-gray-100 text-gray-700";
// };

// const getPriorityText = (level: "L" | "M" | "H"): string => {
//   const priorities = {
//     L: "Low",
//     M: "Med",
//     H: "High",
//   };
//   return priorities[level] || "N/A";
// };

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

const formatTime = (time: string): string => {
  const parts = time.split(":");

  if (parts.length < 2) {
    throw new Error("Invalid time format. Expected 'HH:MM:SS' or 'HH:MM'.");
  }

  const [hours, minutes] = parts;
  return `${hours}:${minutes}`;
};

const isOverdue = (deadlineString: string): boolean => {
  const deadline = new Date(deadlineString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return deadline < today;
};

const getCompletedSubtasksCount = (task: ITask): number => {
  return task.subTasks.filter((subtask) => subtask.is_completed).length;
};

const getSubtaskProgress = (task: ITask): number => {
  if (task.subTasks.length === 0) return 0;
  const completedCount = getCompletedSubtasksCount(task);
  return Math.round((completedCount / task.subTasks.length) * 100);
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
