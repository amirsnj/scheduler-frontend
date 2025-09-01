<template>
  <div class="mt-2">
    <button
      v-if="!isAdding"
      class="px-3 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer text-xs rounded transition-colors"
      @click="startAdding"
    >
      + {{ addTagText }}
    </button>
    <div
      v-else
      class="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-200"
    >
      <input
        ref="inputRef"
        v-model="newTagName"
        class="bg-transparent border-none outline-none text-xs text-gray-700 placeholder-gray-400 w-20"
        :placeholder="addTagText"
        maxlength="30"
        @keydown="handleKeydown"
      />
      <button
        @click="confirmAdd"
        class="p-0.5 text-green-600 hover:bg-green-100 rounded transition-colors"
        :disabled="!newTagName.trim()"
        :class="{ 'opacity-50 cursor-not-allowed': !newTagName.trim() }"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <polyline points="20,6 9,17 4,12" />
        </svg>
      </button>
      <button
        @click="cancelAdd"
        class="p-0.5 text-red-600 hover:bg-red-100 rounded transition-colors"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

interface Props {
  addTagText: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "add-tag": [name: string];
}>();

const isAdding = ref(false);
const newTagName = ref("");
const inputRef = ref<HTMLInputElement>();

const startAdding = async () => {
  isAdding.value = true;
  newTagName.value = "";
  await nextTick();
  inputRef.value?.focus();
};

const confirmAdd = () => {
  if (newTagName.value.trim()) {
    emit("add-tag", newTagName.value.trim());
  }
  resetState();
};

const cancelAdd = () => {
  resetState();
};

const resetState = () => {
  isAdding.value = false;
  newTagName.value = "";
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    confirmAdd();
  } else if (event.key === "Escape") {
    cancelAdd();
  }
};
</script>
