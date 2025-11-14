<template>
  <div
    class="flex flex-wrap justify-center gap-2 mb-4 md:flex-nowrap"
    :class="{ 'flex-row-reverse': isRtl }"
  >
    <button
      class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      @click="$emit('previous-day')"
    >
      {{ previousDayText }}
    </button>
    <button
      class="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
      @click="$emit('today')"
    >
      {{ todayText }}
    </button>
    <button
      class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
      @click="$emit('next-day')"
    >
      {{ nextDayText }}
    </button>
    <input
      type="date"
      :value="selectedDate"
      class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      @change="handleDateChange"
    />
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue';
// Props
const props = defineProps<{
  selectedDate: string;
  isRtl: boolean;
  previousDayText: string;
  todayText: string;
  nextDayText: string;
}>();

const { selectedDate, isRtl, previousDayText, todayText, nextDayText } = toRefs(props);

// Emits
const emit = defineEmits<{
  "previous-day": [];
  today: [];
  "next-day": [];
  "update:selectedDate": [date: string];
}>();

// Methods
const handleDateChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:selectedDate", target.value);
};
</script>
