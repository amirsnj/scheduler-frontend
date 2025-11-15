<template>
  <div
    :dir="currentLanguage === 'fa' ? 'rtl' : 'ltr'"
    class="h-screen bg-white lg:bg-gray-50 overflow-hidden flex flex-col"
  >
    <!-- Main Layout -->
    <div class="flex flex-1 overflow-hidden min-h-0">
      <!-- Sidebar Component -->
      <div class="hidden lg:block">
        <SideBarView
          :current-language="currentLanguage"
          :locales="locales"
          :active-item="activeItem"
          :tasks="taskStore.tasks"
          :task-lists="taskListStore.taskLists"
          :tags="tagStore.tags"
          @item-selected="handleItemSelected"
          @language-changed="handleLanguageChange"
          @list-selected="handleListSelected"
          @tag-selected="handleTagSelected"
          @add-new-list="handleAddNewList"
          @add-new-tag="handleAddNewTag"
          @edit-list="handleEditList"
          @delete-list="handleDeleteList"
          @edit-tag="handleEditTag"
          @delete-tag="handleDeleteTag"
          @settings-clicked="handleSettingsClicked"
          @sign-out="handleSignOut"
        />
      </div>

      <!-- Mobile Sidebar -->
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed inset-0 bg-black opacity-60 z-40"
        @click="closeMobileMenu"
      ></div>

      <div
        class="lg:hidden fixed z-50 h-full transition-transform duration-300 ease-in-out"
        :class="['sidebar-mobile', isMobileMenuOpen ? 'open' : '']"
      >
        <SideBarView
          :current-language="currentLanguage"
          :locales="locales"
          :active-item="activeItem"
          :tasks="taskStore.tasks"
          :task-lists="taskListStore.taskLists"
          :tags="tagStore.tags"
          :is-mobile="true"
          :is-mobile-open="isMobileMenuOpen"
          @item-selected="handleItemSelected"
          @language-changed="handleLanguageChange"
          @close-mobile="closeMobileMenu"
          @tag-selected="handleTagSelected"
          @list-selected="handleListSelected"
          @add-new-list="handleAddNewList"
          @add-new-tag="handleAddNewTag"
          @edit-list="handleEditList"
          @delete-list="handleDeleteList"
          @edit-tag="handleEditTag"
          @delete-tag="handleDeleteTag"
          @settings-clicked="handleSettingsClicked"
          @sign-out="handleSignOut"
        />
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex min-h-0 overflow-hidden">
        <!-- Task List Section -->
        <div
          :class="[
            'flex-1 lg:flex-none lg:w-96 xl:w-1/2 h-full',
            route.name === 'Setting' ? 'overflow-y-auto' : 'overflow-hidden',
          ]"
        >
          <router-view v-slot="{ Component }">
            <component
              :is="Component"
              v-bind="getComponentProps(route.name)"
              v-on="getComponentEvents(route.name)"
            />
          </router-view>
        </div>

        <!-- Right Panel -->
        <div class="hidden lg:block flex-1 h-full overflow-hidden">
          <RightPanel
            :current-language="currentLanguage"
            :locales="locales"
            :selected-task="selectedTask"
            :task-lists="taskListStore.taskLists"
            :tags="tagStore.tags"
            :show-panel="!!selectedTask || showAddTaskPanel"
            :is-adding-task="showAddTaskPanel"
            :is-saving="isSaving"
            :is-deleting="isDeleting"
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
            :task-lists="taskListStore.taskLists"
            :tags="tagStore.tags"
            :show-panel="true"
            :is-adding-task="showAddTaskPanel"
            :is-mobile="true"
            :is-saving="isSaving"
            :is-deleting="isDeleting"
            @save-task="handleSaveTask"
            @delete-task="handleDeleteTask"
            @close-panel="handleCloseMobilePanel"
          />
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <ConfirmDeleteModal
      :is-visible="showDeleteModal"
      :title="deleteModalData.title"
      :message="deleteModalData.message"
      :confirm-text="locales[currentLanguage].delete"
      :cancel-text="locales[currentLanguage].cancel"
      @confirm="handleConfirmDelete"
      @cancel="handleCancelDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import SideBarView from "@/views/schedulerViews/sideBarView.vue";
