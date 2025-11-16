<template>
  <div class="flex flex-col sm:flex-row gap-2 mx-4 sm:mx-10 mt-16 sm:mt-24 sm:w-fit">
    <input
      type="date"
      :value="selectedDate"
      @input="handleDateChange"
      class="peer w-full sm:w-auto sm:min-w-[180px] rounded-lg bg-[#1a1f2e] px-5 py-2.5 text-lg font-medium text-white placeholder-gray-500 border-2 border-[#3a4558] hover:border-[#4a5568] focus:border-[#5a6578] focus:outline-none transition-colors cursor-pointer"
    />
    <select
      :value="selectedOption"
      @change="handleOptionChange"
      class="w-full sm:w-auto sm:min-w-[200px] rounded-lg bg-[#1a1f2e] px-5 py-2.5 text-lg font-medium text-white border-2 border-[#3a4558] hover:border-[#4a5568] focus:border-[#5a6578] focus:outline-none transition-colors cursor-pointer"
    >
      <option
        v-for="option in timeOptions"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <button
      @click="apply"
      type="button"
      class="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors min-w-[100px]"
    >
      OK
    </button>
  </div>
</template>

<script setup lang="ts">
import type { SelectOption } from "@/components/planetary/selectComponent.vue";

interface Props {
  selectedDate: string;
  selectedOption: string;
  timeOptions: SelectOption[];
}

interface Emits {
  (e: "update:selectedDate", v: string): void;
  (e: "update:selectedOption", v: string): void;
  (e: "apply"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleDateChange = (e: Event): void => {
  const target = e.target as HTMLInputElement;
  emit("update:selectedDate", target.value);
};

const handleOptionChange = (e: Event): void => {
  const target = e.target as HTMLSelectElement;
  emit("update:selectedOption", target.value);
};

const apply = (): void => {
  emit("apply");
};
</script>
