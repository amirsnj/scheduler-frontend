<template>
  <div id="app">
    <!-- Main Router View -->
    <router-view />

    <!-- Global Notification Component -->
    <NotificationComponent />
  </div>
</template>

<script setup lang="ts">
import NotificationComponent from "./components/notification/notificationComponent.vue";
</script>

<style>
/* Global styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu",
    "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
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
