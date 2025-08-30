<template>
  <div
    v-if="showPanel"
    class="h-full bg-white rounded-xl p-6 shadow-lg flex flex-col"
    :class="{ 'rounded-none': isMobile }"
  >
    <!-- Header -->
    <FormHeader
      :title="
        isAddingTask
          ? locales[currentLanguage].addNewTask
          : locales[currentLanguage].editTask
      "
      :show-close-button="isMobile"
      @close="$emit('close-panel')"
    />

    <div class="flex-1 space-y-6 overflow-y-auto scrollbar-hide">
      <!-- Task Title -->
      <FormInput
        v-model="taskTitle"
        :label="locales[currentLanguage].taskTitle || 'Task Title'"
        :placeholder="locales[currentLanguage].taskTitle || 'Enter task title'"
        :required="true"
      />

      <!-- Description -->
      <FormInput
        v-model="taskDescription"
        :label="locales[currentLanguage].description || 'Description'"
        type="textarea"
        :rows="3"
        :placeholder="
          locales[currentLanguage].taskDescription || 'Enter task description'
        "
      />

      <!-- Category and Priority -->
      <div class="grid grid-cols-2 gap-4">
        <FormSelect
          v-model="taskCategory"
          :label="locales[currentLanguage].category || 'Category'"
          :options="categoryOptions"
          :show-empty-option="true"
          :empty-option-text="
            locales[currentLanguage].noCategory || 'No Category'
          "
          :empty-value="null"
        />

        <FormSelect
          v-model="taskPriority"
          :label="locales[currentLanguage].priority || 'Priority'"
          :options="priorityOptions"
        />
      </div>

      <!-- Scheduled Date and Deadline -->
      <div class="grid grid-cols-2 gap-4">
        <FormInput
          v-model="taskScheduledDate"
          :label="locales[currentLanguage].scheduledDate || 'Scheduled Date'"
          type="date"
        />

        <FormInput
          v-model="taskDeadline"
          :label="locales[currentLanguage].deadline || 'Deadline'"
          type="date"
        />
      </div>

      <!-- Tags -->
      <TagManager
        :selected-tags="taskTags"
        :all-tags="tags"
        :label="locales[currentLanguage].tags || 'Tags'"
        @add-tag="addTag"
        @remove-tag="removeTag"
      />

      <!-- Subtasks -->
      <SubtaskManager
        :subtasks="taskSubtasks"
        :label="locales[currentLanguage].subtasks || 'Subtasks'"
        :add-button-text="locales[currentLanguage].addSubtask || 'Add Subtask'"
        :placeholder="locales[currentLanguage].subtaskTitle || 'Subtask title'"
        @add-subtask="addSubtask"
        @remove-subtask="removeSubtask"
        @toggle-subtask="toggleSubtask"
        @update-subtask-title="updateSubtaskTitle"
      />

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
    <FormActions
      :show-delete-button="!isAddingTask"
      :delete-button-text="locales[currentLanguage].deleteTask || 'Delete Task'"
      :save-button-text="
        isAddingTask
          ? locales[currentLanguage].createTask || 'Create Task'
          : locales[currentLanguage].updateTask || 'Update Task'
      "
      :can-save="!!taskTitle.trim()"
      @delete="$emit('delete-task')"
      @save="saveTask"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type {
  Task,
  TaskCreate,
  TaskList,
  Tag,
  SubTask,
  Locale,
} from "@/types/index";

import FormHeader from "@/components/scheduler/rightPanelComponents/FormHeader.vue";
import FormInput from "@/components/scheduler/rightPanelComponents/FormInput.vue";
import FormSelect from "@/components/scheduler/rightPanelComponents/FormSelect.vue";
import TagManager from "@/components/scheduler/rightPanelComponents/TagManager.vue";
import SubtaskManager from "@/components/scheduler/rightPanelComponents/SubtaskManager.vue";
import FormActions from "@/components/scheduler/rightPanelComponents/FormActions.vue";
import type { SelectOption } from "@/components/scheduler/rightPanelComponents/FormSelect.vue";

// Props
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

// Emits
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

// Computed options
const categoryOptions = computed((): SelectOption[] => {
  return props.taskLists.map((list) => ({
    value: list.id,
    label: list.title,
  }));
});

const priorityOptions = computed((): SelectOption[] => {
  return [
    {
      value: "L",
      label: props.locales[props.currentLanguage].lowPriority || "Low",
    },
    {
      value: "M",
      label: props.locales[props.currentLanguage].mediumPriority || "Medium",
    },
    {
      value: "H",
      label: props.locales[props.currentLanguage].highPriority || "High",
    },
  ];
});

// Watch selectedTask for changes
watch(
  () => props.selectedTask,
  (newTask: Task | null) => {
    if (newTask) {
      taskTitle.value = newTask.title;
      taskDescription.value = newTask.description;
      taskCategory.value = newTask.category;
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

const addSubtask = (): void => {
  const newSubtask: SubTask = {
    id: Date.now() + Math.random(),
    title: "",
    is_completed: false,
  };
  taskSubtasks.value.push(newSubtask);
};

const removeSubtask = (index: number): void => {
  taskSubtasks.value.splice(index, 1);
};

const toggleSubtask = (index: number): void => {
  taskSubtasks.value[index].is_completed =
    !taskSubtasks.value[index].is_completed;
};

const updateSubtaskTitle = (index: number, title: string): void => {
  taskSubtasks.value[index].title = title;
};

const saveTask = (): void => {
  if (!taskTitle.value.trim()) return;

  const taskData: TaskCreate & { isAddingTask: boolean } = {
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim() || undefined,
    category: taskCategory.value,
    priority_level: taskPriority.value,
    scheduled_date: taskScheduledDate.value || undefined,
    dead_line: taskDeadline.value || null,
    is_completed: taskCompleted.value,
    tags: taskTags.value.map((tag) => tag.id),
    subTasks: taskSubtasks.value
      .filter((st) => st.title.trim() !== "")
      .map((st) => ({
        id: st.id,
        title: st.title.trim(),
        is_completed: st.is_completed || false,
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
