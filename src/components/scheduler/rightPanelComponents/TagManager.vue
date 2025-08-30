<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <!-- Selected Tags -->
    <div class="flex flex-wrap gap-2 items-center mb-3">
      <span
        v-for="tag in selectedTags"
        :key="tag.id"
        class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center gap-2"
      >
        {{ tag.title }}
        <button
          @click="removeTag(tag.id)"
          class="text-blue-600 hover:text-blue-800"
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
      </span>
    </div>

    <!-- Available Tags -->
    <div class="flex flex-wrap gap-2 items-center">
      <button
        v-for="tag in availableTags"
        :key="tag.id"
        @click="addTag(tag)"
        class="px-3 py-1 border border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors"
      >
        + {{ tag.title }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Tag } from "@/types/index";

// Props
const props = defineProps<{
  selectedTags: Tag[];
  allTags: Tag[];
  label: string;
}>();

// Emits
const emit = defineEmits<{
  "add-tag": [tag: Tag];
  "remove-tag": [tagId: number];
}>();

// Computed
const availableTags = computed(() => {
  return props.allTags.filter(
    (tag) =>
      !props.selectedTags.some((selectedTag) => selectedTag.id === tag.id),
  );
});

// Methods
const addTag = (tag: Tag): void => {
  emit("add-tag", tag);
};

const removeTag = (tagId: number): void => {
  emit("remove-tag", tagId);
};
</script>
