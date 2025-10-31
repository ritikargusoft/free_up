<template>
  <v-app>
    <TheHeader />
    <v-main class="pt-0">
      <v-container fluid class="pa-4">
        <slot />
      </v-container>
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script setup>
import TheHeader from "../components/layout/TheHeader.vue";
import TheFooter from "../components/layout/TheFooter.vue";
</script>
