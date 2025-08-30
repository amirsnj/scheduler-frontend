<template>
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-lg font-semibold text-gray-900">
      {{ title }}
    </h2>
    <button
      v-if="showCloseButton"
      class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
      @click="$emit('close')"
    >
      <svg
        width="20"
        height="20"
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
</template>

<script setup lang="ts">
// Props
defineProps<{
  title: string;
  showCloseButton?: boolean;
}>();

// Emits
defineEmits<{
  close: [];
}>();
</script>
