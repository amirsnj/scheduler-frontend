import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { ITask, ITaskCreate, ITaskUpdate } from "@/types";
import { locales } from "@/locales/schedulerLocales/index";
import { currentLanguage } from "@/main";
import {
  createTask,
  deleteTask,
  getTasks,
  fullUpdateTask as updateTaskAPI,
  toggleTaskCompletion as toggleTaskAPI,
  getTasksByDate,
} from "@/api/appService";
import { useNotificationStore } from "./notificationStore";
import { getTask } from "@/api/generated/endpoints";

function isToday(task: {
  scheduled_date: string;
  dead_line?: string | null;
}): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // normalize to midnight

  const scheduled = new Date(task.scheduled_date);
  scheduled.setHours(0, 0, 0, 0);

  // Rule 1: scheduled_date is today
  if (scheduled.getTime() === today.getTime()) {
    return true;
  }

  // Rule 2: scheduled_date is in the past, but dead_line is today or future
  if (task.dead_line) {
    const deadline = new Date(task.dead_line);
    deadline.setHours(0, 0, 0, 0);

    if (scheduled < today && deadline >= today) {
      return true;
    }
  }

  return false;
}

export const useTaskStore = defineStore("task", () => {
  // State
  const tasks = ref<ITask[]>([]);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const tasksByDate = ref<Map<string, ITask[]>>(new Map());

  const taskService = getTask();

  // Getters (Computed)
  const completedTasks = computed(() => {
    return tasks.value.filter((task) => task.is_completed && isToday(task));
  });

  const pendingTasks = computed(() => {
    return tasks.value.filter((task) => !task.is_completed && isToday(task));
  });

  const tasksByCategory = computed(() => (categoryId: number | null) => {
    return tasks.value.filter(
      (task) => task.category === categoryId && isToday(task),
    );
  });

  const tasksByPriority = computed(
    () => (priority: "medium" | "low" | "high") => {
      return tasks.value.filter(
        (task) => task.priority_level === priority && isToday(task),
      );
    },
  );

  const tasksByTag = computed(() => (tagId: number) => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) =>
        task.tags.some((tag) => tag.id === tagId) &&
        (task.scheduled_date === today || task.dead_line === today),
    );
  });

  const overdueTasks = computed(() => {
    const now = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) => task.dead_line && task.dead_line < now && !task.is_completed,
    );
  });

  const todayTasks = computed(() => {
    return tasks.value.filter((task) => isToday(task));
  });

  const upcomingTasks = computed(() => {
    const today = new Date().toISOString().split("T")[0];
    return tasks.value.filter(
      (task) => task.scheduled_date && task.scheduled_date > today,
    );
  });

  const taskStats = computed(() => ({
    total: tasks.value.length,
    completed: completedTasks.value.length,
    pending: pendingTasks.value.length,
    overdue: overdueTasks.value.length,
  }));

  const tasksForDate = computed(() => (date: string) => {
    return tasksByDate.value.get(date) || [];
  });

  // Task Actions
  const fetchTasks = async (): Promise<void> => {
    loading.value = true;
    error.value = null;
    try {
      const response = await taskService.taskControllerGetAll({
        limit: 1000,
        offset: 0,
      });
      tasks.value =
        response.results?.map(
          (task): ITask => ({
            id: task.id,
            title: task.title,
            description: task.description ?? "",
            is_completed: task.isCompleted,
            created_at: task.createdAt,
            priority_level: task.priorityLevel,
            scheduled_date: task.scheduledDate,
            dead_line: task.deadLine,
            updated_at: task.createdAt,
            start_time: task.startTime,
            end_time: task.endTime,
            category: task.category?.id,
            subTasks: task.subTasks.map((st) => ({
              id: st.id,
              title: st.title,
              is_completed: st.isCompleted!,
            })),
            tags: task.tags,
          }),
        ) ?? [];

      const today = new Date().toISOString().split("T")[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      tasksByDate.value.set(
        today,
        tasks.value.filter(
          (task: ITask) =>
            task.scheduled_date === today ||
            (task.dead_line && task.dead_line === today),
        ),
      );
      tasksByDate.value.set(
        tomorrowStr,
        tasks.value.filter(
          (task: ITask) =>
            task.scheduled_date === tomorrowStr ||
            (task.dead_line && task.dead_line === tomorrowStr),
        ),
      );
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorFetchingTasks ||
        "Error fetching tasks";
      console.error("Error fetching tasks:", err);
    } finally {
      loading.value = false;
    }
  };

  const fetchTasksByDate = async (date: string): Promise<void> => {
    if (tasksByDate.value.has(date)) {
      return;
    }
    loading.value = true;
    error.value = null;
    try {
      const response = await getTasksByDate(date);
      const fetchedTasks = response.data || [];
      tasksByDate.value.set(date, fetchedTasks);
      tasks.value = [
        ...tasks.value.filter(
          (task) => task.scheduled_date !== date && task.dead_line !== date,
        ),
        ...fetchedTasks,
      ];
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorFetchingTasks ||
        "Error fetching tasks";
      console.error(`Error fetching tasks for date ${date}:`, err);
      const notificationStore = useNotificationStore();
      notificationStore.showError(
        locales[currentLanguage.value].errorFetchingTasks ||
          "Error fetching tasks",
      );
    } finally {
      loading.value = false;
    }
  };

  const addTask = async (taskData: ITaskCreate): Promise<void> => {
    error.value = null;
    try {
      const response = await taskService.taskControllerCreate({
        title: taskData.title,
        description: taskData.description,
        startTime: taskData.start_time ?? undefined,
        endTime: taskData.end_time ?? undefined,
        categoryId: taskData.category!,
        deadLine: taskData.dead_line ?? undefined,
        scheduledDate: taskData.scheduled_date ?? undefined,
        isCompleted: taskData.is_completed,
        priorityLevel: "medium",
        subTasks: taskData.subTasks.map((st) => ({
          title: st.title,
          isCompleted: st.is_completed,
        })),
        tags: taskData.tags,
      });

      const newTask = response.result!;
      const transformed: ITask = {
        id: newTask.id,
        title: newTask.title,
        description: newTask.description ?? "",
        is_completed: newTask.isCompleted!,
        priority_level: newTask.priorityLevel,
        scheduled_date: newTask.scheduledDate!,
        end_time: newTask.endTime,
        start_time: newTask.startTime,
        dead_line: newTask.deadLine,
        created_at: newTask.createdAt,
        updated_at: newTask.createdAt,
        subTasks: newTask.subTasks.map((sub) => ({
          id: sub.id,
          title: sub.title,
          is_completed: sub.isCompleted!,
        })),
        tags: newTask.tags,
        category: newTask.category?.id,
      };

      tasks.value.push(transformed);

      if (
        taskData.scheduled_date &&
        tasksByDate.value.has(taskData.scheduled_date)
      ) {
        tasksByDate.value.get(taskData.scheduled_date)!.push(transformed);
      }
      if (taskData.dead_line && tasksByDate.value.has(taskData.dead_line)) {
        tasksByDate.value.get(taskData.dead_line)!.push(transformed);
      }
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorCreatingTask ||
        "Error creating task";
      console.error("Error creating task:", err);
      throw err;
    }
  };

  const updateTask = async (
    taskId: number,
    updates: ITaskUpdate,
  ): Promise<void> => {
    error.value = null;
    try {
      const response = await taskService.taskControllerUpdate(taskId, {
        id: taskId,
        title: updates.title,
        description: updates.description,
        isCompleted: updates.is_completed,
        deadLine: updates.dead_line,
        categoryId: updates.category,
        endTime: updates.end_time,
        priorityLevel: "high",
        scheduledDate: updates.scheduled_date ?? undefined,
        startTime: updates.start_time,
        subTasks: updates.subTasks.map((st) => ({
          id: st.id,
          isCompleted: st.is_completed,
          title: st.title,
        })),
        tags: updates.tags,
      });

      const taskIndex = tasks.value.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) throw new Error("Task not found");

      const oldScheduledDate = tasks.value[taskIndex].scheduled_date;
      const oldDeadline = tasks.value[taskIndex].dead_line;

      const outputRes = response.result!;
      const task: ITask = {
        id: outputRes.id,
        title: outputRes.title,
        description: outputRes.description ?? "",
        is_completed: outputRes.isCompleted,
        scheduled_date: outputRes.scheduledDate,
        dead_line: outputRes.deadLine,
        end_time: outputRes.endTime,
        start_time: outputRes.startTime,
        created_at: outputRes.createdAt,
        priority_level: outputRes.priorityLevel,
        updated_at: outputRes.createdAt,
        category: outputRes?.category?.id,
        subTasks: outputRes.subTasks.map((st) => ({
          id: st.id,
          title: st.title,
          is_completed: st.isCompleted!,
        })),
        tags: outputRes.tags,
      };

      tasks.value[taskIndex] = {
        ...task,
        updated_at: new Date().toISOString(),
      };

      if (oldScheduledDate && tasksByDate.value.has(oldScheduledDate)) {
        tasksByDate.value.set(
          oldScheduledDate,
          tasksByDate.value
            .get(oldScheduledDate)!
            .filter((task) => task.id !== taskId),
        );
      }
      if (oldDeadline && tasksByDate.value.has(oldDeadline)) {
        tasksByDate.value.set(
          oldDeadline,
          tasksByDate.value
            .get(oldDeadline)!
            .filter((task) => task.id !== taskId),
        );
      }
      if (
        updates.scheduled_date &&
        tasksByDate.value.has(updates.scheduled_date)
      ) {
        tasksByDate.value.get(updates.scheduled_date)!.push({
          id: response.result!.id,
          title: response.result!.title,
          description: response.result!.description,
          is_completed: response.result!.isCompleted,
          created_at: response.result!.createdAt,
          priority_level: response.result!.priorityLevel,
          scheduled_date: response.result!.scheduledDate,
          end_time: response.result!.endTime,
          updated_at: response.result!.createdAt,
          category: response.result?.category?.id,
          dead_line: response.result!.deadLine,
          start_time: response.result!.startTime,
          subTasks: response.result!.subTasks.map((st) => ({
            id: st.id,
            title: st.title,
            is_completed: !!st?.isCompleted,
          })),
          tags: response.result!.tags,
        });
      }
      if (updates.dead_line && tasksByDate.value.has(updates.dead_line)) {
        tasksByDate.value.get(updates.dead_line)!.push({
          id: response.result!.id,
          title: response.result!.title,
          description: response.result!.description,
          is_completed: response.result!.isCompleted,
          created_at: response.result!.createdAt,
          priority_level: response.result!.priorityLevel,
          scheduled_date: response.result!.scheduledDate,
          end_time: response.result!.endTime,
          updated_at: response.result!.createdAt,
          category: response.result?.category?.id,
          dead_line: response.result!.deadLine,
          start_time: response.result!.startTime,
          subTasks: response.result!.subTasks.map((st) => ({
            id: st.id,
            title: st.title,
            is_completed: !!st?.isCompleted,
          })),
          tags: response.result!.tags,
        });
      }
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorUpdatingTask ||
        "Error updating task";
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const removeTask = async (taskId: number): Promise<void> => {
    error.value = null;
    try {
      await deleteTask(taskId);
      const taskIndex = tasks.value.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) throw new Error("Task not found");

      const scheduledDate = tasks.value[taskIndex].scheduled_date;
      const deadline = tasks.value[taskIndex].dead_line;

      tasks.value.splice(taskIndex, 1);

      if (scheduledDate && tasksByDate.value.has(scheduledDate)) {
        tasksByDate.value.set(
          scheduledDate,
          tasksByDate.value
            .get(scheduledDate)!
            .filter((task) => task.id !== taskId),
        );
      }
      if (deadline && tasksByDate.value.has(deadline)) {
        tasksByDate.value.set(
          deadline,
          tasksByDate.value.get(deadline)!.filter((task) => task.id !== taskId),
        );
      }
    } catch (err) {
      error.value =
        locales[currentLanguage.value].errorDeletingTask ||
        "Error deleting task";
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  const toggleTaskComplete = async (taskId: number): Promise<void> => {
    const task = tasks.value.find((t) => t.id === taskId);
    if (task) {
      try {
        const response = await toggleTaskAPI(taskId, task.is_completed);
        task.is_completed = !task.is_completed;
        task.updated_at = response.data.updated_at;
      } catch (err) {
        error.value =
          locales[currentLanguage.value].errorUpdatingTask ||
          "Error updating task";
        console.error("Error toggling task completion:", err);
        throw err;
      }
    }
  };

  // SubTask Actions
  // const addSubTask = async (
  //   taskId: number,
  //   subTaskData: Omit<ISubTask, "id">,
  // ): Promise<void> => {
  //   const task = tasks.value.find((t) => t.id === taskId);
  //   if (task) {
  //     const newSubTask: ISubTask = {
  //       ...subTaskData,
  //       id: Date.now(),
  //     };
  //     task.subTasks.push(newSubTask);
  //     await updateTask(taskId, { subTasks: task.subTasks });
  //   }
  // };

  // const updateSubTask = async (
  //   taskId: number,
  //   subTaskId: number,
  //   updates: Partial<ISubTask>,
  // ): Promise<void> => {
  //   const task = tasks.value.find((t) => t.id === taskId);
  //   if (task) {
  //     const subTaskIndex = task.subTasks.findIndex((st) => st.id === subTaskId);
  //     if (subTaskIndex !== -1) {
  //       task.subTasks[subTaskIndex] = {
  //         ...task.subTasks[subTaskIndex],
  //         ...updates,
  //       };
  //       await updateTask(taskId, { subTasks: task.subTasks });
  //     }
  //   }
  // };

  // const deleteSubTask = async (
  //   taskId: number,
  //   subTaskId: number,
  // ): Promise<void> => {
  //   const task = tasks.value.find((t) => t.id === taskId);
  //   if (task) {
  //     task.subTasks = task.subTasks.filter((st) => st.id !== subTaskId);
  //     await updateTask(taskId, { subTasks: task.subTasks });
  //   }
  // };

  // const toggleSubTaskComplete = async (
  //   taskId: number,
  //   subTaskId: number,
  // ): Promise<void> => {
  //   const task = tasks.value.find((t) => t.id === taskId);
  //   if (task) {
  //     const subTask = task.subTasks.find((st) => st.id === subTaskId);
  //     if (subTask) {
  //       await updateSubTask(taskId, subTaskId, {
  //         is_completed: !subTask.is_completed,
  //       });
  //     }
  //   }
  // };

  // Utility Actions
  const clearError = (): void => {
    error.value = null;
  };

  const getTaskById = (taskId: number): ITask | undefined => {
    return tasks.value.find((task) => task.id === taskId);
  };

  return {
    // State
    tasks,
    loading,
    error,
    tasksByDate,

    // Getters
    completedTasks,
    pendingTasks,
    tasksByCategory,
    tasksByPriority,
    tasksByTag,
    overdueTasks,
    todayTasks,
    upcomingTasks,
    taskStats,
    tasksForDate,

    // Task Actions
    fetchTasks,
    fetchTasksByDate,
    addTask,
    updateTask,
    deleteTask: removeTask,
    toggleTaskComplete,

    // SubTask Actions
    // addSubTask,
    // updateSubTask,
    // deleteSubTask,
    // toggleSubTaskComplete,

    // Utility Actions
    clearError,
    getTaskById,
  };
});
