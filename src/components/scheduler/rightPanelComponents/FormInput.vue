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
  rows?: number;
}>();

// Emits
defineEmits<{
  "update:modelValue": [value: string];
}>();

// Computed
const inputClasses = computed(
  () =>
    "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
);
</script>
