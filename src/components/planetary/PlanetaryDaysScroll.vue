<template>
  <HorizonalScrollComponent
    container-class="gap-6 sm:gap-9 mx-4 sm:mx-10 bg-[#7D7D7D]/10 p-4 sm:p-5 rounded-[40px] mt-6 sm:mt-8"
    :scroll-speed="1.5"
    :wheel-scroll-speed="2"
  >
    <button
      v-for="(item, index) in days"
      :key="index"
      type="button"
      @click="selectDay(item)"
      :class="{
        'shadow-[0_0_25px_3px_rgba(295,192,64,0.5)]': isToday(item.date),
        'ring-2 ring-yellow-400': isSelected(item.date),
      }"
      class="h-40 w-32 sm:h-56 sm:w-48 bg-[#293356] rounded-[30px] flex-shrink-0 flex flex-col gap-2 items-center justify-center text-white transition-all duration-200 hover:bg-[#3a4570] cursor-pointer"
    >
      <img
        :src="getPlanetIcon(item.planet)"
        :alt="`${item.planet} Icon`"
        class="w-16 sm:w-20"
        draggable="false"
      />
      <div class="flex flex-col items-center">
        <h2 class="text-lg sm:text-[22px] font-extrabold">{{ item.day }}</h2>
        <p class="text-base sm:text-[20px] font-light leading-tight">
          {{ item.date }}
        </p>
      </div>
    </button>
  </HorizonalScrollComponent>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import HorizonalScrollComponent from "@/components/planetary/horizonalScrollComponent.vue";

interface PlanetaryDay {
  planet: string;
  day: string;
  date: string;
}

interface Props {
  days: PlanetaryDay[];
  isToday: (date: string) => boolean;
  getPlanetIcon: (planet: string) => string;
  currentDate?: string;
}

interface Emits {
  (e: "select", date: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  currentDate: "",
});

const emit = defineEmits<Emits>();

const selectedDate = ref(props.currentDate);

// Watch currentDate prop to update selectedDate when parent changes it
watch(() => props.currentDate, (newDate) => {
  selectedDate.value = newDate;
});

const isSelected = computed(() => (date: string) => {
  // Convert the display date format to YYYY-MM-DD for comparison
  const [month, day] = date.split(" ");
  const currentYear = new Date().getFullYear();
  const dateStr = `${currentYear}-${getMonthNumber(month)}-${day.padStart(2, "0")}`;
  return selectedDate.value === dateStr;
});

const selectDay = (item: PlanetaryDay): void => {
  // Calculate the actual date from the displayed date
  const [month, day] = item.date.split(" ");
  const currentYear = new Date().getFullYear();
  const dateStr = `${currentYear}-${getMonthNumber(month)}-${day.padStart(2, "0")}`;
  
  selectedDate.value = dateStr;
  emit("select", dateStr);
};

const getMonthNumber = (month: string): string => {
  const months: Record<string, string> = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };
  return months[month] || "01";
};
</script>
