import LoginPage from "@/features/auth/pages/LoginPage.vue";
import RegisterPage from "@/features/auth/pages/RegisterPage.vue";

export default [
  {
    path: "/login",
    component: LoginPage,
    meta: { layout: "auth" },
  },
  {
    path: "/register",
    component: RegisterPage,
    meta: { layout: "auth" },
  },
];
