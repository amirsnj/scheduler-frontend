<template>
  <!--
    Main container:
    - Mobile default: Full width (w-full), max-width of 480px (max-w-md), and centered (mx-auto).
    - Desktop (md+): Reverts to the original fixed width (max-w-[540px]) and original horizontal padding.
  -->
  <div
    class="flex flex-col px-4 bg-[#7D7D7D]/10 w-full max-w-md md:max-w-[540px] mx-auto rounded-[40px] md:px-2.5"
  >
    <!-- Title: Reduced size and margin on mobile, restored on desktop -->
    <h2
      class="text-2xl mx-auto text-white font-bold mt-6 mb-4 md:text-3xl md:mt-11 md:mb-7"
    >
      {{ title }}
    </h2>

    <div class="flex flex-col mb-7 gap-2.5">
      <!-- Item mapping -->
      <div
        v-for="item in items"
        :key="item.hour"
        class="flex items-center justify-between px-4 py-4 w-full rounded-[20px] bg-[#111522] transition-shadow duration-300"
        :class="{
          'shadow-[0_0_25px_1px_rgba(295,192,64,0.5)]': isCurrent(
            formatTime(item.start_time),
            formatTime(item.end_time),
            currentTime,
          ),
        }"
      >
        <div class="flex items-center gap-4 md:gap-7">
          <!-- Hour Display: Smaller font and width on mobile, original size on desktop -->
          <div
            class="text-xl text-white font-bold w-8 text-center md:text-[28px] md:w-10"
          >
            {{ item.hour }}
          </div>

          <!-- Planet Icon and Name -->
          <div class="flex items-center gap-1">
            <!-- Icon: Assuming a typical 32px icon, we scale it down slightly for mobile -->
            <img
              :src="getPlanetIcon(item.planet)"
              :alt="item.planet"
              draggable="false"
              class="w-6 h-6 md:w-8 md:h-8"
            />
            <!-- Planet Name: Smaller font on mobile, original size on desktop. Reduced margin for better vertical alignment on mobile. -->
            <span
              class="text-lg text-white capitalize md:text-[26px] md:mt-2"
              >{{ item.planet }}</span
            >
          </div>
        </div>

        <!-- Time Range: Smaller font on mobile, original size on desktop -->
        <div>
          <span class="text-base text-white md:text-2xl">{{
            getTimeRange(item)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TimeItem {
  hour: number;
  planet: string;
  start_time: string;
  end_time: string;
}

interface Props {
  title?: string;
  items: TimeItem[];
  getPlanetIcon: (planet: string) => string;
  currentTime: string;
  currentDate: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: "Day Time",
});

const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getTimeRange = (item: TimeItem): string => {
  return `${formatTime(item.start_time)} - ${formatTime(item.end_time)}`;
};

const isCurrent = (start: string, end: string, current: string): boolean => {
  const toSeconds = (time: string): number => {
    // Handling case where time might not include seconds
    const [h, m, s = "0"] = time.split(":");
    return Number(h) * 3600 + Number(m) * 60 + Number(s);
  };

  const startSec = toSeconds(start);
  const endSec = toSeconds(end);
  const currentSec = toSeconds(current);
  const today = new Date().toISOString().split("T")[0];

  // Logic to handle time ranges that cross midnight (e.g., 23:00 - 01:00)
  if (endSec < startSec) {
    return (
      (currentSec >= startSec || currentSec < endSec) &&
      props.currentDate === today
    );
  }
  return (
    currentSec >= startSec && currentSec < endSec && props.currentDate === today
  );
};
</script>
