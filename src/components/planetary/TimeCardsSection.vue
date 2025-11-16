<template>
  <div
    class="mt-20 sm:mt-40 flex flex-col md:flex-row justify-center md:justify-around gap-8 md:gap-0"
  >
    <TimeCardComponent
      title="Day Time"
      :items="dayHours"
      :get-planet-icon="getPlanetIcon"
      :currentTime="currentTime"
      :current-date="currentDate"
    />
    <TimeCardComponent
      title="Night Time"
      :items="nightHours"
      :get-planet-icon="getPlanetIcon"
      :currentTime="currentTime"
      :current-date="currentDate"
    />
  </div>
</template>

<script setup lang="ts">
import TimeCardComponent from "@/components/planetary/timeCardComponent.vue";

interface HourData {
  hour: number;
  planet: string;
  start_time: string;
  end_time: string;
}

interface Props {
  dayHours: HourData[];
  nightHours: HourData[];
  getPlanetIcon: (planet: string) => string;
  currentTime: string;
  currentDate: string;
}

defineProps<Props>();
</script>
