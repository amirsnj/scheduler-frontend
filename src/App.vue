<template>
  <div id="app">
    <!-- Main Router View -->
    <router-view />

    <!-- Global Notification Component -->
    <NotificationComponent />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount } from "vue";
import NotificationComponent from "./components/notification/notificationComponent.vue";
import { currentLanguage } from "./main";

onBeforeMount(() => {
  let lang = localStorage.getItem("lang");
  if (!lang) {
    localStorage.setItem("lang", "en");
    lang = "en";
  }
  currentLanguage.value = lang as "en" | "fa";
});
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: var(--font-family-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  position: relative;
  min-height: 100vh;
}

/* RTL Support */
.rtl {
  direction: rtl;
}

.rtl input[type="email"] {
  direction: ltr;
  text-align: right;
}
</style>
