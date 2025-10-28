<template>
  <li
    class="flex items-center px-2 py-2 rounded-lg transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
    :class="{
      'bg-blue-50 text-blue-600': isActive,
    }"
    @click="$emit('click')"
  >
    <div class="flex items-center gap-2 w-full">
      <div
        v-if="!isEditMode"
        class="w-3.5 h-3.5 rounded-sm flex-shrink-0"
        :class="colorClass"
      ></div>

      <!-- Edit Mode -->
      <div v-if="isEditMode" class="flex items-center flex-1">
        <input
          ref="inputRef"
          v-model="editTitle"
          class="flex-1 text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-500"
          @keydown="handleKeydown"
          @blur="confirmEdit"
        />
        <button
          @click="confirmEdit"
          class="p-1 text-green-600 hover:bg-green-100 rounded transition-colors flex-shrink-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
        </button>
        <button
          @click="$emit('delete')"
          class="p-1 text-red-600 hover:bg-red-100 rounded transition-colors flex-shrink-0"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="3,6 5,6 21,6" />
            <path
              d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"
            />
          </svg>
        </button>
      </div>

      <!-- Normal Mode -->
      <div v-else class="flex items-center justify-between flex-1 min-w-0">
        <span class="text-sm font-medium truncate" @click="$emit('click')">
          {{ title }}
        </span>
        <span
          class="text-xs font-medium ml-2 flex-shrink-0"
          :class="isActive ? 'text-blue-600' : 'text-gray-400'"
        >
          {{ count }}
        </span>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";

interface Props {
  title: string;
  count: number;
  colorClass: string;
  isActive: boolean;
  isEditMode?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  click: [];
  edit: [newTitle: string];
  delete: [];
}>();

const editTitle = ref(props.title);
const inputRef = ref<HTMLInputElement>();

// Watch for edit mode changes to focus input
watch(
  () => props.isEditMode,
  async (isEdit) => {
    if (isEdit) {
      editTitle.value = props.title;
      await nextTick();
      inputRef.value?.focus();
      inputRef.value?.select();
    }
  },
);

const confirmEdit = () => {
  if (editTitle.value.trim() && editTitle.value !== props.title) {
    emit("edit", editTitle.value.trim());
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    confirmEdit();
  } else if (event.key === "Escape") {
    editTitle.value = props.title;
  }
};
</script>