import RightPanel from "@/views/schedulerViews/rightPanelView.vue";
import ConfirmDeleteModal from "@/components/scheduler/ConfirmDeleteModal.vue";
import { locales } from "@/locales/schedulerLocales/index";
import type { ITask, ITaskCreate, ITaskList, ITag } from "@/types/index";
import { currentLanguage } from "@/main";
import { useTaskStore } from "@/store/taskStore";
import { useTaskListStore } from "@/store/taskListStore";
import { useTagStore } from "@/store/tagStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

// Pinia stores
const taskStore = useTaskStore();
const taskListStore = useTaskListStore();
const tagStore = useTagStore();
const notificationStore = useNotificationStore();

const router = useRouter();
const route = useRoute();

const routeList = computed(() => route.query.list as string | undefined);
const routeFilter = computed(() => (route.params.filter as string) || "all");
const routeDate = computed(() => route.query.date as string | undefined);

// Reactive data
const activeItem = ref<string>("all");
const selectedTask = ref<ITask | null>(null);
const isMobileMenuOpen = ref<boolean>(false);
const showMobilePanel = ref<boolean>(false);
const showAddTaskPanel = ref<boolean>(false);
const currentDate = ref<string>(new Date().toISOString().split("T")[0]);

// Button loading states for task actions
const isSaving = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const togglingTaskIds = ref<Record<number, boolean>>({});

// Delete modal state
const showDeleteModal = ref<boolean>(false);
const deleteModalData = ref<{
  title: string;
  message: string;
  type: "list" | "tag";
  id: number;
}>({
  title: "",
  message: "",
  type: "list",
  id: 0,
});

const filteredTasks = computed(() => {
  // Filter by list/category
  if (routeList.value) {
    const targetList = taskListStore.taskLists.find(
      (taskList) => taskList.title === routeList.value,
    );
    if (targetList) {
      return taskStore.tasksByCategory(targetList.id);
    }
    return [];
  }

  // Filter by date and filter type
  switch (routeFilter.value) {
    case "all":
      return taskStore.todayTasks;

    case "upcoming":
      return taskStore.upcomingTasks;

    case "completed":
      return taskStore.completedTasks;

    case "calendar":
      if (routeDate.value) {
        taskStore.fetchTasksByDate(routeDate.value);
        return taskStore.tasksForDate(routeDate.value);
      }
      return taskStore.todayTasks;

    default:
      return taskStore.todayTasks;
  }
});

watch(routeFilter, (newVal) => {
  activeItem.value = newVal;
});

// اضافه کردن watch برای routeList
watch(routeList, (newVal) => {
  if (newVal) {
    activeItem.value = `${newVal}`;
  }
});

watch(
  routeDate,
  (newDate: any) => {
    if (newDate && routeFilter.value === "calendar") {
      currentDate.value = newDate;
    }
  },
  { immediate: true },
);

watch(routeFilter, (newFilter) => {
  activeItem.value = newFilter;

  // اگر به calendar رفت و تاریخ نداشت، امروز را بگذار
  if (newFilter === "calendar" && !routeDate.value) {
    const today = new Date().toISOString().split("T")[0];
    router.replace({
      name: "Tasks",
      params: { filter: "calendar" },
      query: { date: today },
    });
  }
});

// Methods
const handleLanguageChange = (): void => {
  const currentLang = currentLanguage.value === "en" ? "fa" : "en";
  currentLanguage.value = currentLang;
  localStorage.setItem("lang", currentLang);
};

// const handleItemSelected = (item: string): void => {
//   router.push({ path: `/scheduler/tasks/${item}` });
//   activeItem.value = item;
//   selectedTask.value = null;
//   showAddTaskPanel.value = false;
//   if (isMobileMenuOpen.value) {
//     closeMobileMenu();
//   }
// };

