<template>
  <li
    class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    :class="{ 'bg-blue-50 text-blue-600': isActive }"
    @click="$emit('click')"
  >
    <div class="flex flex-1 gap-2">
      <slot name="icon">
        <svg
          class="mr-3 flex-shrink-0"
          width="16"
          height="16"
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
      </slot>
      <span class="text-sm font-medium">{{ title }}</span>
    </div>
    <span
      v-if="showCount"
      class="text-xs font-medium"
      :class="isActive ? 'text-blue-600' : 'text-gray-400'"
    >
      {{ count }}
    </span>
  </li>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  count?: number;
  isActive?: boolean;
  showCount?: boolean;
}

defineProps<Props>();

defineEmits<{
  click: [];
}>();
</script>
