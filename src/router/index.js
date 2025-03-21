import { createRouter, createWebHistory } from "vue-router";

import LoginForm from "@/components/auth/LoginForm.vue";
import SignupForm from "@/components/auth/SignupForm.vue";
import ForgotPwd from "@/components/auth/ForgotPwd.vue";
import UpdatePwd from "@/components/auth/UpdatePwd.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginForm,
    meta: { requiresAuth: false },
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupForm,
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    name: "login",
    component: LoginForm,
    meta: { requiresAuth: false },
  },
  {
    path: "/resetform",
    name: "resetform",
    component: ForgotPwd,
    meta: { requiresAuth: false },
  },
  {
    path: "/updateform",
    name: "updateform",
    component: UpdatePwd,
    meta: { requiresAuth: false },
  },

  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("auth");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/login");
  } else {
    next();
  }
});

export default router;
