import LoginView from "@/views/authViews/LoginView.vue";
import RegisterView from "@/views/authViews/RegisterView.vue";
import SchedulerLayout from "@/layouts/schedulerLayouts/schedulerLayout.vue";
import MainContent from "@/views/schedulerViews/MainContent.vue";
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";

// const schedulerLayout = () =>
//   import("@/layouts/schedulerLayouts/schedulerLayout.vue");
// const LoginView = () => import("@/views/authViews/LoginView.vue");
// const RegiserView = () => import("@/views/authViews/RegisterView.vue");

// const routes = [
//   {
//     path: "/",
//     redirect: "/scheduler",
//   },
//   {
//     path: "/scheduler",
//     name: "Scheduler",
//     component: schedulerLayout,
//   },
//   {
//     path: "/auth",
//     children: [
//       {
//         path: "login",
//         name: "Login",
//         component: LoginView,
//       },
//       {
//         path: "register",
//         name: "Register",
//         component: RegiserView,
//       },
//     ],
//   },
// ];

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/scheduler",
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        name: "Login",
        component: LoginView,
      },
      {
        path: "register",
        name: "Register",
        component: RegisterView,
      },
    ],
  },
  {
    path: "/scheduler",
    component: SchedulerLayout,
    children: [
      { path: "", redirect: { name: "Tasks", params: { filter: "all" } } },
      {
        path: "tasks/:filter?",
        name: "Tasks",
        component: MainContent,
        props: (route) => ({
          filter: route.params.filter as string | undefined,
          date: route.query.date as string | undefined,
          list: route.query.list as string | undefined,
        }),
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
