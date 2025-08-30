<template>
  <div>
    <div class="flex items-center justify-between mb-3">
      <label class="block text-sm font-medium text-gray-700">
        {{ label }}
      </label>
      <button
        class="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
        @click="addSubtask"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {{ addButtonText }}
      </button>
    </div>

    <div class="space-y-2">
      <div
        v-for="(subtask, index) in subtasks"
        :key="subtask.id || index"
        class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg"
      >
        <input
          type="checkbox"
          :checked="subtask.is_completed"
          @change="toggleSubtask(index)"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <input
          :value="subtask.title"
          @input="
            updateSubtaskTitle(index, ($event.target as HTMLInputElement).value)
          "
          class="flex-1 bg-transparent border-none outline-none text-sm"
          :class="{ 'line-through text-gray-500': subtask.is_completed }"
          :placeholder="placeholder"
        />
        <button
          @click="removeSubtask(index)"
          class="text-red-500 hover:text-red-700 p-1"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SubTask } from "@/types/index";

// Props
const props = defineProps<{
  subtasks: SubTask[];
  label: string;
  addButtonText: string;
  placeholder: string;
}>();

// Emits
const emit = defineEmits<{
  "add-subtask": [];
  "remove-subtask": [index: number];
  "toggle-subtask": [index: number];
  "update-subtask-title": [index: number, title: string];
}>();

// Methods
const addSubtask = (): void => {
  emit("add-subtask");
};

const removeSubtask = (index: number): void => {
  emit("remove-subtask", index);
};

const toggleSubtask = (index: number): void => {
  emit("toggle-subtask", index);
};

const updateSubtaskTitle = (index: number, title: string): void => {
  emit("update-subtask-title", index, title);
};
</script>
