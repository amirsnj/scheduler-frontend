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
        <!-- All Tasks Item -->
        <TaskListItem
          :title="locales[currentLanguage].allTasks || 'All Tasks'"
          :count="[...taskStore.todayTasks, ...taskStore.upcomingTasks].length"
          :is-active="activeItem === 'all-tasks'"
          :show-count="true"
          @click="setActive('all-tasks')"
        >
          <template #icon>
            <svg
              class="mr-3 flex-shrink-0"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <path d="M9 9h6m-6 4h6" />
            </svg>
          </template>
        </TaskListItem>

        <TaskListItem
          :title="locales[currentLanguage].upcoming"
          :count="taskStore.upcomingTasks.length"
          :is-active="activeItem === 'upcoming'"
          :show-count="true"
          @click="setActive('upcoming')"
        >
          <template #icon>
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
          </template>
        </TaskListItem>

        <TaskListItem
          :title="locales[currentLanguage].today"
          :count="taskStore.todayTasks.length"
          :is-active="activeItem === 'today'"
          :show-count="true"
          @click="setActive('today')"
        >
          <template #icon>
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
          </template>
        </TaskListItem>

        <TaskListItem
          :title="locales[currentLanguage].completed"
          :count="taskStore.completedTasks.length"
          :is-active="activeItem === 'completed'"
          :show-count="true"
          @click="setActive('completed')"
        >
          <template #icon>
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
          </template>
        </TaskListItem>

        <TaskListItem
          :title="locales[currentLanguage].calendar"
          :is-active="activeItem === 'calendar'"
          :show-count="false"
          @click="setActive('calendar')"
        >
          <template #icon>
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
          </template>
        </TaskListItem>
      </ul>
    </div>

    <!-- Lists Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-3 ml-1">
        <h3
          class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          {{ locales[currentLanguage].lists }}
        </h3>
        <button
          @click="toggleListEditMode"
          class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          :class="{ 'text-blue-600': isListEditMode }"
        >
          {{
            isListEditMode
              ? locales[currentLanguage].done || "Done"
              : locales[currentLanguage].editLists || "Edit Lists"
          }}
        </button>
      </div>
      <ul class="space-y-0.5">
        <ListItemComponent
          v-for="list in taskLists"
          :key="list.id"
          :title="list.title"
          :count="taskStore.tasksByCategory(list.id).length"
          :color-class="getListColor(list.id % 10)"
          :is-active="activeItem === `category-${list.id}`"
          :is-edit-mode="isListEditMode && editingListId === list.id"
          @click="handleListClick(list.id)"
          @edit="handleEditList(list.id, $event)"
          @delete="handleDeleteList(list.id)"
        />
      </ul>

      <AddNewList
        :add-new-list-text="locales[currentLanguage].addNewList"
        @add-list="handleNewList"
      />
    </div>

    <!-- Tags Section -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-3 ml-1">
        <h3
          class="text-xs font-semibold text-gray-400 uppercase tracking-wider"
        >
          {{ locales[currentLanguage].tags }}
        </h3>
        <button
          @click="toggleTagEditMode"
          class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          :class="{ 'text-blue-600': isTagEditMode }"
        >
          {{
            isTagEditMode
              ? locales[currentLanguage].done || "Done"
              : locales[currentLanguage].editTags || "Edit Tags"
          }}
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        <TagComponent
          v-for="tag in tags"
          :key="tag.id"
          :title="tag.title"
          :is-active="activeTag === tag.id"
          :is-edit-mode="isTagEditMode && editingTagId === tag.id"
          @click="handleTagClick(tag.id)"
          @edit="handleEditTag(tag.id, $event)"
          @delete="handleDeleteTag(tag.id)"
        />
      </div>

      <AddNewTag
        :add-tag-text="locales[currentLanguage].addTag"
        @add-tag="handleNewTag"
      />
    </div>

    <!-- Footer -->
    <SidebarFooter
      :settings-text="locales[currentLanguage].settings"
      :sign-out-text="locales[currentLanguage].signOut"
      @settings-click="openSettings"
      @sign-out-click="signOut"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Task, TaskList, Tag, Locale } from "@/types/index";
import { useTaskStore } from "@/store/index";

// Import Components
import TaskListItem from "@/components/scheduler/sideBarComponents/TaskListItem.vue";
import ListItemComponent from "@/components/scheduler/sideBarComponents/ListItemComponent.vue";
import AddNewList from "@/components/scheduler/sideBarComponents/AddNewList.vue";
import TagComponent from "@/components/scheduler/sideBarComponents/TagComponent.vue";
import AddNewTag from "@/components/scheduler/sideBarComponents/AddNewTag.vue";
import SidebarFooter from "@/components/scheduler/sideBarComponents/SidebarFooter.vue";

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
  (e: "edit-list", listId: number, newTitle: string): void;
  (e: "delete-list", listId: number): void;
  (e: "edit-tag", tagId: number, newTitle: string): void;
  (e: "delete-tag", tagId: number): void;
  (e: "settings-clicked"): void;
  (e: "sign-out"): void;
}>();

// Reactive data
const activeTag = ref<number | null>(null);
const isListEditMode = ref(false);
const isTagEditMode = ref(false);
const editingListId = ref<number | null>(null);
const editingTagId = ref<number | null>(null);

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

// List management methods
const toggleListEditMode = (): void => {
  isListEditMode.value = !isListEditMode.value;
  if (!isListEditMode.value) {
    editingListId.value = null;
  }
};

const handleListClick = (listId: number): void => {
  if (isListEditMode.value) {
    editingListId.value = editingListId.value === listId ? null : listId;
  } else {
    setActive(`category-${listId}`);
  }
};

const handleEditList = (listId: number, newTitle: string): void => {
  emit("edit-list", listId, newTitle);
  editingListId.value = null;
};

const handleDeleteList = (listId: number): void => {
  emit("delete-list", listId);
  editingListId.value = null;
};

// Tag management methods
const toggleTagEditMode = (): void => {
  isTagEditMode.value = !isTagEditMode.value;
  if (!isTagEditMode.value) {
    editingTagId.value = null;
  }
};

const handleTagClick = (tagId: number): void => {
  if (isTagEditMode.value) {
    editingTagId.value = editingTagId.value === tagId ? null : tagId;
  } else {
    toggleTag(tagId);
  }
};

const handleEditTag = (tagId: number, newTitle: string): void => {
  emit("edit-tag", tagId, newTitle);
  editingTagId.value = null;
};

const handleDeleteTag = (tagId: number): void => {
  emit("delete-tag", tagId);
  editingTagId.value = null;
};

const getListColor = (listId: number): string => {
  const colorMap: Record<number, string> = {
    0: "bg-emerald-500",
    1: "bg-blue-500",
    2: "bg-red-500",
    3: "bg-green-500",
    4: "bg-rose-400",
    5: "bg-indigo-500",
    6: "bg-yellow-500",
    7: "bg-violet-400",
    8: "bg-fuchsia-400",
    9: "bg-orange-500",
  };
  return colorMap[listId] || "bg-gray-500";
};

const handleNewList = (name: string): void => {
  const newList: TaskList = {
    id: Date.now(),
    title: name,
    task_count: 0,
  };
  emit("add-new-list", newList);
};

const handleNewTag = (name: string): void => {
  const newTag: Tag = {
    id: Date.now(),
    title: name,
  };
  emit("add-new-tag", newTag);
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
