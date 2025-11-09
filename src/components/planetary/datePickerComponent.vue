<script setup lang="ts">
import { computed } from "vue";

interface Props {
  modelValue: string;
  placeholder?: string;
  disabled?: boolean;
}
interface Emits {
  (e: "update:modelValue", v: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "dd/mm/yyyy",
  disabled: false,
});
const emit = defineEmits<Emits>();

const display = computed(() => {
  if (!props.modelValue) return "";
  const d = new Date(props.modelValue);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
});

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value;
  emit("update:modelValue", v);
}
</script>

<template>
  <div class="relative inline-block">
    <input
      type="date"
      :value="modelValue"
      @input="onInput"
      :disabled="disabled"
      class="peer w-full min-w-[180px] rounded-lg bg-[#1a1f2e] px-5 py-2.5 text-lg font-medium text-white placeholder-gray-500 border-2 border-[#3a4558] hover:border-[#4a5568] focus:border-[#5a6578] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    />
    <div
      v-if="display"
      class="pointer-events-none absolute inset-0 flex items-center pl-5 text-lg font-medium text-white"
    >
      {{ display }}
    </div>
  </div>
</template>

<style scoped>
/* Hide native date text */
input[type="date"]::-webkit-datetime-edit,
input[type="date"]::-webkit-datetime-edit-fields-wrapper {
  opacity: 0;
}

/* Calendar icon */
input[type="date"]::-webkit-calendar-picker-indicator {
  position: absolute;
  right: 1rem;
  cursor: pointer;
  opacity: 0.7;
  filter: invert(1);
}

input[type="date"]::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
}
</style>
