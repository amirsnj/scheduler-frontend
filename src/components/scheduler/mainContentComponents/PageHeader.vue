<template>
  <div class="flex items-center justify-between mb-6">
    <!-- Mobile menu button -->
    <button
      class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      @click="$emit('toggle-mobile-menu')"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <div class="flex items-center gap-4">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ title }}
        <span class="text-sm font-normal text-gray-500">{{ taskCount }}</span>
      </h1>
    </div>

    <button
      class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
      @click="$emit('add-task')"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {{ addTaskText }}
    </button>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  title: string;
  taskCount: number;
  addTaskText: string;
}>();

// Emits
defineEmits<{
  "toggle-mobile-menu": [];
  "add-task": [];
}>();
</script>
