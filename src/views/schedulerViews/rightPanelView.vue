<template>
  <div
    v-if="showPanel"
    class="h-full bg-white rounded-xl p-6 shadow-lg flex flex-col overflow-hidden"
    :class="{ 'rounded-none': isMobile }"
  >
    <div class="flex items-center justify-between mb-6 flex-shrink-0">
      <h2 class="text-lg font-semibold text-gray-900">
        {{
          isAddingTask
            ? locales[currentLanguage].addNewTask
            : locales[currentLanguage].editTask
        }}
      </h2>
      <button
        v-if="isMobile"
        class="p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
        @click="$emit('close-panel')"
      >
        <svg
          width="20"
          height="20"
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

    <div
      class="flex-1 space-y-6 overflow-y-auto scrollbar-hide min-h-0"
      ref="scrollContainer"
    >
      <!-- Task Title -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ locales[currentLanguage].taskTitle || "Task Title" }}
        </label>
        <input
          v-model="taskTitle"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          :placeholder="
            locales[currentLanguage].taskTitle || 'Enter task title'
          "
          required
        />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ locales[currentLanguage].description || "Description" }}
        </label>
        <textarea
          v-model="taskDescription"
          rows="3"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          :placeholder="
            locales[currentLanguage].taskDescription || 'Enter task description'
          "
        ></textarea>
      </div>

      <!-- Category and Priority -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ locales[currentLanguage].category || "Category" }}
          </label>
          <select
            v-model="taskCategory"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option :value="null">
              {{ locales[currentLanguage].noCategory || "No Category" }}
            </option>
            <option v-for="list in taskLists" :key="list.id" :value="list.id">
              {{ list.title }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ locales[currentLanguage].priority || "Priority" }}
          </label>
          <select
            v-model="taskPriority"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="L">
              {{ locales[currentLanguage].lowPriority || "Low" }}
            </option>
            <option value="M">
              {{ locales[currentLanguage].mediumPriority || "Medium" }}
            </option>
            <option value="H">
              {{ locales[currentLanguage].highPriority || "High" }}
            </option>
          </select>
        </div>
      </div>

      <!-- Scheduled Date and Deadline -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ locales[currentLanguage].scheduledDate || "Scheduled Date" }}
          </label>
          <input
            v-model="taskScheduledDate"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            {{ locales[currentLanguage].deadline || "Deadline" }}
          </label>
          <input
            v-model="taskDeadline"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Tags -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          {{ locales[currentLanguage].tags || "Tags" }}
        </label>
        <div class="flex flex-wrap gap-2 items-center mb-3">
          <span
            v-for="tag in taskTags"
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

      <!-- Subtasks -->
      <div>
        <div class="flex items-center justify-between mb-3">
          <label class="block text-sm font-medium text-gray-700">
            {{ locales[currentLanguage].subtasks || "Subtasks" }}
          </label>
          <button
            class="flex items-center gap-1 px-2 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
            @click="addSubtask"
          >
            <svg
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
            {{ locales[currentLanguage].addSubtask || "Add Subtask" }}
          </button>
        </div>

        <div class="space-y-2">
          <div
            v-for="(subtask, index) in taskSubtasks"
            :key="subtask.id || index"
            class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg"
          >
            <input
              type="checkbox"
              :checked="subtask.is_completed"
              @change="toggleSubtask(index)"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <input
              v-model="subtask.title"
              class="flex-1 bg-transparent border-none outline-none text-sm"
              :class="{ 'line-through text-gray-500': subtask.is_completed }"
              :placeholder="
                locales[currentLanguage].subtaskTitle || 'Subtask title'
              "
            />
            <button
              @click="removeSubtask(index)"
              class="text-red-500 hover:text-red-700 p-1"
            >
              <svg
                width="14"
                height="14"
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

      <!-- Task Status -->
      <div v-if="!isAddingTask">
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            v-model="taskCompleted"
            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <span class="text-sm font-medium text-gray-700">
            {{
              locales[currentLanguage].markAsCompleted || "Mark as completed"
            }}
          </span>
        </label>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="border-t border-gray-200 pt-4 mt-6 flex-shrink-0">
      <div class="flex gap-3">
        <button
          v-if="!isAddingTask"
          class="flex-1 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors font-medium"
          @click="$emit('delete-task')"
        >
          {{ locales[currentLanguage].deleteTask || "Delete Task" }}
        </button>
        <button
          class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          @click="saveTask"
          :disabled="!taskTitle.trim()"
          :class="{ 'opacity-50 cursor-not-allowed': !taskTitle.trim() }"
        >
          {{
            isAddingTask
              ? locales[currentLanguage].createTask || "Create Task"
              : locales[currentLanguage].updateTask || "Update Task"
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick } from "vue";
import type {
  Task,
  TaskCreate,
  TaskList,
  Tag,
  SubTask,
  Locale,
} from "@/types/index";

// تعریف props
const props = defineProps<{
  currentLanguage: string;
  locales: Record<string, Locale>;
  selectedTask: Task | null;
  taskLists: TaskList[];
  tags: Tag[];
  showPanel: boolean;
  isAddingTask: boolean;
  isMobile?: boolean;
}>();

// تعریف emits
const emit = defineEmits<{
  (e: "save-task", taskData: TaskCreate & { isAddingTask: boolean }): void;
  (e: "delete-task"): void;
  (e: "close-panel"): void;
}>();

// Reactive data
const taskTitle = ref<string>("");
const taskDescription = ref<string>("");
const taskCategory = ref<number | null>(null);
const taskPriority = ref<"L" | "M" | "H">("L");
const taskScheduledDate = ref<string>("");
const taskDeadline = ref<string>("");
const taskTags = ref<Tag[]>([]);
const taskSubtasks = ref<SubTask[]>([]);
const taskCompleted = ref<boolean>(false);
const scrollContainer = ref<HTMLElement | null>(null);

// Computed
const availableTags = computed(() => {
  return props.tags.filter(
    (tag) => !taskTags.value.some((selectedTag) => selectedTag.id === tag.id),
  );
});

// Watch selectedTask for changes
watch(
  () => props.selectedTask,
  (newTask: Task | null) => {
    if (newTask) {
      taskTitle.value = newTask.title;
      taskDescription.value = newTask.description;
      taskCategory.value =
        newTask.category !== undefined ? newTask.category : null;
      taskPriority.value = newTask.priority_level;
      taskScheduledDate.value = newTask.scheduled_date || "";
      taskDeadline.value = newTask.dead_line || "";
      taskTags.value = [...newTask.tags];
      taskSubtasks.value = [...newTask.subTasks];
      taskCompleted.value = newTask.is_completed;
    }
  },
  { immediate: true },
);

// Watch isAddingTask to reset form
watch(
  () => props.isAddingTask,
  (isAdding: boolean) => {
    if (isAdding) {
      resetForm();
    }
  },
);

// Methods
const resetForm = (): void => {
  taskTitle.value = "";
  taskDescription.value = "";
  taskCategory.value = null;
  taskPriority.value = "L";
  taskScheduledDate.value = "";
  taskDeadline.value = "";
  taskTags.value = [];
  taskSubtasks.value = [];
  taskCompleted.value = false;
};

const addTag = (tag: Tag): void => {
  if (!taskTags.value.some((t) => t.id === tag.id)) {
    taskTags.value.push(tag);
  }
};

const removeTag = (tagId: number): void => {
  taskTags.value = taskTags.value.filter((tag) => tag.id !== tagId);
};

const addSubtask = async (): Promise<void> => {
  const newSubtask: SubTask = {
    id: Date.now() + Math.random(),
    title: "",
    is_completed: false,
  };
  taskSubtasks.value.push(newSubtask);

  // Scroll to bottom of the main container after DOM update
  await nextTick();
  if (scrollContainer.value) {
    scrollContainer.value.scrollTo({
      top: scrollContainer.value.scrollHeight,
      behavior: "smooth",
    });
  }
};

const removeSubtask = (index: number): void => {
  taskSubtasks.value.splice(index, 1);
};

const toggleSubtask = (index: number): void => {
  taskSubtasks.value[index].is_completed =
    !taskSubtasks.value[index].is_completed;
};

// 🔥 اصلاح کامل saveTask
const saveTask = (): void => {
  if (!taskTitle.value.trim()) return;

  const taskData: TaskCreate & { isAddingTask: boolean } = {
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim() || undefined,
    category: taskCategory.value,
    priority_level: taskPriority.value,
    scheduled_date: taskScheduledDate.value || undefined,
    dead_line: taskDeadline.value || null,
    is_completed: taskCompleted.value, // ⭐ اضافه شده
    tags: taskTags.value.map((tag) => tag.id),
    subTasks: taskSubtasks.value
      .filter((st) => st.title.trim() !== "")
      .map((st) => ({
        id: st.id, // ⭐ حفظ ID برای آپدیت بهینه
        title: st.title.trim(),
        is_completed: st.is_completed || false, // ⭐ حفظ وضعیت
      })),
    isAddingTask: props.isAddingTask,
  };

  emit("save-task", taskData);
};
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
