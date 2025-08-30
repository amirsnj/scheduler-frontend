<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    :class="{ rtl: currentLanguage === 'fa' }"
  >
    <div class="max-w-md w-full space-y-8">
      <!-- Header -->
      <div class="text-center">
        <div
          class="mx-auto h-12 w-12 bg-blue-500 rounded-xl flex items-center justify-center mb-6"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="text-white"
          >
            <polyline points="9,11 12,14 22,4" />
            <path
              d="M21,12v7a2,2 0 0,1 -2,2H5a2,2 0 0,1 -2,-2V5a2,2 0 0,1 2,-2h11"
            />
          </svg>
        </div>

        <h2 class="text-3xl font-bold text-gray-900 mb-2">
          {{ locales[currentLanguage].createAccount }}
        </h2>
        <p class="text-gray-600">
          {{ locales[currentLanguage].getStarted }}
        </p>
      </div>

      <!-- Register Form -->
      <div class="bg-white rounded-xl shadow-lg p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- First Name and Last Name Row -->
          <div class="grid grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label
                for="firstName"
                class="block text-sm font-medium text-gray-700 mb-2"
                :class="{ 'text-right': currentLanguage === 'fa' }"
              >
                {{ locales[currentLanguage].firstName }}
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 flex items-center pointer-events-none"
                  :class="
                    currentLanguage === 'fa' ? 'right-0 pr-3' : 'left-0 pl-3'
                  "
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-gray-400"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  v-model="formData.firstName"
                  class="w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  :class="[
                    { 'border-red-300 focus:ring-red-500': errors.firstName },
                    currentLanguage === 'fa'
                      ? 'pr-10 pl-3 text-right'
                      : 'pl-10 pr-3 text-left',
                  ]"
                  :placeholder="locales[currentLanguage].firstName"
                />
              </div>
              <p
                v-if="errors.firstName"
                class="mt-1 text-sm text-red-600"
                :class="{ 'text-right': currentLanguage === 'fa' }"
              >
                {{ errors.firstName }}
              </p>
            </div>

            <!-- Last Name -->
            <div>
              <label
                for="lastName"
                class="block text-sm font-medium text-gray-700 mb-2"
                :class="{ 'text-right': currentLanguage === 'fa' }"
              >
                {{ locales[currentLanguage].lastName }}
              </label>
              <div class="relative">
                <div
                  class="absolute inset-y-0 flex items-center pointer-events-none"
                  :class="
                    currentLanguage === 'fa' ? 'right-0 pr-3' : 'left-0 pl-3'
                  "
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    class="text-gray-400"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  v-model="formData.lastName"
                  class="w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  :class="[
                    { 'border-red-300 focus:ring-red-500': errors.lastName },
                    currentLanguage === 'fa'
                      ? 'pr-10 pl-3 text-right'
                      : 'pl-10 pr-3 text-left',
                  ]"
                  :placeholder="locales[currentLanguage].lastName"
                />
              </div>
              <p
                v-if="errors.lastName"
                class="mt-1 text-sm text-red-600"
                :class="{ 'text-right': currentLanguage === 'fa' }"
              >
                {{ errors.lastName }}
              </p>
            </div>
          </div>

          <!-- username -->
          <div>
            <label
              for="username"
              class="block text-sm font-medium text-gray-700 mb-2"
              :class="{ 'text-right': currentLanguage === 'fa' }"
            >
              {{ locales[currentLanguage].username }}
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 flex items-center pointer-events-none"
                :class="
                  currentLanguage === 'fa' ? 'right-0 pr-3' : 'left-0 pl-3'
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-400"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                v-model="formData.username"
                class="w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="[
                  { 'border-red-300 focus:ring-red-500': errors.username },
                  currentLanguage === 'fa'
                    ? 'pr-10 pl-3 text-right'
                    : 'pl-10 pr-3 text-left',
                ]"
                :placeholder="locales[currentLanguage].username"
              />
            </div>
            <p
              v-if="errors.username"
              class="mt-1 text-sm text-red-600"
              :class="{ 'text-right': currentLanguage === 'fa' }"
            >
              {{ errors.username }}
            </p>
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-gray-700 mb-2"
              :class="{ 'text-right': currentLanguage === 'fa' }"
            >
              {{ locales[currentLanguage].email }}
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 flex items-center pointer-events-none"
                :class="
                  currentLanguage === 'fa' ? 'right-0 pr-3' : 'left-0 pl-3'
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-400"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                  />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="text"
                dir="ltr"
                v-model="formData.email"
                class="w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="[
                  { 'border-red-300 focus:ring-red-500': errors.email },
                  currentLanguage === 'fa'
                    ? 'pr-10 pl-3 text-right'
                    : 'pl-10 pr-3 text-left',
                ]"
                :placeholder="locales[currentLanguage].email"
              />
            </div>
            <p
              v-if="errors.email"
              class="mt-1 text-sm text-red-600"
              :class="{ 'text-right': currentLanguage === 'fa' }"
            >
              {{ errors.email }}
            </p>
          </div>

          <!-- Password -->
          <div>
            <label
              for="password"
              class="block text-sm font-medium text-gray-700 mb-2"
              :class="{ 'text-right': currentLanguage === 'fa' }"
            >
              {{ locales[currentLanguage].password }}
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 flex items-center pointer-events-none"
                :class="
                  currentLanguage === 'fa' ? 'right-0 pr-3' : 'left-0 pl-3'
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-400"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <circle cx="12" cy="16" r="1" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                class="w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="[
                  { 'border-red-300 focus:ring-red-500': errors.password },
                  currentLanguage === 'fa'
                    ? 'pr-10 pl-10 text-right'
                    : 'pl-10 pr-10 text-left',
                ]"
                :placeholder="locales[currentLanguage].password"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 flex items-center"
                :class="
                  currentLanguage === 'fa' ? 'left-0 pl-3' : 'right-0 pr-3'
                "
              >
                <svg
                  v-if="showPassword"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-400"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-400"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
            <p
              v-if="errors.password"
              class="mt-1 text-sm text-red-600"
              :class="{ 'text-right': currentLanguage === 'fa' }"
            >
              {{ errors.password }}
            </p>
          </div>

          <!-- Confirm Password -->
          <div>
            <label
              for="confirmPassword"
              class="block text-sm font-medium text-gray-700 mb-2"
              :class="{ 'text-right': currentLanguage === 'fa' }"
            >
              {{ locales[currentLanguage].confirmPassword }}
            </label>
            <div class="relative">
              <div
                class="absolute inset-y-0 flex items-center pointer-events-none"
                :class="
                  currentLanguage === 'fa' ? 'right-0 pr-3' : 'left-0 pl-3'
                "
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-400"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <circle cx="12" cy="16" r="1" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="formData.confirmPassword"
                class="w-full py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                :class="[
                  {
                    'border-red-300 focus:ring-red-500': errors.confirmPassword,
                  },
                  currentLanguage === 'fa'
                    ? 'pr-10 pl-10 text-right'
                    : 'pl-10 pr-10 text-left',
                ]"
                :placeholder="locales[currentLanguage].confirmPassword"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 flex items-center"
                :class="
                  currentLanguage === 'fa' ? 'left-0 pl-3' : 'right-0 pr-3'
                "
              >
                <svg
                  v-if="showConfirmPassword"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-400"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <svg
                  v-else
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  class="text-gray-400"
                >
                  <path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              </button>
            </div>
            <p
              v-if="errors.confirmPassword"
              class="mt-1 text-sm text-red-600"
              :class="{ 'text-right': currentLanguage === 'fa' }"
            >
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- Accept Terms -->
          <div
            class="flex items-center"
            :class="{ 'flex-row-reverse': currentLanguage === 'fa' }"
          >
            <input
              id="acceptTerms"
              name="acceptTerms"
              type="checkbox"
              v-model="formData.acceptTerms"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              :class="[
                { 'border-red-300': errors.acceptTerms },
                {
                  'ml-2': currentLanguage === 'fa',
                  'mr-2': currentLanguage === 'en',
                },
              ]"
            />
            <label
              for="acceptTerms"
              class="block text-sm text-gray-700"
              :class="{
                'mr-2': currentLanguage === 'fa',
                'ml-2': currentLanguage === 'en',
              }"
            >
              {{ locales[currentLanguage].acceptTerms }}
            </label>
          </div>
          <p
            v-if="errors.acceptTerms"
            class="mt-1 text-sm text-red-600"
            :class="{ 'text-right': currentLanguage === 'fa' }"
          >
            {{ errors.acceptTerms }}
          </p>

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              :disabled="isLoading"
              class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span
                v-if="isLoading"
                class="absolute inset-y-0 flex items-center"
                :class="
                  currentLanguage === 'fa' ? 'right-0 pr-3' : 'left-0 pl-3'
                "
              >
                <div
                  class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
                ></div>
              </span>
              {{ locales[currentLanguage].signUpButton }}
            </button>
          </div>

          <!-- Social Login -->
          <div>
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">{{
                  locales[currentLanguage].orContinue
                }}</span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span class="ml-2">Google</span>
              </button>

              <button
                type="button"
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
                <span class="ml-2">GitHub</span>
              </button>
            </div>
          </div>
        </form>

        <!-- Toggle to Login -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
          </div>

          <div class="mt-6 text-center">
            <span class="text-sm text-gray-600">
              {{ locales[currentLanguage].hasAccount }}
            </span>
            <router-link
              to="/auth/login"
              class="ml-1 font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {{ locales[currentLanguage].signInLink }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { locales } from "@/locales/authLocales/index";
