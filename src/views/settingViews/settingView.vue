<template>
  <div class="min-h-screen bg-white rounded-xl p-6 lg:shadow-lg flex flex-col">
    <div
      class="relative flex items-center lg:justify-between justify-center mb-6"
    >
      <!-- Mobile menu button -->
      <button
        class="absolute left-0 lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
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

      <h1 class="text-2xl font-bold text-gray-900">
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

      <form @submit.prevent="handleSaveProfile" class="space-y-4">
        <FormInput
          v-model="userInfoForm.username"
          :label="locales[currentLanguage].username"
          type="text"
          placeholder="Enter your username"
          :required="true"
        />

        <FormInput
          v-model="userInfoForm.email"
          :label="locales[currentLanguage].email"
          type="email"
          placeholder="Enter your email"
          :required="true"
        />

        <FormInput
          :model-value="userInfoForm.first_name || ''"
          @update:model-value="(value) => (userInfoForm.first_name = value)"
          :label="locales[currentLanguage].firstName"
          type="text"
          placeholder="Enter your first name"
        />

        <FormInput
          :model-value="userInfoForm.last_name || ''"
          @update:model-value="(value) => (userInfoForm.last_name = value)"
          :label="locales[currentLanguage].lastName"
          type="text"
          placeholder="Enter your last name"
        />

        <button
          type="submit"
          class="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {{ locales[currentLanguage].saveProfile }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale, IUserInfo } from "@/types";
import { onMounted, reactive } from "vue";
import FormInput from "@/components/scheduler/rightPanelComponents/FormInput.vue";
import { getCurrentUserData } from "@/api/authService";

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

const handleLanguageChange = (): void => {
  emit("language-changed");
};

const handleSaveProfile = (): void => {
  // TODO: Implement save profile logic
  console.log("Saving profile:", userInfoForm);
};

onMounted(async () => {
  const res = await getCurrentUserData();
  userInfoForm.id = res.data.id;
  userInfoForm.username = res.data.username;
  userInfoForm.email = res.data.email;
  userInfoForm.first_name = res.data.first_name;
  userInfoForm.last_name = res.data.last_name;
});
</script>

<style></style>
