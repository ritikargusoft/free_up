<template>
  <v-app-bar color="primary" dark>
    <v-toolbar-title class="mr-6">FreeUp POC</v-toolbar-title>

    <v-btn text @click="$router.push({ name: 'product-list' })">Products</v-btn>

    <v-spacer />

    <div v-if="!isAuth">
      <v-btn text @click="$router.push('/login')">Login</v-btn>
      <v-btn text @click="$router.push('/register')">Register</v-btn>
    </div>
    <div v-else>
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" text>
            {{ displayName }}
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="goProfile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-list-item @click="goProducts">
            <v-list-item-title>My Products</v-list-item-title>
          </v-list-item>
          <v-list-item @click="doLogout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const isAuth = computed(() => store.getters["auth/isAuthenticated"]);
const user = computed(() => store.getters["auth/user"] || {});
const displayName = computed(() => user.value.name || user.value.email || "User");

function doLogout() {
  store.dispatch("auth/logout");
  router.push("/login");
}
function goProfile() {
  router.push({ name: "profile" });
}
function goProducts() {
  router.push({ name: "product-list" });
}
</script>
<style scoped>
.v-app-bar { position: sticky; top: 0; z-index: 10; }
</style>