import { currentLanguage } from "@/main";
import { sendRegisterData } from "@/api/authService";
import { useNotificationStore } from "@/store/notificationStore";

// Router
const router = useRouter();

const notificationStore = useNotificationStore();

// Reactive data
const showPassword = ref<boolean>(false);
const showConfirmPassword = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const formData = reactive({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  username: "",
  acceptTerms: false,
});

const errors = ref<Record<string, string>>({});

// Methods
const validateForm = (): boolean => {
  const newErrors: Record<string, string> = {};

  // First name validation
  if (!formData.firstName.trim()) {
    newErrors.firstName = locales[currentLanguage.value].firstNameRequired;
  }

  // Last name validation
  if (!formData.lastName.trim()) {
    newErrors.lastName = locales[currentLanguage.value].lastNameRequired;
  }

  // Username validation
  if (!formData.username.trim()) {
    newErrors.username = locales[currentLanguage.value].usernameRequired;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    newErrors.email = locales[currentLanguage.value].emailRequired;
  } else if (!emailRegex.test(formData.email)) {
    newErrors.email = locales[currentLanguage.value].emailInvalid;
  }

  // Password validation (minimum 8 characters)
  if (!formData.password) {
    newErrors.password = locales[currentLanguage.value].passwordRequired;
  } else if (formData.password.length < 8) {
    newErrors.password = locales[currentLanguage.value].passwordMinLength;
  }

  // Confirm password validation
  if (!formData.confirmPassword) {
    newErrors.confirmPassword =
      locales[currentLanguage.value].confirmPasswordRequired;
  } else if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = locales[currentLanguage.value].passwordMismatch;
  }

  // Accept terms validation
  if (!formData.acceptTerms) {
    newErrors.acceptTerms = locales[currentLanguage.value].acceptTermsRequired;
  }

  errors.value = newErrors;
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (): Promise<void> => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    // API call to register
    const response = await sendRegisterData({
      first_name: formData.firstName,
      last_name: formData.lastName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (response.status >= 200 && response.status < 300) {
      notificationStore.showSuccess(
        locales[currentLanguage.value].registerSuccess,
      );

      setTimeout(async () => {
        await router.push("/auth/login");
      }, 1000);

      // Reset form
      formData.firstName = "";
      formData.lastName = "";
      formData.username = "";
      formData.email = "";
      formData.password = "";
      formData.confirmPassword = "";
      formData.acceptTerms = false;
      errors.value = {};
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errors = error.response?.data;

      if (errors) {
        const allErrors = Object.values(errors).flat().join("\n");

        notificationStore.showError(allErrors);
      }
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* RTL Support */
.rtl {
  direction: rtl;
}

/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Focus styles for better accessibility */
input:focus,
button:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Loading spinner */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
