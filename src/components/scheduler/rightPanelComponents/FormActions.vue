<template>
  <div class="border-t border-gray-200 pt-4 mt-6">
    <div class="flex gap-3">
      <button
        v-if="showDeleteButton"
        class="flex-1 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
        @click="$emit('delete')"
      >
        {{ deleteButtonText }}
      </button>
      <button
        class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        @click="$emit('save')"
        :disabled="!canSave"
        :class="{ 'opacity-50 cursor-not-allowed': !canSave }"
      >
        {{ saveButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
defineProps<{
  showDeleteButton?: boolean;
  deleteButtonText?: string;
  saveButtonText: string;
  canSave: boolean;
}>();

// Emits
defineEmits<{
  delete: [];
  save: [];
}>();
</script>
