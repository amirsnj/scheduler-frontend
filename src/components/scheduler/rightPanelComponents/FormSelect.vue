<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>
    <select
      :value="modelValue"
      @change="
        $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
      "
      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option v-if="showEmptyOption" :value="null">
        {{ emptyOptionText }}
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
export interface SelectOption {
  value: string | number;
  label: string;
}

// Props
defineProps<{
  modelValue: string | number | null;
  label: string;
  options: SelectOption[];
  showEmptyOption?: boolean;
  emptyOptionText?: string;
  emptyValue?: string | number | null;
}>();

// Emits
defineEmits<{
  "update:modelValue": [value: string | number | null];
}>();
</script>
