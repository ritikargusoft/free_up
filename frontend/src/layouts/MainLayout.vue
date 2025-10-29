<template>
  <v-app>
    <TheHeader />
    <v-main>
      <v-container fluid class="pa-4">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import TheHeader from "../components/layout/TheHeader.vue";
</script>

