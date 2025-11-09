<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

export interface SelectOption {
  value: string | number;
  label: string;
}

interface Props {
  modelValue: string | number;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string | number): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select an option",
  disabled: false,
});

const emit = defineEmits<Emits>();

const isOpen = ref(false);

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue);
  return selected?.label || props.placeholder;
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const selectOption = (value: string | number) => {
  emit("update:modelValue", value);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest(".select-wrapper")) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative inline-block select-wrapper">
    <button
      type="button"
      @click="toggleDropdown"
      :disabled="disabled"
      class="flex w-full items-center justify-between gap-4 px-6 py-[10px] bg-[#1a1f2e] border-2 border-[#3a4558] rounded-lg text-white text-lg font-medium hover:border-[#4a5568] focus:outline-none focus:border-[#5a6578] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[270px]"
    >
      <span class="text-left">{{ selectedLabel }}</span>
      <svg
        class="w-5 h-5 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isOpen"
        class="absolute top-full left-0 right-0 mt-2 bg-[#1a1f2e] border-2 border-[#3a4558] rounded-lg shadow-lg overflow-hidden z-10"
      >
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          @click="selectOption(option.value)"
          class="w-full px-6 py-3 text-left text-white hover:bg-[#2a3544] transition-colors focus:outline-none focus:bg-[#2a3544]"
          :class="{ 'bg-[#2a3544]': option.value === modelValue }"
        >
          {{ option.label }}
        </button>
      </div>
    </Transition>
  </div>
</template>
