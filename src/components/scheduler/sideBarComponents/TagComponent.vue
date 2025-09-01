<template>
  <div
    v-if="isEditMode"
    class="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-200"
  >
    <input
      ref="inputRef"
      v-model="editTitle"
      class="bg-transparent border-none outline-none text-xs text-gray-700 placeholder-gray-400 w-16 min-w-0"
      @keydown="handleKeydown"
      @blur="confirmEdit"
    />
    <button
      @click="confirmEdit"
      class="p-0.5 text-green-600 hover:bg-green-100 rounded transition-colors"
    >
      <svg
        width="10"
        height="10"
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
      class="p-0.5 text-red-600 hover:bg-red-100 rounded transition-colors"
    >
      <svg
        width="10"
        height="10"
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
  <span
    v-else
    class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-200 transition-colors"
    :class="{ 'bg-blue-100 text-blue-600': isActive }"
    @click="$emit('click')"
  >
    {{ title }}
  </span>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from "vue";

interface Props {
  title: string;
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
