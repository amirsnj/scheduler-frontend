<template>
  <div
    class="w-72 h-screen bg-white rounded-xl p-5 flex flex-col font-sans shadow-lg transition-transform duration-300 ease-in-out scrollbar-hide overflow-y-auto"
  >
    <!-- Header -->
    <div class="mb-5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <button
            class="p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span class="text-base font-semibold text-gray-800">{{
            locales[currentLanguage].menu
          }}</span>
        </div>
        <!-- Close button for mobile -->
        <button
          v-if="isMobile"
          class="lg:hidden p-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
          @click="$emit('close-mobile')"
        >
          <svg
            width="18"
            height="18"
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

    <!-- Tasks Section -->
    <div class="mb-8">
      <h3
        class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1"
      >
        {{ locales[currentLanguage].tasks }}
      </h3>
      <ul class="space-y-0.5">
        <li
          class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          :class="{ 'bg-blue-50 text-blue-600': activeItem === 'upcoming' }"
          @click="setActive('upcoming')"
        >
          <svg
            class="mr-3 flex-shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="9,11 12,14 22,4" />
            <path
              d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"
            />
          </svg>
          <span class="flex-1 text-sm font-medium">{{
            locales[currentLanguage].upcoming
          }}</span>
          <span
            class="text-xs font-medium"
            :class="
              activeItem === 'upcoming' ? 'text-blue-600' : 'text-gray-400'
            "
            >{{ taskStore.upcomingTasks.length }}</span
          >
        </li>
        <li
          class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          :class="{ 'bg-blue-50 text-blue-600': activeItem === 'today' }"
          @click="setActive('today')"
        >
          <svg
            class="mr-3 flex-shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span class="flex-1 text-sm font-medium">{{
            locales[currentLanguage].today
          }}</span>
          <span
            class="text-xs font-medium"
            :class="activeItem === 'today' ? 'text-blue-600' : 'text-gray-400'"
            >{{ taskStore.todayTasks.length }}</span
          >
        </li>
        <li
          class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          :class="{ 'bg-blue-50 text-blue-600': activeItem === 'completed' }"
          @click="setActive('completed')"
        >
          <svg
            class="mr-3 flex-shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <polyline points="20,6 9,17 4,12" />
          </svg>
          <span class="flex-1 text-sm font-medium">{{
            locales[currentLanguage].completed
          }}</span>
          <span
            class="text-xs font-medium"
            :class="
              activeItem === 'completed' ? 'text-blue-600' : 'text-gray-400'
            "
            >{{ taskStore.completedTasks.length }}</span
          >
        </li>
        <li
          class="flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          :class="{ 'bg-blue-50 text-blue-600': activeItem === 'calendar' }"
          @click="setActive('calendar')"
        >
          <svg
            class="mr-3 flex-shrink-0"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span class="flex-1 text-sm font-medium">{{
            locales[currentLanguage].calendar
          }}</span>
        </li>
      </ul>
    </div>

    <!-- Lists Section -->
    <div class="mb-8">
      <h3
        class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1"
      >
        {{ locales[currentLanguage].lists }}
      </h3>
      <ul class="space-y-0.5">
        <li
          v-for="list in taskLists"
          :key="list.id"
          class="flex items-center px-2 py-2 rounded-lg cursor-pointer transition-all text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          :class="{
            'bg-blue-50 text-blue-600': activeItem === `category-${list.id}`,
          }"
          @click="setActive(`category-${list.id}`)"
        >
          <div
            class="w-3.5 h-3.5 rounded-sm mr-3 flex-shrink-0"
            :class="getListColor(list.id)"
          ></div>
          <span class="flex-1 text-sm font-medium">{{ list.title }}</span>
          <span
            class="text-xs font-medium"
            :class="
              activeItem === `category-${list.id}`
                ? 'text-blue-600'
                : 'text-gray-400'
            "
            >{{ list.task_count }}</span
          >
        </li>
      </ul>
      <!-- Add new list button or input -->
      <div v-if="!isAddingNewList" class="mt-1">
        <button
          class="flex items-center px-3 py-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start"
          @click="addNewList"
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
          {{ locales[currentLanguage].addNewList }}
        </button>
      </div>
      <div v-else class="mt-1 p-2 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex items-center gap-2">
          <!-- Random color indicator -->
          <div class="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0"></div>

          <!-- Input field -->
          <input
            v-model="newListName"
            class="new-list-input flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
            :placeholder="locales[currentLanguage].addNewList"
            maxlength="50"
            @keydown="handleListEnter"
          />

          <!-- Action buttons -->
          <div class="flex items-center gap-1">
            <button
              @click="confirmNewList"
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
              @click="cancelNewList"
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

    <!-- Tags Section -->
    <div class="mb-8">
      <h3
        class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1"
      >
        {{ locales[currentLanguage].tags }}
      </h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag.id"
          class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium cursor-pointer hover:bg-gray-200 transition-colors"
          :class="{ 'bg-blue-100 text-blue-600': activeTag === tag.id }"
          @click="toggleTag(tag.id)"
        >
          {{ tag.title }}
        </span>
      </div>
      <div class="mt-2">
        <button
          v-if="!isAddingNewTag"
          class="px-3 py-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer text-xs rounded transition-colors"
          @click="addNewTag"
        >
          + {{ locales[currentLanguage].addTag }}
        </button>
        <div
          v-else
          class="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 rounded-full border border-gray-200"
        >
          <input
            v-model="newTagName"
            class="new-tag-input bg-transparent border-none outline-none text-xs text-gray-700 placeholder-gray-400 w-20"
            :placeholder="locales[currentLanguage].addTag"
            maxlength="30"
            @keydown="handleTagEnter"
          />
          <button
            @click="confirmNewTag"
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
            @click="cancelNewTag"
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

    <!-- Footer -->
    <div class="mt-auto border-t border-gray-200 pt-4">
      <button
        class="flex items-center px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start mb-1"
        @click="openSettings"
      >
        <svg
          class="mr-3"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
        </svg>
        {{ locales[currentLanguage].settings }}
      </button>
      <button
        class="flex items-center px-3 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer rounded-lg text-sm transition-all w-full justify-start"
        @click="signOut"
      >
        <svg
          class="mr-3"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16,17 21,12 16,7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        {{ locales[currentLanguage].signOut }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from "vue";
import type { Task, TaskList, Tag, Locale } from "@/types/index";
import { useTaskStore } from "@/store/index";

// Pinia store
const taskStore = useTaskStore();

// Props
const props = defineProps<{
  currentLanguage: string;
  locales: Record<string, Locale>;
  activeItem: string;
  tasks: Task[];
  taskLists: TaskList[];
  tags: Tag[];
  isMobile?: boolean;
  isMobileOpen?: boolean;
}>();

// Emits
const emit = defineEmits<{
  (e: "item-selected", item: string): void;
  (e: "language-changed"): void;
  (e: "close-mobile"): void;
  (e: "tag-selected", tag: number): void;
  (e: "add-new-list", list: TaskList): void;
  (e: "add-new-tag", tag: Tag): void;
  (e: "settings-clicked"): void;
  (e: "sign-out"): void;
}>();

// Reactive data
const isAddingNewList = ref<boolean>(false);
const isAddingNewTag = ref<boolean>(false);
const newListName = ref<string>("");
const newTagName = ref<string>("");
const activeTag = ref<number | null>(null);

// Available colors for new lists
const availableColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
];