const handleItemSelected = (item: string): void => {
  if (item === "calendar") {
    const today = new Date().toISOString().split("T")[0];
    router.push({
      name: "Tasks",
      params: { filter: "calendar" },
      query: { date: today },
    });
  } else if (item === "planetary") {
    router.push({
      name: "Planetary",
      params: {},
      query: {},
    });
  } else {
    router.push({
      name: "Tasks",
      params: { filter: item },
      query: {}, // پاک کردن query ها
    });
  }
  activeItem.value = item;
  selectedTask.value = null;
  showAddTaskPanel.value = false;
  if (isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleListSelected = (listName: string): void => {
  // ✅ استفاده از query برای list و params برای filter
  router.push({
    name: "Tasks",
    params: { filter: "all" }, // یا می‌توانید undefined بگذارید
    query: { list: listName },
  });
  activeItem.value = `${listName}`;
  selectedTask.value = null;
  showAddTaskPanel.value = false;
  if (isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleTagSelected = (tagId: number): void => {
  // Logic for filtering tasks by selected tag
  console.log("Tag selected:", tagId);
  // You can implement tag-based filtering here
};

const handleTaskSelected = (task: ITask): void => {
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

const handleToggleTaskCompletion = async (
  taskId: number | string,
): Promise<void> => {
  const id = typeof taskId === "string" ? parseInt(taskId) : taskId;
  togglingTaskIds.value[id] = true;
  try {
    await taskStore.toggleTaskComplete(id);
  } catch (error) {
    console.error("Error toggling task completion:", error);
    notificationStore.showError(
      locales[currentLanguage.value].errorUpdatingTask || "Error updating task",
    );
  } finally {
    delete togglingTaskIds.value[id];
  }
};

const handleSaveTask = async (
  taskData: ITaskCreate & { isAddingTask: boolean },
): Promise<void> => {
  try {
    isSaving.value = true;
    if (taskData.isAddingTask) {
      await taskStore.addTask(taskData);
      showAddTaskPanel.value = false;
      notificationStore.showSuccess(locales[currentLanguage.value].taskCreated);
    } else if (selectedTask.value) {
      await taskStore.updateTask(selectedTask.value.id, {
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        priority_level: taskData.priority_level,
        scheduled_date: taskData.scheduled_date,
        start_time: taskData.start_time,
        end_time: taskData.end_time,
        dead_line: taskData.dead_line,
        is_completed: taskData.is_completed || false,
        subTasks: taskData.subTasks.map((subTask) => {
          if (subTask.id !== undefined) {
            return {
              id: subTask.id,
              title: subTask.title,
              is_completed: subTask.is_completed,
            };
          }
          return {
            title: subTask.title,
            is_completed: subTask.is_completed,
          };
        }),
        tags: taskData.tags,
      });
      selectedTask.value = null;
      notificationStore.showSuccess(locales[currentLanguage.value].taskUpdated);
    }
    if (window.innerWidth < 1024) {
      showMobilePanel.value = false;
    }
  } catch (error) {
    console.error("Error saving task:", error);

    if (axios.isAxiosError(error)) {
      notificationStore.showError(
        taskData.isAddingTask
          ? error.response?.data?.detail ||
              locales[currentLanguage.value].errorCreatingTask
          : error.response?.data?.detail ||
              locales[currentLanguage.value].errorUpdatingTask,
      );
    } else {
      notificationStore.showError(
        locales[currentLanguage.value].errorUpdatingTask,
      );
    }
  } finally {
    isSaving.value = false;
  }
};

const handleDeleteTask = async (): Promise<void> => {
  if (selectedTask.value) {
    try {
      isDeleting.value = true;
      await taskStore.deleteTask(selectedTask.value.id);
      selectedTask.value = null;
      if (window.innerWidth < 1024) {
        showMobilePanel.value = false;
      }
      notificationStore.showSuccess(locales[currentLanguage.value].taskDeleted);
    } catch (error) {
      notificationStore.showError(
        locales[currentLanguage.value].errorDeletingTask,
      );
    } finally {
      isDeleting.value = false;
    }
  }
};

// New methods for list and tag management
const handleAddNewList = async (list: ITaskList): Promise<void> => {
  try {
    await taskListStore.addTaskList({ title: list.title });
    notificationStore.showSuccess(locales[currentLanguage.value].listCreated);
  } catch (error) {
    console.log("error adding new list:", error);
    notificationStore.showError(
      locales[currentLanguage.value].errorCreatingList,
    );
  }
};

const handleAddNewTag = async (tag: Omit<ITag, "id">): Promise<void> => {
  try {
    await tagStore.addTag({ title: tag.title });
    notificationStore.showSuccess(locales[currentLanguage.value].tagCreated);
  } catch (error) {
    console.error("Error adding tag:", error);
    notificationStore.showError(
      locales[currentLanguage.value].errorCreatingTag,
    );
  }
};

const handleEditList = async (
  listId: number,
  newTitle: string,
): Promise<void> => {
  try {
    await taskListStore.updateTaskList(listId, { title: newTitle });
    notificationStore.showSuccess(locales[currentLanguage.value].listUpdated);
  } catch (error) {
    console.error("Error editing list:", error);
    notificationStore.showError(
      locales[currentLanguage.value].errorUpdatingList,
    );
  }
};

const handleDeleteList = (listId: number): void => {
  const list = taskListStore.taskLists.find((l) => l.id === listId);
  if (list) {
    deleteModalData.value = {
      title: locales[currentLanguage.value].deleteList,
      message: `${locales[currentLanguage.value].deleteConfirm || "Are you sure you want to delete"} "${list.title}"? ${locales[currentLanguage.value].deleteWarning || "This action cannot be undone."}`,
      type: "list",
      id: listId,
    };
    showDeleteModal.value = true;
  }
};

const handleEditTag = async (
  tagId: number,
  newTitle: string,
): Promise<void> => {
  try {
    await tagStore.updateTag(tagId, { title: newTitle });
    notificationStore.showSuccess(
      locales[currentLanguage.value].tagUpdated || "Tag updated successfully",
    );
  } catch (error) {
    console.error("Error editing tag:", error);
    notificationStore.showError(
      locales[currentLanguage.value].errorUpdatingTag || "Error updating tag",
    );
  }
};

const handleDeleteTag = (tagId: number): void => {
  const tag = tagStore.tags.find((t) => t.id === tagId);
  if (tag) {
    deleteModalData.value = {
      title: locales[currentLanguage.value].deleteTag || "Delete Tag",
      message: `${locales[currentLanguage.value].deleteConfirm || "Are you sure you want to delete"} "${tag.title}"? ${locales[currentLanguage.value].deleteWarning || "This action cannot be undone."}`,
      type: "tag",
      id: tagId,
    };
    showDeleteModal.value = true;
  }
};

const handleConfirmDelete = async (): Promise<void> => {
  try {
    if (deleteModalData.value.type === "list") {
      await taskListStore.deleteTaskList(deleteModalData.value.id);
      notificationStore.showSuccess(
        locales[currentLanguage.value].listDeleted ||
          "List deleted successfully",
      );
    } else {
      await tagStore.deleteTag(deleteModalData.value.id);
      notificationStore.showSuccess(
        locales[currentLanguage.value].tagDeleted || "Tag deleted successfully",
      );
    }
  } catch (error) {
    console.error("Error deleting:", error);
    notificationStore.showError(
      deleteModalData.value.type === "list"
        ? locales[currentLanguage.value].errorDeletingList ||
            "Error deleting list"
        : locales[currentLanguage.value].errorDeletingTag ||
            "Error deleting tag",
    );
  } finally {
    showDeleteModal.value = false;
  }
};

const handleCancelDelete = (): void => {
  showDeleteModal.value = false;
};

const handleSettingsClicked = (): void => {
  showAddTaskPanel.value = false;
  selectedTask.value = null;
  router.push({
    name: "Setting",
    params: {},
  });
  if (isMobileMenuOpen.value) {
    closeMobileMenu();
  }
};

const handleSignOut = (): void => {
  localStorage.clear();
  location.reload();
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
  const newDate = date.toISOString().split("T")[0];

  currentDate.value = newDate;

  router.push({
    name: "Tasks",
    params: { filter: "calendar" },
    query: { date: newDate },
  });
};

const handleNextDay = async (): Promise<void> => {
  const date = new Date(currentDate.value);
  date.setDate(date.getDate() + 1);
  const newDate = date.toISOString().split("T")[0];

  currentDate.value = newDate;

  router.push({
    name: "Tasks",
    params: { filter: "calendar" },
    query: { date: newDate },
  });
};

const handleToday = async (): Promise<void> => {
  const today = new Date().toISOString().split("T")[0];
  currentDate.value = today;

  router.push({
    name: "Tasks",
    params: { filter: "calendar" },
    query: { date: today },
  });
};

const handleDateSelected = async (date: string): Promise<void> => {
  currentDate.value = date;

  router.push({
    name: "Tasks",
    params: { filter: "calendar" },
    query: { date: date },
  });
};

//Sortin filter functions
const priorityWeight: Record<ITask["priority_level"], number> = {
  H: 3,
  M: 2,
  L: 1,
};

const sortTasks = (task: ITask[]): ITask[] => {
  return [...task].sort((a, b) => {
    const aHasStart = Boolean(a.start_time);
    const bHasStart = Boolean(b.start_time);

    if (a.is_completed !== b.is_completed) {
      return a.is_completed ? 1 : -1;
    }

    if (aHasStart && !bHasStart) return -1;
    if (!aHasStart && bHasStart) return 1;

    if (aHasStart && bHasStart) {
      const aTime = new Date(`${a.scheduled_date}T${a.start_time}`).getTime();
      const bTime = new Date(`${b.scheduled_date}T${b.start_time}`).getTime();
      if (aTime !== bTime) return aTime - bTime;
    }

    const aPriority = priorityWeight[a.priority_level];
    const bPriority = priorityWeight[b.priority_level];
    if (aPriority !== bPriority) return bPriority - aPriority;

    return a.id - b.id;
  });
};

// Dynamic props and events based on route component
const getComponentProps = (routeName: string | symbol | null | undefined) => {
  const name = typeof routeName === "string" ? routeName : "";

  switch (name) {
    case "Tasks":
      return {
        currentLanguage: currentLanguage.value,
        locales,
        activeItem: activeItem.value,
        tasks: sortTasks(filteredTasks.value),
        selectedTask: selectedTask.value,
        isLoading: taskStore.loading,
        currentDate: currentDate.value,
        togglingTaskIds: togglingTaskIds.value,
        "onUpdate:selectedDate": handleDateSelected,
      };
    case "Setting":
      return {
        currentLanguage: currentLanguage.value,
        locales,
      };
    default:
      return {};
  }
};

const getComponentEvents = (routeName: string | symbol | null | undefined) => {
  const name = typeof routeName === "string" ? routeName : "";

  switch (name) {
    case "Tasks":
      return {
        "task-selected": handleTaskSelected,
        "toggle-mobile-menu": toggleMobileMenu,
        "add-task": handleAddTask,
        "toggle-task-completion": handleToggleTaskCompletion,
        "previous-day": handlePreviousDay,
        "next-day": handleNextDay,
        today: handleToday,
        "update:selectedDate": handleDateSelected,
      };
    case "Setting":
      return {
        "toggle-mobile-menu": toggleMobileMenu,
        "language-changed": handleLanguageChange,
      };
    default:
      return {};
  }
};

// Initialize store
onMounted(async () => {
  await Promise.all([
    taskStore.fetchTasks(),
    taskListStore.fetchTaskLists(),
    tagStore.fetchTags(),
  ]);

  // ✅ اضافه کردن: sync activeItem با route
  if (routeList.value) {
    activeItem.value = `list-${routeList.value}`;
  } else {
    activeItem.value = routeFilter.value;
  }
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
