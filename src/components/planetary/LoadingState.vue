<template>
  <div class="text-white text-lg sm:text-xl">
    <LoadingSpinner v-if="isVisible" />
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from "@/components/scheduler/mainContentComponents/LoadingSpinner.vue";

interface Props {
  isVisible?: boolean;
}

withDefaults(defineProps<Props>(), {
  isVisible: true,
});
</script>
