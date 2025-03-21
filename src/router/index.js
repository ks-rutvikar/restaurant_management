import { createRouter, createWebHistory } from "vue-router";

import LoginForm from "@/components/auth/LoginForm.vue";
import SignupForm from "@/components/auth/SignupForm.vue";
import ForgotPwd from "@/components/auth/ForgotPwd.vue";
import UpdatePwd from "@/components/auth/UpdatePwd.vue";
import Menu from "@/components/dashboard/menu/Menu.vue";
import ShareMenu from "@/components/dashboard/menu/ShareMenu.vue";
import MenuCategoryPage from "@/components/dashboard/category/MenuCategoryPage.vue";
import CategoryItemPage from "@/components/dashboard/item/CategoryItemPage.vue";
import Home from "@/views/Home.vue";
import UserForm from "@/components/auth/UserForm.vue";
import Contact from "@/views/Contact.vue";
import About from "@/views/About.vue";
import MenuDisplay from "@/components/customerside/MenuDisplay.vue";

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
  {
    path: "/home",
    name: "home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    name: "profile",
    component: UserForm,
    meta: { requiresAuth: true },
  },
  {
    path: "/contact",
    name: "contact",
    component: Contact,
  },
  {
    path: "/about",
    name: "about",
    component: About,
  },
  {
    path: "/menu",
    name: "menu",
    component: Menu,
    meta: { requiresAuth: true },
  },
  {
    path: "/menu/sharemenu",
    name: "sharemenu",
    component: ShareMenu,
    meta: { requiresAuth: true },
  },
  {
    path: "/menu/:id/:name/",
    name: "menucategorypage",
    component: MenuCategoryPage,
    meta: { requiresAuth: true },
    props: true,
  },
  {
    path: '/menu/:id/:name/:categoryId/:categoryName',
    name: 'categoryitempage',
    component: CategoryItemPage,
    meta: { requiresAuth: true },
    props: true, 
  },
  {
    path: "/m/:shortId",
    name: "menudisplay",
    component: MenuDisplay,
    props: true,
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
