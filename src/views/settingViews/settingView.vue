<template>
  <div class="min-h-screen bg-white rounded-xl p-6 lg:shadow-lg flex flex-col">
    <div class="flex items-center lg:justify-between justify-center mb-6">
      <!-- Mobile menu button -->
      <button
        class="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
        @click="$emit('toggle-mobile-menu')"
      >
        <svg
          width="20"
          height="20"
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

      <h1 class="flex-1 text-2xl text-center font-bold text-gray-900">
        {{ locales[currentLanguage].settings }}
      </h1>
    </div>
    <!-- Change language -->
    <div class="space-y-4">
      <div class="flex flex-col space-y-2">
        <label class="text-sm font-medium text-gray-700">
          {{ locales[currentLanguage].language || "Language" }}:
        </label>
        <select
          :value="currentLanguage"
          @change="handleLanguageChange"
          class="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white text-gray-900"
        >
          <option value="en">English</option>
          <option value="fa">فارسی</option>
        </select>
      </div>
    </div>

    <!-- User Information Form -->
    <div class="mt-8 space-y-6">
      <h2 class="text-xl font-semibold text-gray-900">
        {{ locales[currentLanguage].userInformation }}
      </h2>

      <form @submit.prevent="handleEditProfile" class="space-y-4">
        <FormInput
          v-model="userInfoForm.username"
          :label="locales[currentLanguage].username"
          type="text"
          placeholder="Enter your username"
          :required="true"
          :disable="true"
        />

        <FormInput
          v-model="userInfoForm.email"
          :label="locales[currentLanguage].email"
          type="email"
          placeholder="Enter your email"
          :required="true"
          :disable="true"
        />

        <FormInput
          :model-value="userInfoForm.first_name || ''"
          @update:model-value="(value) => (userInfoForm.first_name = value)"
          :label="locales[currentLanguage].firstName"
          type="text"
          placeholder="Enter your first name"
          :required="true"
        />

        <FormInput
          :model-value="userInfoForm.last_name || ''"
          @update:model-value="(value) => (userInfoForm.last_name = value)"
          :label="locales[currentLanguage].lastName"
          type="text"
          placeholder="Enter your last name"
          :required="true"
        />

        <button
          type="submit"
          class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {{ locales[currentLanguage].editProfile }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale, IUserInfo } from "@/types";
import { onMounted, reactive, computed } from "vue";
import FormInput from "@/components/scheduler/rightPanelComponents/FormInput.vue";
import { editUserInfo, getCurrentUserData } from "@/api/authService";
import { useNotificationStore } from "@/store/notificationStore";
import { locales } from "@/locales/schedulerLocales/index";
import { currentLanguage } from "@/main";

const userInfoForm = reactive<IUserInfo>({
  id: -1,
  username: "",
  email: "",
  first_name: "",
  last_name: "",
});

defineProps<{
  currentLanguage: string;
  locales: Record<string, Locale>;
}>();

const emit = defineEmits<{
  "toggle-mobile-menu": [];
  "language-changed": [];
}>();

const notificationStore = useNotificationStore();
const currentLang = computed(() => currentLanguage.value);

const handleLanguageChange = (): void => {
  emit("language-changed");
};

const handleEditProfile = async (): Promise<void> => {
  // Validate required fields
  if (!userInfoForm.first_name?.trim() && !userInfoForm.last_name?.trim()) {
    notificationStore.showError(
      locales[currentLang.value].firstNameRequired +
        " " +
        locales[currentLang.value].lastNameRequired,
    );
    return;
  }

  if (!userInfoForm.first_name?.trim()) {
    notificationStore.showError(locales[currentLang.value].firstNameRequired);
    return;
  }

  if (!userInfoForm.last_name?.trim()) {
    notificationStore.showError(locales[currentLang.value].lastNameRequired);
    return;
  }

  try {
    const res = await editUserInfo(userInfoForm);

    // Update local state with response data
    if (res.data) {
      userInfoForm.first_name = res.data.first_name;
      userInfoForm.last_name = res.data.last_name;
    }

    // Show success notification
    notificationStore.showSuccess(
      locales[currentLang.value].profileUpdatedSuccessfully,
    );
  } catch (error: any) {
    console.error("Error updating profile:", error);

    // Handle different types of errors
    if (error.response) {
      // API Error - server responded with error status
      const status = error.response.status;
      const errorData = error.response.data;

      if (status === 400) {
        // Bad request - validation errors
        if (errorData) {
          // Check for specific field errors
          if (errorData.first_name) {
            notificationStore.showError(
              errorData.first_name[0] ||
                locales[currentLang.value].errorUpdatingProfile,
            );
          } else if (errorData.last_name) {
            notificationStore.showError(
              errorData.last_name[0] ||
                locales[currentLang.value].errorUpdatingProfile,
            );
          } else {
            // Show all validation errors
            const allErrors = Object.values(errorData).flat().join(" ");
            notificationStore.showError(allErrors);
          }
        } else {
          notificationStore.showError(
            locales[currentLang.value].errorUpdatingProfile,
          );
        }
      } else if (status === 401) {
        // Unauthorized
        notificationStore.showError(
          "Your session has expired. Please log in again.",
        );
      } else if (status >= 500) {
        // Server error
        notificationStore.showError("Server error. Please try again later.");
      } else {
        // Other API errors
        notificationStore.showError(
          errorData?.detail ||
            errorData?.message ||
            locales[currentLang.value].errorUpdatingProfile,
        );
      }
    } else if (error.request) {
      // Network Error - request was made but no response received
      notificationStore.showError(
        "Network error. Please check your connection and try again.",
      );
    } else {
      // Something else happened
      notificationStore.showError(
        error.message || locales[currentLang.value].errorUpdatingProfile,
      );
    }
  }
};

onMounted(async () => {
  try {
    const res = await getCurrentUserData();
    userInfoForm.id = res.data.id;
    userInfoForm.username = res.data.username;
    userInfoForm.email = res.data.email;
    userInfoForm.first_name = res.data.first_name;
    userInfoForm.last_name = res.data.last_name;
  } catch (error) {
    console.error("Error fetching user data:", error);
    notificationStore.showError(
      "Error loading user information. Please refresh the page.",
    );
  }
});
</script>

<style></style>
