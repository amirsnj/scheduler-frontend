<template>
  <header class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <button
        type="button"
        @click="navigate"
        class="mb-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Go back to home"
      >
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
      </button>
      <h1
        class="text-2xl sm:text-[32px] text-white font-medium text-shadow-amber-50 text-shadow-xs"
      >
        Planetary Hours
      </h1>
      <img
        src="@/assets/planet-icons/main-icon.svg"
        alt="Planetary Icon"
        class="w-8 h-8 md:w-16 md:h-16"
        draggable="false"
      />
    </div>
    <div class="flex items-center gap-1.5" aria-label="Location indicator">
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
</template>

<script setup lang="ts">
const emit = defineEmits<{
  navigate: [];
}>();

const navigate = (): void => {
  emit("navigate");
};
</script>
