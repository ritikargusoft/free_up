<template>
  <v-app-bar
    app
    fixed
    elevate-on-scroll
    flat
    color="primary"
    dark
    height="64"
    class="the-header"
  >
    <div class="header-inner">
      <div class="left">
        <v-btn icon class="logo-btn" @click="goHome" aria-label="home">
          <v-avatar size="50" class="">
          <v-img :src="logo" />
          </v-avatar>
        </v-btn>
      </div>
      <div class="center" v-if="showSearch">
        <v-text-field
          v-model="q"
          placeholder="Search products..."
          dense
          hide-details
          rounded
          clearable
          @keyup.enter="onSearch"
          @click:clear="onClear"
          prepend-inner-icon="mdi-magnify"
          class="search-input"
          variant="solo"
          bg-color="white"
        ></v-text-field>
      </div>
      <div class="right">
        <div v-if="!isAuth">
          <v-btn text @click="go('login')">Login</v-btn>
          <v-btn text @click="go('register')">Register</v-btn>
        </div>
        <div v-else>
          <v-btn text @click="go('product-list')">Shop</v-btn>
          <v-btn text @click="go('product-mine')">My Products</v-btn>
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-btn v-bind="props" text class="user-btn">
                <span class="user-name">{{ displayName }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="go('profile')">
                <v-list-item-title>Profile</v-list-item-title>
              </v-list-item>
              <v-list-item @click="go('product-mine')">
                <v-list-item-title>My Products</v-list-item-title>
              </v-list-item>
              <v-list-item @click="doLogout">
                <v-list-item-title>Logout</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import logo from "@/assets/images/logo.png";
const store = useStore();
const router = useRouter();
const route = useRoute();
const isAuth = computed(() => store.getters["auth/isAuthenticated"]);
const user = computed(() => store.getters["auth/user"] || {});
const displayName = computed(
  () => user.value?.name || user.value?.email || "User"
);
const q = ref("");
const showSearch = true; 
function go(name) {
  router.push({ name });
}
function goHome() {
  router.push({ name: "home" });
}
async function doLogout() {
  await store.dispatch("auth/logout");
  router.push({ name: "login" });
}
function onSearch() {
  router.push({ name: "product-list", query: { q: q.value } });
}
function onClear() {
  q.value = "";
  if (route.name === "product-list") {
    router.replace({ name: "product-list", query: {} });
  }
}
</script>


<style scoped>
.the-header {
  z-index: 1200;
  box-shadow: 0 2px 8px rgba(2, 6, 23, 0.08);
}
.header-inner {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
  padding: 0 12px;
}
.left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}
.center {
  flex: 1 1 auto;
  display: flex;
  justify-content: center;
}
.right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
}
.logo-btn {
  padding: 0;
}
.nav-btn {
  color: white;
  font-weight: 500;
}
.search-input {
  max-width: 560px;
  width: 100%;
}
@media (max-width: 900px) {
  .center {
    display: none;
  }
  .nav-btn {
    display: none;
  }
}
</style>
