<template>
  <div class="flex justify-center mt-16 sm:mt-20">
    <div class="space-y-6 sm:space-y-8 text-center">
      <div class="relative w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] mx-auto">
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
            :src="getPlanetImage(hourData.planet)"
            :alt="`${hourData.planet} Planet`"
            class="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-full mix-blend-lighten bg-transparent shadow-[0_0_25px_3px_rgba(255,321,197,0.6)]"
            draggable="false"
          />
        </div>
      </div>
      <!-- Info display -->
      <div class="space-y-1 sm:space-y-2">
        <div class="text-white text-2xl sm:text-3xl font-bold capitalize">
          {{ hourData.planet }}
        </div>
        <div class="text-white text-lg sm:text-xl">
          {{ formatTime(hourData.start_time) }} -
          {{ formatTime(hourData.end_time) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface HourData {
  hour: number;
  planet: string;
  start_time: string;
  end_time: string;
}

interface Props {
  hourData: HourData;
  progress: number;
  progressColor: string;
  getPlanetImage: (planet: string) => string;
  formatTime: (isoString: string) => string;
}

const props = defineProps<Props>();

const polarToCartesian = (
  cx: number,
  cy: number,
  radius: number,
  angle: number,
) => {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
};

const arcPath = computed((): string => {
  if (props.progress < 0.5) return "";
  const radius = 140;
  const cx = 150;
  const cy = 150;
  const startAngle = -90;
  const angle = (props.progress / 100) * 360;
  const start = polarToCartesian(cx, cy, radius, startAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle + angle);
  const largeArcFlag = angle > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
});
</script>
