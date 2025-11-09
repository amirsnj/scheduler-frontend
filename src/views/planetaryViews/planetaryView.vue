<template>
  <div class="bg-[#111522] px-4 sm:px-8 lg:px-14 py-6 min-h-screen">
    <!-- Header -->
    <header class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="mb-2.5 cursor-pointer" @click="router.push('/')">
          <svg
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            stroke-width="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </div>
        <h1
          class="text-2xl sm:text-[32px] text-white font-medium text-shadow-amber-50 text-shadow-xs"
        >
          Planetary Hours
        </h1>
        <img
          src="../../assets/planet-icons/main-icon.svg"
          alt="Planetary Icon"
          class="w-8 h-8 md:w-16 md:h-16"
          draggable="false"
        />
      </div>
      <div class="flex items-center gap-1.5">
        <svg
          width="20"
          height="28"
          viewBox="0 0 26 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-5 h-7 sm:w-6.5 sm:h-9"
        >
          <path
            d="M0.00676897 13.1837C0.00676897 5.89981 5.82817 0 13.0034 0C20.1786 0 26 5.89981 26 13.1837C26 21.5231 17.8636 31.5192 14.4655 35.3289C13.6668 36.2237 12.3332 36.2237 11.5345 35.3289C8.13642 31.5192 0 21.5231 0 13.1837H0.00676897ZM13.0034 17.8951C15.3929 17.8951 17.3356 15.8889 17.3356 13.4214C17.3356 10.9538 15.3929 8.94757 13.0034 8.94757C10.6139 8.94757 8.67118 10.9538 8.67118 13.4214C8.67118 15.8889 10.6139 17.8951 13.0034 17.8951Z"
            fill="white"
          />
        </svg>
        <p class="text-lg sm:text-2xl text-white">Mashhad</p>
      </div>
    </header>

    <!-- Current Hour Display -->
    <div class="flex justify-center mt-10 sm:mt-20">
      <div v-if="loading" class="text-white text-lg sm:text-xl">Loading...</div>
      <div v-else-if="error" class="text-red-500 text-lg sm:text-xl">
        {{ error }}
      </div>
      <div
        v-else-if="currentHourData"
        class="space-y-6 sm:space-y-8 text-center"
      >
        <div
          class="relative w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] mx-auto"
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 300 300"
            class="absolute inset-0"
          >
            <!-- Glow effect -->
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <!-- Background circle -->
            <circle
              cx="150"
              cy="150"
              r="140"
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              stroke-width="10"
            />
            <!-- Progress arc -->
            <path
              :d="arcPath"
              fill="none"
              :stroke="progressColor"
              stroke-width="12"
              stroke-linecap="round"
              filter="url(#glow)"
            />
          </svg>
          <!-- Center planet display -->
          <div class="absolute inset-0 flex items-center justify-center">
            <img
              :src="getPlanetImage(currentHourData.planet)"
              :alt="`${currentHourData.planet} Planet`"
              class="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-full mix-blend-lighten bg-transparent shadow-[0_0_25px_3px_rgba(255,321,197,0.6)]"
              draggable="false"
            />
          </div>
        </div>
        <!-- Info display -->
        <div class="space-y-1 sm:space-y-2">
          <div class="text-white text-2xl sm:text-3xl font-bold capitalize">
            {{ currentHourData.planet }}
          </div>
          <div class="text-white text-lg sm:text-xl">
            {{ formatTime(currentHourData.start_time) }} -
            {{ formatTime(currentHourData.end_time) }}
          </div>
        </div>
      </div>
      <div v-else class="text-gray-400 text-lg sm:text-xl">
        No active hour found for current time
      </div>
    </div>

    <!-- Controls -->
    <div class="flex flex-col sm:flex-row gap-2 mx-4 sm:mx-10 mt-6 sm:mt-8">
      <DatePickerComponent v-model="selectedDate" />
      <SelectComponent v-model="selectedOption" :options="timeOptions" />
      <ButtonComponent size="md" @click="handleOk">OK</ButtonComponent>
    </div>

    <!-- Planetary Days Scroll -->
    <HorizonalScrollComponent
      container-class="gap-6 sm:gap-9 mx-4 sm:mx-10 bg-[#7D7D7D]/10 p-4 sm:p-5 rounded-[40px] mt-6 sm:mt-8"
      :scroll-speed="1.5"
      :wheel-scroll-speed="2"
    >
      <div
        v-for="(item, index) in planetaryDays"
        :key="index"
        :class="{
          'shadow-[0_0_25px_3px_rgba(295,192,64,0.5)]': isToday(item.date),
        }"
        class="h-40 w-32 sm:h-56 sm:w-48 bg-[#293356] rounded-[30px] flex-shrink-0 flex flex-col gap-2 items-center justify-center text-white"
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
      </div>
    </HorizonalScrollComponent>

    <!-- Time Cards -->
    <div
      class="mt-20 sm:mt-40 flex flex-col md:flex-row justify-center md:justify-around gap-8 md:gap-0"
    >
      <TimeCardComponent
        title="Day Time"
        :items="hoursData.slice(0, 12)"
        :get-planet-icon="getPlanetIcon"
        :currentTime="currentTime"
        :current-date="currentDate"
      />
      <TimeCardComponent
        title="Night Time"
        :items="hoursData.slice(12, 24)"
        :get-planet-icon="getPlanetIcon"
        :currentTime="currentTime"
        :current-date="currentDate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { debounce } from "lodash-es";
