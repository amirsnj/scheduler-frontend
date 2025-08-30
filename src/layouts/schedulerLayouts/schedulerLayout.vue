<template>
  <div
    :dir="currentLanguage === 'fa' ? 'rtl' : 'ltr'"
    class="min-h-screen bg-gray-50"
  >
    <!-- Main Layout -->
    <div class="flex h-screen">
      <!-- Sidebar Component -->
      <div class="hidden lg:block">
        <SidebarComponent
          :current-language="currentLanguage"
          :locales="locales"
          :active-item="activeItem"
          :tasks="taskStore.tasks"
          :task-lists="taskStore.taskLists"
          :tags="taskStore.tags"
          @item-selected="handleItemSelected"
          @language-changed="handleLanguageChange"
          @add-new-list="handleAddNewList"
          @add-new-tag="handleAddNewTag"
        />
      </div>

      <!-- Mobile Sidebar -->
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="closeMobileMenu"
      ></div>

      <div
        class="lg:hidden fixed z-50 h-full transition-transform duration-300 ease-in-out"
        :class="['sidebar-mobile', isMobileMenuOpen ? 'open' : '']"
      >
        <SidebarComponent
          :current-language="currentLanguage"
          :locales="locales"
          :active-item="activeItem"
          :tasks="taskStore.tasks"
          :task-lists="taskStore.taskLists"
          :tags="taskStore.tags"
          :is-mobile="true"
          :is-mobile-open="isMobileMenuOpen"
          @item-selected="handleItemSelected"
          @language-changed="handleLanguageChange"
          @close-mobile="closeMobileMenu"
          @add-new-list="handleAddNewList"
          @add-new-tag="handleAddNewTag"
        />
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex">
        <!-- Task List Section -->
        <div class="flex-1 lg:flex-none lg:w-96 xl:w-1/2">
          <MainContent
            :current-language="currentLanguage"
            :locales="locales"
            :active-item="activeItem"
            :tasks="filteredTasks"
            :selected-task="selectedTask"
            :is-loading="taskStore.loading"
            :current-date="currentDate"
            v-model:selectedDate="currentDate"
            @task-selected="handleTaskSelected"
            @toggle-mobile-menu="toggleMobileMenu"
            @add-task="handleAddTask"
            @toggle-task-completion="handleToggleTaskCompletion"
            @previous-day="handlePreviousDay"
            @next-day="handleNextDay"
            @today="handleToday"
            @update:selectedDate="handleDateSelected"
          />
        </div>

        <!-- Right Panel -->
        <div class="hidden lg:block flex-1">
          <RightPanel
            :current-language="currentLanguage"
            :locales="locales"
            :selected-task="selectedTask"
            :task-lists="taskStore.taskLists"
            :tags="taskStore.tags"
            :show-panel="!!selectedTask || showAddTaskPanel"
            :is-adding-task="showAddTaskPanel"
            @save-task="handleSaveTask"
            @delete-task="handleDeleteTask"
            @close-panel="handleClosePanel"
          />
        </div>

        <!-- Mobile Right Panel -->
        <div
          v-if="showMobilePanel"
          class="lg:hidden fixed inset-0 z-50 bg-white"
        >
          <RightPanel
            :current-language="currentLanguage"
            :locales="locales"
            :selected-task="selectedTask"
            :task-lists="taskStore.taskLists"
            :tags="taskStore.tags"
            :show-panel="true"
            :is-adding-task="showAddTaskPanel"
            :is-mobile="true"
            @save-task="handleSaveTask"
            @delete-task="handleDeleteTask"
            @close-panel="handleCloseMobilePanel"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import SidebarComponent from "@/components/schedulerComponents/SidebarComponent.vue";
import MainContent from "@/views/schedulerViews/MainContent.vue";
import RightPanel from "@/views/schedulerViews/RightPanel.vue";
import { locales } from "@/locales/schedulerLocales/index";
import type { Task, TaskCreate, TaskList, Tag } from "@/types/index";
import { currentLanguage } from "@/main";
import { useTaskStore } from "@/store/index";
import { useNotificationStore } from "@/store/notificationStore";

// Pinia store
const taskStore = useTaskStore();
const notificationStore = useNotificationStore();

// Reactive data
const activeItem = ref<string>("today");
const selectedTask = ref<Task | null>(null);
const isMobileMenuOpen = ref<boolean>(false);
const showMobilePanel = ref<boolean>(false);
const showAddTaskPanel = ref<boolean>(false);
const currentDate = ref<string>(new Date().toISOString().split("T")[0]);

// Computed
const filteredTasks = computed<Task[]>(() => {
  if (activeItem.value === "today") {
    return taskStore.todayTasks;
  }
  if (activeItem.value === "upcoming") {
    return taskStore.upcomingTasks;
  }
  if (activeItem.value === "completed") {
    return taskStore.completedTasks;
  }
  if (
    typeof activeItem.value === "string" &&
    activeItem.value.startsWith("category-")
  ) {
    const categoryId = parseInt(activeItem.value.split("-")[1]);
    return taskStore.tasksByCategory(categoryId);
  }
  if (activeItem.value === "calendar") {
    return taskStore.tasksForDate(currentDate.value);
  }
  return taskStore.tasks;
});

