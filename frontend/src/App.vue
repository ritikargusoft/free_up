<template>
  <v-app>
    <component :is="layoutComponent">
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </component>
  </v-app>
</template>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AuthLayout from "@/layouts/AuthLayout.vue";
import MainLayout from "@/layouts/MainLayout.vue";
const route = useRoute();
const layoutComponent = computed(() => (route.meta.layout === "auth" ? AuthLayout : MainLayout));
</script>