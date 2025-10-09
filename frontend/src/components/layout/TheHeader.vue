<template>
  <v-app-bar color="primary" dark elevated>
    <v-app-bar-nav-icon @click="$emit('toggle-drawer')" />
    <v-toolbar-title>My App</v-toolbar-title>
    <v-spacer />
    <div>
      <v-btn text v-if="!isAuthenticated" @click="$router.push('/login')">Login</v-btn>
      <v-btn text v-if="!isAuthenticated" @click="$router.push('/register')">Register</v-btn>

      <v-menu v-if="isAuthenticated" offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" text>
            {{ userName }}
            <v-icon right>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
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

const store = useStore();
const isAuthenticated = computed(() => store.getters["auth/isAuthenticated"]);
const userName = computed(() => store.getters["auth/user"]?.name || store.getters["auth/user"]?.email || "User");

function logout() {
  store.dispatch("auth/logout");
  // redirect to login
  window.location.href = "/login";
}
</script>

<style scoped>
/* small header tweaks if needed */
</style>
