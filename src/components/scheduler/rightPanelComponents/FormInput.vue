<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <input
      v-if="type !== 'textarea'"
      :type="type"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      :class="inputClasses"
      :placeholder="placeholder"
      :required="required"
      :disabled="disable"
    />
    <textarea
      v-else
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)
      "
      :rows="rows"
      :class="[inputClasses, 'resize-none']"
      :placeholder="placeholder"
      :required="required"
      :disabled="disable"
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Props
const props = defineProps<{
  modelValue: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disable?: boolean;
  rows?: number;
}>();

// Emits
defineEmits<{
  "update:modelValue": [value: string];
}>();

// Computed
const inputClasses = computed(() => {
  const baseClasses = "w-full px-3 py-2 border rounded-lg transition-colors";

  if (props.disable) {
    return `${baseClasses} border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed`;
  }

  return `${baseClasses} border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`;
});
</script>
