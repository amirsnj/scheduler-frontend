<template>
  <Teleport to="body">
    <div
      class="notification-container"
      :class="{ rtl: currentLanguage === 'fa' }"
    >
      <TransitionGroup name="notification" tag="div" class="notification-list">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="[
            'notification',
            `notification-${notification.type}`,
            { 'notification-rtl': currentLanguage === 'fa' },
          ]"
          @click="removeNotification(notification.id)"
        >
          <!-- Icon -->
          <div class="notification-icon">
            <!-- Success Icon -->
            <svg
              v-if="notification.type === 'success'"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-green-600"
            >
              <polyline points="20,6 9,17 4,12" />
            </svg>

            <!-- Error Icon -->
            <svg
              v-else-if="notification.type === 'error'"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-red-600"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>

            <!-- Warning Icon -->
            <svg
              v-else-if="notification.type === 'warning'"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-yellow-600"
            >
              <path
                d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
              />
              <path d="M12 9v4" />
              <path d="m12 17 .01 0" />
            </svg>

            <!-- Info Icon -->
            <svg
              v-else
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-blue-600"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m12 16 0-4" />
              <path d="m12 8 .01 0" />
            </svg>
          </div>

          <!-- Message -->
          <div class="notification-message">
            {{ notification.message }}
          </div>

          <!-- Close Button -->
          <button
            class="notification-close"
            @click.stop="removeNotification(notification.id)"
            :aria-label="currentLanguage === 'fa' ? 'بستن' : 'Close'"
          >
            <svg
              width="16"
              height="16"
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
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useNotificationStore } from "@/store/notificationStore";
import { currentLanguage } from "@/main";

const notificationStore = useNotificationStore();

const notifications = computed(() => notificationStore.getNotifications);

const removeNotification = (id: number) => {
  notificationStore.removeNotification(id);
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  pointer-events: none;
}

.notification-container.rtl {
  right: auto;
  left: 20px;
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 400px;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow:
    0 10px 25px rgba(0, 0, 0, 0.1),
    0 4px 6px rgba(0, 0, 0, 0.05);
  border-left: 4px solid;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 400px;
  min-width: 320px;
}

.notification:hover {
  transform: translateY(-2px);
  box-shadow:
    0 15px 35px rgba(0, 0, 0, 0.15),
    0 6px 10px rgba(0, 0, 0, 0.08);
}

.notification-rtl {
  border-left: none;
  border-right: 4px solid;
}

.notification-success {
  border-color: #10b981;
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
}

.notification-error {
  border-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%);
}

.notification-warning {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fefce8 100%);
}

.notification-info {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
}

.notification-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.notification-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  line-height: 1.5;
  word-break: break-word;
}

.notification-close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.notification-close:hover {
  color: #374151;
  background: rgba(0, 0, 0, 0.05);
}

/* Animations */
.notification-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.notification-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-30px) scale(0.95);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Responsive */
@media (max-width: 640px) {
  .notification-container {
    top: 10px;
    right: 10px;
    left: 10px;
    width: auto;
  }

  .notification-container.rtl {
    right: 10px;
    left: 10px;
  }

  .notification-list {
    max-width: none;
  }

  .notification {
    min-width: auto;
    max-width: none;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .notification {
    background: #1f2937;
    color: #f9fafb;
    box-shadow:
      0 10px 25px rgba(0, 0, 0, 0.3),
      0 4px 6px rgba(0, 0, 0, 0.2);
  }

  .notification-message {
    color: #f3f4f6;
  }

  .notification-success {
    background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
  }

  .notification-error {
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
  }

  .notification-warning {
    background: linear-gradient(135deg, #78350f 0%, #92400e 100%);
  }

  .notification-info {
    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  }
}
</style>