// Methods
const handleLanguageChange = (): void => {
  currentLanguage.value = currentLanguage.value === "en" ? "fa" : "en";
};

const handleItemSelected = async (item: string): Promise<void> => {
  activeItem.value = item;
  selectedTask.value = null;
  showAddTaskPanel.value = false;
  if (item === "calendar") {
    currentDate.value = new Date().toISOString().split("T")[0];
    await taskStore.fetchTasksByDate(currentDate.value);
  }
  if (isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleTaskSelected = (task: Task): void => {
  selectedTask.value = task;
  showAddTaskPanel.value = false;
  if (window.innerWidth < 1024) {
    showMobilePanel.value = true;
  }
};

const handleAddTask = (): void => {
  selectedTask.value = null;
  showAddTaskPanel.value = true;
  if (window.innerWidth < 1024) {
    showMobilePanel.value = true;
  }
};

const handleToggleTaskCompletion = async (taskId: number): Promise<void> => {
  try {
    await taskStore.toggleTaskComplete(taskId);
  } catch (error) {
    console.error("Error toggling task completion:", error);
    notificationStore.showError(
      locales[currentLanguage.value].errorUpdatingTask || "Error updating task",
    );
  }
};

const handleSaveTask = async (
  taskData: TaskCreate & { isAddingTask: boolean },
): Promise<void> => {
  try {
    if (taskData.isAddingTask) {
      await taskStore.addTask(taskData);
      showAddTaskPanel.value = false;
      notificationStore.showSuccess(
        locales[currentLanguage.value].taskCreated ||
          "Task created successfully",
      );
    } else if (selectedTask.value) {
      await taskStore.updateTask(selectedTask.value.id, {
        id: selectedTask.value.id,
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority_level: taskData.priority_level,
        scheduled_date: taskData.scheduled_date,
        dead_line: taskData.dead_line,
        is_completed: taskData.is_completed || false,
        subTasks: taskData.subTasks,
        tags: taskData.tags
          .map((tagId) => taskStore.tags.find((t) => t.id === tagId))
          .filter((tag): tag is Tag => !!tag),
        updated_at: new Date().toISOString(),
      });
      selectedTask.value = null;
      notificationStore.showSuccess(
        locales[currentLanguage.value].taskUpdated ||
          "Task updated successfully",
      );
    }
    if (window.innerWidth < 1024) {
      showMobilePanel.value = false;
    }
  } catch (error) {
    console.error("Error saving task:", error);
    notificationStore.showError(
      taskData.isAddingTask
        ? locales[currentLanguage.value].errorCreatingTask ||
            "Error creating task"
        : locales[currentLanguage.value].errorUpdatingTask ||
            "Error updating task",
    );
  }
};

const handleDeleteTask = async (): Promise<void> => {
  if (selectedTask.value) {
    try {
      await taskStore.deleteTask(selectedTask.value.id);
      selectedTask.value = null;
      if (window.innerWidth < 1024) {
        showMobilePanel.value = false;
      }
      notificationStore.showSuccess(
        locales[currentLanguage.value].taskDeleted ||
          "Task deleted successfully",
      );
    } catch (error) {
      console.error("Error deleting task:", error);
      notificationStore.showError(
        locales[currentLanguage.value].errorDeletingTask ||
          "Error deleting task",
      );
    }
  }
};

const handleAddNewList = async (list: TaskList): Promise<void> => {
  await taskStore.addTaskList({ title: list.title });
};

const handleAddNewTag = async (tag: Tag): Promise<void> => {
  await taskStore.addTag({ title: tag.title });
};

const handleClosePanel = (): void => {
  selectedTask.value = null;
  showAddTaskPanel.value = false;
};

const handleCloseMobilePanel = (): void => {
  showMobilePanel.value = false;
  selectedTask.value = null;
  showAddTaskPanel.value = false;
};

const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = (): void => {
  isMobileMenuOpen.value = false;
};

const handlePreviousDay = async (): Promise<void> => {
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() - 1);
  currentDate.value = date.toISOString().split("T")[0];
  await taskStore.fetchTasksByDate(currentDate.value);
};

const handleNextDay = async (): Promise<void> => {
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() + 1);
  currentDate.value = date.toISOString().split("T")[0];
  await taskStore.fetchTasksByDate(currentDate.value);
};

const handleToday = async (): Promise<void> => {
  currentDate.value = new Date().toISOString().split("T")[0];
  await taskStore.fetchTasksByDate(currentDate.value);
};

const handleDateSelected = async (date: string): Promise<void> => {
  currentDate.value = date;
  await taskStore.fetchTasksByDate(date);
};

// Initialize store
onMounted(async () => {
  await taskStore.initialize();
});
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

[dir="rtl"] {
  direction: rtl;
}

[dir="ltr"] {
  direction: ltr;
}

/* RTL Support for positioning */
[dir="rtl"] .sidebar-mobile {
  right: 0;
  transform: translateX(100%);
}

[dir="rtl"] .sidebar-mobile.open {
  transform: translateX(0);
}

[dir="ltr"] .sidebar-mobile {
  left: 0;
  transform: translateX(-100%);
}

[dir="ltr"] .sidebar-mobile.open {
  transform: translateX(0);
}
</style>