import DatePickerComponent from "@/components/planetary/datePickerComponent.vue";
import SelectComponent, {
  type SelectOption,
} from "@/components/planetary/selectComponent.vue";
import ButtonComponent from "@/components/planetary/buttonComponent.vue";
import HorizonalScrollComponent from "@/components/planetary/horizonalScrollComponent.vue";
import TimeCardComponent from "@/components/planetary/timeCardComponent.vue";
import { BASE_URL } from "@/api/api_constant";
import { useRouter } from "vue-router";

/* ----------------------------- Type Definitions ---------------------------- */
interface HourData {
  hour: number;
  planet: string;
  start_time: string;
  end_time: string;
}

interface PlanetaryDay {
  planet: string;
  day: string;
  date: string;
}

interface CartesianCoords {
  x: number;
  y: number;
}

const PlanetDay = {
  Sun: "sun",
  Moon: "moon",
  Mars: "mars",
  Mercury: "mercury",
  Jupiter: "jupiter",
  Venus: "venus",
  Saturn: "saturn",
} as const;

type PlanetDay = (typeof PlanetDay)[keyof typeof PlanetDay];

/* ----------------------------- Reactive States ----------------------------- */
const progress = ref(0);
const currentTime = ref("");
const currentDate = ref(new Date().toISOString().split("T")[0]);
const currentHourData = ref<HourData | null>(null);
const hoursData = ref<HourData[]>([]);
const loading = ref(true);
const error = ref("");
const selectedDate = ref(currentDate.value);
const selectedOption = ref("daily-all");

/* ----------------------------- Static Options ------------------------------ */
const timeOptions: SelectOption[] = [
  { value: "daily-all", label: "Daily (All hours)" },
  { value: "daily-business", label: "Daily (Business hours)" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const router = useRouter();

/* ------------------------------ Util Functions ----------------------------- */
const formatDate = (date: Date, opts: Intl.DateTimeFormatOptions): string =>
  date.toLocaleString("en-US", opts);

const formatTime = (isoString: string): string =>
  formatDate(new Date(isoString), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const getPlanetImage = (planet: string): string =>
  new URL(`../../assets/planet_images/${planet}.png`, import.meta.url).href;

const getPlanetIcon = (planet: string): string =>
  new URL(`../../assets/planet-icons/${planet}-icon.svg`, import.meta.url).href;

/* ----------------------------- Core Functions ------------------------------ */
const fetchPlanetaryHours = async (): Promise<void> => {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch(
      `${BASE_URL}/api/planetary/hours/?lat=36.2972&lon=59.6067&city=Mashhad&date=${selectedDate.value}`,
    );
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    hoursData.value = await res.json();
    updateCurrentHour();
  } catch (err) {
    error.value =
      err instanceof Error ? err.message : "An unknown error occurred";
  } finally {
    loading.value = false;
  }
};

const updateCurrentHour = (): void => {
  const now = new Date();
  const activeHour = findCurrentHour(hoursData.value, now);
  currentHourData.value = activeHour;
  if (activeHour) {
    progress.value = calculateProgress(activeHour, now);
  } else {
    progress.value = 0;
  }
};

const findCurrentHour = (data: HourData[], now: Date): HourData | null =>
  data.find(({ start_time, end_time }) => {
    const start = new Date(start_time).getTime();
    const end = new Date(end_time).getTime();
    const current = now.getTime();
    return current >= start && current < end;
  }) ?? null;

const calculateProgress = (hourData: HourData, now: Date): number => {
  const current = now.getTime();
  const start = new Date(hourData.start_time).getTime();
  const end = new Date(hourData.end_time).getTime();
  if (current < start) return 0;
  if (current >= end) return 100;
  return ((current - start) / (end - start)) * 100;
};

const handleOk = (): void => {
  currentDate.value = selectedDate.value;
  fetchPlanetaryHours();
};

/* ---------------------------- Visualization Logic -------------------------- */
const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angle: number,
): CartesianCoords => {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
};

const arcPath = computed((): string => {
  if (progress.value < 0.5) return "";
  const radius = 140;
  const cx = 150;
  const cy = 150;
  const startAngle = -90;
  const angle = (progress.value / 100) * 360;
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle + angle);
  const largeArcFlag = angle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
});

const progressColor = computed((): string => {
  const start = { r: 154, g: 255, b: 0 };
  const end = { r: 255, g: 140, b: 0 };
  const ratio = progress.value / 100;
  const r = Math.round(start.r + (end.r - start.r) * ratio);
  const g = Math.round(start.g + (end.g - start.g) * ratio);
  const b = Math.round(start.b + (end.b - start.b) * ratio);
  return `rgb(${r}, ${g}, ${b})`;
});

/* ----------------------------- Helper Functions ---------------------------- */
const planetaryDays = computed((): PlanetaryDay[] => {
  const planetMap: Record<number, PlanetDay> = {
    0: PlanetDay.Sun,
    1: PlanetDay.Moon,
    2: PlanetDay.Mars,
    3: PlanetDay.Mercury,
    4: PlanetDay.Jupiter,
    5: PlanetDay.Venus,
    6: PlanetDay.Saturn,
  };

  const baseDate = new Date(currentDate.value);
  const start = new Date(baseDate);
  start.setDate(baseDate.getDate() - 1);

  return Array.from({ length: 8 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      planet: planetMap[date.getDay()],
      day: formatDate(date, { weekday: "short" }).toUpperCase(),
      date: formatDate(date, { month: "short", day: "numeric" }),
    };
  });
});

const isToday = (itemDate: string): boolean => {
  const today = formatDate(new Date(currentDate.value), {
    month: "short",
    day: "numeric",
  });
  return itemDate === today;
};

/* ------------------------------ Initialization ----------------------------- */
const initialize = debounce(async () => {
  const now = new Date();
  currentTime.value = formatDate(now, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  await fetchPlanetaryHours();
}, 300);

onMounted(() => {
  initialize();
});
</script>
