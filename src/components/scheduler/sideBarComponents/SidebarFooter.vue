<template>
  <div class="mt-auto border-t border-gray-200 pt-4">
    <button
      class="flex items-center px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start mb-1"
      @click="$emit('settings-click')"
    >
      <svg
        class="mr-3"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
      </svg>
      {{ settingsText }}
    </button>
    <button
      class="flex items-center px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start"
      @click="$emit('sign-out-click')"
    >
      <svg
        class="mr-3"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16,17 21,12 16,7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
      {{ signOutText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  settingsText: string;
  signOutText: string;
}

defineProps<Props>();

defineEmits<{
  "settings-click": [];
  "sign-out-click": [];
}>();
</script>
