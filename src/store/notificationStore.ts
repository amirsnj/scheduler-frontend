// stores/notification.ts
import { defineStore } from "pinia";

export interface Notification {
  id: number;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [] as Notification[],
  }),

  getters: {
    getNotifications: (state) => state.notifications,
  },

  actions: {
    showNotification(
      type: Notification["type"],
      message: string,
      duration = 5000,
    ) {
      const id = Date.now() + Math.random(); // Ensure uniqueness
      const notification: Notification = {
        id,
        type,
        message,
        duration,
      };

      this.notifications.push(notification);

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          this.removeNotification(id);
        }, duration);
      }

      return id;
    },

    showSuccess(message: string, duration = 5000) {
      return this.showNotification("success", message, duration);
    },

    showError(message: string, duration = 5000) {
      return this.showNotification("error", message, duration);
    },

    showWarning(message: string, duration = 5000) {
      return this.showNotification("warning", message, duration);
    },

    showInfo(message: string, duration = 5000) {
      return this.showNotification("info", message, duration);
    },

    removeNotification(id: number) {
      const index = this.notifications.findIndex((n) => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },

    clearAllNotifications() {
      this.notifications = [];
    },
  },
});
