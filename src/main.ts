import { createApp, ref } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router";

export const currentLanguage = ref<"en" | "fa">("en");

const app = createApp(App);
const pinia = createPinia();

app.use(router);

app.use(pinia);
app.mount("#app");
