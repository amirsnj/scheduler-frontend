import { createRouter, createWebHistory } from "vue-router";

const schedulerLayout = () => import("@/layouts/schedulerLayouts/schedulerLayout.vue")
const LoginView = () => import("@/views/authViews/LoginView.vue")
const RegiserView = () => import("@/views/authViews/RegisterView.vue")


const routes = [
  { 
    path: '/', 
    redirect: '/scheduler' 
  },
  {
    path: '/scheduler',
    name: 'Scheduler',
    component: schedulerLayout
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login', name: 'Login', component: LoginView
      },
      {
        path: 'register', name: "Register", component: RegiserView
      }
    ]
  }
]


export default createRouter({
    history: createWebHistory(),
    routes
})