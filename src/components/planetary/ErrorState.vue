<template>
  <div class="text-red-500 text-lg sm:text-xl" role="alert">
    <p>{{ error }}</p>
    <p class="text-sm mt-2 text-red-400">
      Please try again or contact support if the issue persists.
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  error: string;
}

withDefaults(defineProps<Props>(), {
  error: "An error occurred while loading planetary hours",
});
</script>