// Methods
const setActive = (item: string): void => {
  emit("item-selected", item);
  if (props.isMobileOpen) {
    emit("close-mobile");
  }
};

const toggleTag = (tagId: number): void => {
  activeTag.value = activeTag.value === tagId ? null : tagId;
  emit("tag-selected", tagId);
};

const getListColor = (listId: number): string => {
  const colorMap: Record<number, string> = {
    1: "bg-blue-500", // Work
    2: "bg-red-500", // Personal
    3: "bg-green-500", // Shopping
  };
  return colorMap[listId] || "bg-gray-500";
};

const addNewList = (): void => {
  isAddingNewList.value = true;
  newListName.value = "";
  nextTick(() => {
    const input = document.querySelector(".new-list-input") as HTMLInputElement;
    if (input) input.focus();
  });
};

const confirmNewList = (): void => {
  if (newListName.value.trim()) {
    const newList: TaskList = {
      id: Date.now(),
      title: newListName.value.trim(),
      task_count: 0,
    };
    emit("add-new-list", newList);
  }
  isAddingNewList.value = false;
  newListName.value = "";
};

const cancelNewList = (): void => {
  isAddingNewList.value = false;
  newListName.value = "";
};

const addNewTag = (): void => {
  isAddingNewTag.value = true;
  newTagName.value = "";
  nextTick(() => {
    const input = document.querySelector(".new-tag-input") as HTMLInputElement;
    if (input) input.focus();
  });
};

const confirmNewTag = (): void => {
  if (newTagName.value.trim()) {
    const newTag: Tag = {
      id: Date.now(),
      title: newTagName.value.trim(),
    };
    emit("add-new-tag", newTag);
  }
  isAddingNewTag.value = false;
  newTagName.value = "";
};

const cancelNewTag = (): void => {
  isAddingNewTag.value = false;
  newTagName.value = "";
};

const handleListEnter = (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    confirmNewList();
  } else if (event.key === "Escape") {
    cancelNewList();
  }
};

const handleTagEnter = (event: KeyboardEvent): void => {
  if (event.key === "Enter") {
    confirmNewTag();
  } else if (event.key === "Escape") {
    cancelNewTag();
  }
};

const openSettings = (): void => {
  emit("settings-clicked");
};

const signOut = (): void => {
  emit("sign-out");
};
</script>

<style scoped>
/* Hide scrollbar for webkit browsers */
.scrollbar-hide {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.scrollbar-hide::-webkit-scrollbar {
  display: none; /* Chrome, Safari and Opera */
}
</style>
