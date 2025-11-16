import { ref, computed, shallowRef } from "vue";
import { BASE_URL } from "@/api/api_constant";

// Import planet images
import sunImage from "@/assets/planet_images/sun.png";
import moonImage from "@/assets/planet_images/moon.png";
import marsImage from "@/assets/planet_images/mars.png";
import mercuryImage from "@/assets/planet_images/mercury.png";
import jupiterImage from "@/assets/planet_images/jupiter.png";
import venusImage from "@/assets/planet_images/venus.png";
import saturnImage from "@/assets/planet_images/saturn.png";

// Import planet icons
import sunIcon from "@/assets/planet-icons/sun-icon.svg";
import moonIcon from "@/assets/planet-icons/moon-icon.svg";
import marsIcon from "@/assets/planet-icons/mars-icon.svg";
import mercuryIcon from "@/assets/planet-icons/mercury-icon.svg";
import jupiterIcon from "@/assets/planet-icons/jupiter-icon.svg";
import venusIcon from "@/assets/planet-icons/venus-icon.svg";
import saturnIcon from "@/assets/planet-icons/saturn-icon.svg";

/**
 * Composable for managing planetary hours data and calculations
 * Provides reactive state management, fetching, and formatting utilities
 */

interface HourData {
  hour: number;
  planet: string;
  start_time: string;
  end_time: string;
}

interface CartesianCoords {
  x: number;
  y: number;
}

export function usePlanetaryHours() {
  /* ==================== Reactive State ==================== */
  const hoursData = shallowRef<HourData[]>([]);
  const activeHourData = ref<HourData | null>(null);
  const hourProgress = ref(0);
  const isLoading = ref(false);
  const hasError = ref(false);
  const errorMessage = ref("");
  const retryCount = ref(0);

  /* ==================== Computed Properties ==================== */
  const progressColor = computed((): string => {
    const start = { r: 154, g: 255, b: 0 };
    const end = { r: 255, g: 140, b: 0 };
    const ratio = hourProgress.value / 100;
    const r = Math.round(start.r + (end.r - start.r) * ratio);
    const g = Math.round(start.g + (end.g - start.g) * ratio);
    const b = Math.round(start.b + (end.b - start.b) * ratio);
    return `rgb(${r}, ${g}, ${b})`;
  });

  /* ==================== Utility Functions ==================== */
  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getPlanetImage = (planet: string): string => {
    const images: Record<string, string> = {
      sun: sunImage,
      moon: moonImage,
      mars: marsImage,
      mercury: mercuryImage,
      jupiter: jupiterImage,
      venus: venusImage,
      saturn: saturnImage,
    };
    return images[planet] || "";
  };

  const getPlanetIcon = (planet: string): string => {
    const icons: Record<string, string> = {
      sun: sunIcon,
      moon: moonIcon,
      mars: marsIcon,
      mercury: mercuryIcon,
      jupiter: jupiterIcon,
      venus: venusIcon,
      saturn: saturnIcon,
    };
    return icons[planet] || "";
  };

  /* ==================== Core Logic Functions ==================== */
  const polarToCartesian = (
    cx: number,
    cy: number,
    radius: number,
    angle: number,
  ): CartesianCoords => {
    const rad = (angle * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const findCurrentHour = (data: HourData[], now: Date): HourData | null => {
    return (
      data.find(({ start_time, end_time }) => {
        const start = new Date(start_time).getTime();
        const end = new Date(end_time).getTime();
        const current = now.getTime();
        return current >= start && current < end;
      }) ?? null
    );
  };

  const calculateProgress = (hourData: HourData, now: Date): number => {
    const current = now.getTime();
    const start = new Date(hourData.start_time).getTime();
    const end = new Date(hourData.end_time).getTime();
    if (current < start) return 0;
    if (current >= end) return 100;
    return ((current - start) / (end - start)) * 100;
  };

  const updateCurrentHour = (): void => {
    const now = new Date();
    const activeHour = findCurrentHour(hoursData.value, now);
    activeHourData.value = activeHour;
    if (activeHour) {
      hourProgress.value = calculateProgress(activeHour, now);
    } else {
      hourProgress.value = 0;
    }
  };

  /* ==================== API Methods ==================== */
  const fetchPlanetaryHours = async (
    date: string,
    lat: number,
    lon: number,
    city: string,
    maxRetries = 3,
  ): Promise<void> => {
    isLoading.value = true;
    hasError.value = false;
    errorMessage.value = "";
    retryCount.value = 0;

    const attemptFetch = async (): Promise<void> => {
      try {
        const url = new URL(`${BASE_URL}/api/planetary/`);
        url.searchParams.append("lat", lat.toString());
        url.searchParams.append("lon", lon.toString());
        url.searchParams.append("city", city);
        url.searchParams.append("date", date);

        const response = await fetch(url.toString());

        if (!response.ok) {
          throw new Error(
            `HTTP Error: ${response.status} - ${response.statusText}`,
          );
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Invalid response format: expected array");
        }

        hoursData.value = data;
        updateCurrentHour();
        hasError.value = false;
      } catch (err) {
        retryCount.value++;

        if (retryCount.value < maxRetries) {
          // Exponential backoff: 1s, 2s, 4s
          const delay = Math.pow(2, retryCount.value - 1) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return attemptFetch();
        }

        hasError.value = true;
        errorMessage.value =
          err instanceof Error
            ? err.message
            : "Failed to fetch planetary hours";
      }
    };

    try {
      await attemptFetch();
    } finally {
      isLoading.value = false;
    }
  };

  return {
    // State
    hoursData,
    activeHourData,
    hourProgress,
    progressColor,
    isLoading,
    hasError,
    errorMessage,

    // Methods
    fetchPlanetaryHours,
    updateCurrentHour,
    formatTime,
    getPlanetImage,
    getPlanetIcon,
    findCurrentHour,
    calculateProgress,
    polarToCartesian,
  };
}
