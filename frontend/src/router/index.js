import { createRouter, createWebHistory } from "vue-router";
import LoginPage from "@/features/auth/pages/LoginPage.vue";
import RegisterPage from "@/features/auth/pages/RegisterPage.vue";
import HomePage from "../features/home/pages/HomePage.vue";
import store from "../stores/index.js";
import ProfilePage from "../features/auth/pages/ProfilePage.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { requiresAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    meta: { layout: "auth" },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
    meta: { layout: "auth" },
  },
    {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
    meta: { requiresAuth: "true" },
  },
  { path: "/:pathMatch(.*)*", redirect: "/" },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});


// guard
router.beforeEach((to, from, next) => {
  const isAuth = store.getters["auth/isAuthenticated"];
  if (to.meta.requiresAuth && !isAuth) return next({ name: "login" });
  if ((to.name === "login" || to.name === "register") && isAuth)
    return next({ name: "home" });
  next();
});
export default router;
