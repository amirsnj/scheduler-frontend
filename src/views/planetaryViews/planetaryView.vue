<template>
  <div class="bg-[#111522] px-4 sm:px-8 lg:px-14 py-6 min-h-screen">
    <!-- Header -->
    <PageHeader @navigate="handleNavigate" />

    <!-- Current Hour Display -->
    <div class="flex justify-center mt-16 sm:mt-5">
      <LoadingState v-if="isLoading" />
      <ErrorState v-else-if="hasError" :error="errorMessage" />
      <CurrentHourDisplay 
        v-else-if="activeHourData"
        :hour-data="activeHourData"
        :progress="hourProgress"
        :progress-color="progressColor"
        :get-planet-image="getPlanetImage"
        :format-time="formatTime"
      />
      <EmptyHourState v-else />
    </div>

    <!-- Controls -->
    <ControlsPanel
      v-model:selected-date="selectedDate"
      v-model:selected-option="selectedOption"
      :time-options="timeOptions"
      @apply="handleApplyFilters"
    />

    <!-- Planetary Days Scroll -->
    <PlanetaryDaysScroll
      :days="planetaryDaysData"
      :is-today="isToday"
      :get-planet-icon="getPlanetIcon"
      :current-date="currentDate"
      @select="handleDaySelect"
    />

    <!-- Time Cards -->
    <TimeCardsSection
      :day-hours="dayHours"
      :night-hours="nightHours"
      :get-planet-icon="getPlanetIcon"
      :current-time="formattedCurrentTime"
      :current-date="currentDate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import type { SelectOption } from "@/components/planetary/selectComponent.vue";
import { usePlanetaryHours } from "@/composables/usePlanetaryHours";
import PageHeader from "@/components/planetary/PageHeader.vue";
import ControlsPanel from "@/components/planetary/ControlsPanel.vue";
import PlanetaryDaysScroll from "@/components/planetary/PlanetaryDaysScroll.vue";
import TimeCardsSection from "@/components/planetary/TimeCardsSection.vue";
import CurrentHourDisplay from "@/components/planetary/CurrentHourDisplay.vue";
import LoadingState from "@/components/planetary/LoadingState.vue";
import ErrorState from "@/components/planetary/ErrorState.vue";
import EmptyHourState from "@/components/planetary/EmptyHourState.vue";

/* ==================== Constants & Configuration ==================== */
const LOCATION = { lat: 36.2972, lon: 59.6067, city: "Mashhad" };
const UPDATE_INTERVAL = 60000; // 1 minute

const TIME_OPTIONS: SelectOption[] = [
  { value: "daily-all", label: "Daily (All hours)" },
  { value: "daily-business", label: "Daily (Business hours)" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

/* ==================== Reactive State ==================== */
const router = useRouter();
const selectedDate = ref(new Date().toISOString().split("T")[0]);
const selectedOption = ref("daily-all");
const currentDate = ref(selectedDate.value);
const currentTime = ref("");
const updateTimer = ref<number | null>(null);

/* ==================== Composable Hook ==================== */
const {
  hoursData,
  activeHourData,
  hourProgress,
  progressColor,
  isLoading,
  hasError,
  errorMessage,
  fetchPlanetaryHours,
  updateCurrentHour,
  formatTime,
  getPlanetImage,
  getPlanetIcon,
} = usePlanetaryHours();

/* ==================== Computed Properties ==================== */
const timeOptions = computed(() => TIME_OPTIONS);

const formattedCurrentTime = computed(() => currentTime.value);

const dayHours = computed(() => hoursData.value.slice(0, 12));

const nightHours = computed(() => hoursData.value.slice(12, 24));

const planetaryDaysData = computed(() => {
  const planetMap: Record<number, string> = {
    0: "sun",
    1: "moon",
    2: "mars",
    3: "mercury",
    4: "jupiter",
    5: "venus",
    6: "saturn",
  };

  // Always base on today's actual date, not the selected date
  const baseDate = new Date();
  const start = new Date(baseDate);
  start.setDate(baseDate.getDate() - 1);

  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      planet: planetMap[date.getDay()],
      day: date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });
});

/* ==================== Methods ==================== */
const updateCurrentTime = (): void => {
  const now = new Date();
  currentTime.value = now.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const isToday = (itemDate: string): boolean => {
  // Compare with actual today's date, not selected date
  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  return itemDate === today;
};

const handleNavigate = (): void => {
  router.push("/");
};

const handleApplyFilters = async (): Promise<void> => {
  currentDate.value = selectedDate.value;
  await fetchPlanetaryHours(
    selectedDate.value,
    LOCATION.lat,
    LOCATION.lon,
    LOCATION.city,
  );
};

const handleDaySelect = async (date: string): Promise<void> => {
  selectedDate.value = date;
  currentDate.value = date;
  await fetchPlanetaryHours(
    date,
    LOCATION.lat,
    LOCATION.lon,
    LOCATION.city,
  );
};

const startAutoUpdate = (): void => {
  stopAutoUpdate();
  updateTimer.value = window.setInterval(() => {
    updateCurrentTime();
    updateCurrentHour();
  }, UPDATE_INTERVAL);
};

const stopAutoUpdate = (): void => {
  if (updateTimer.value) {
    clearInterval(updateTimer.value);
    updateTimer.value = null;
  }
};

/* ==================== Watch for Reactive Changes ==================== */
watch(selectedDate, (newDate) => {
  selectedDate.value = newDate;
});

/* ==================== Lifecycle Hooks ==================== */
onMounted(async () => {
  updateCurrentTime();
  await fetchPlanetaryHours(
    selectedDate.value,
    LOCATION.lat,
    LOCATION.lon,
    LOCATION.city,
  );
  startAutoUpdate();
});

onUnmounted(() => {
  stopAutoUpdate();
});
</script>
