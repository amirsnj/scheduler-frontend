<template>
  <div>
    <!-- Add new list button -->
    <div v-if="!isAdding" class="mt-1">
      <button
        class="flex items-center px-3 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start"
        @click="startAdding"
      >
        <svg
          class="mr-2"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        {{ addNewListText }}
      </button>
    </div>

    <!-- Add new list input -->
    <div v-else class="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
      <div class="flex items-center gap-2">
        <!-- Random color indicator -->
        <div class="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>

        <!-- Input field -->
        <input
          ref="inputRef"
          v-model="newListName"
          class="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
          :placeholder="addNewListText"
          maxlength="50"
          @keydown="handleKeydown"
        />

        <!-- Action buttons -->
        <div class="flex items-center gap-1">
          <button
            @click="confirmAdd"
            class="p-0.5 text-green-600 hover:bg-green-100 rounded transition-colors"
            :disabled="!newListName.trim()"
            :class="{ 'opacity-50 cursor-not-allowed': !newListName.trim() }"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";

interface Props {
  addNewListText: string;
}

defineProps<Props>();

const emit = defineEmits<{
  "add-list": [name: string];
}>();

const isAdding = ref(false);
const newListName = ref("");
const inputRef = ref<HTMLInputElement>();

const startAdding = async () => {
  isAdding.value = true;
  newListName.value = "";
  await nextTick();
  inputRef.value?.focus();
};

const confirmAdd = () => {
  if (newListName.value.trim()) {
    emit("add-list", newListName.value.trim());
  }
  resetState();
};

const cancelAdd = () => {
  resetState();
};

const resetState = () => {
  isAdding.value = false;
  newListName.value = "";
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    confirmAdd();
  } else if (event.key === "Escape") {
    cancelAdd();
  }
};
</script>
