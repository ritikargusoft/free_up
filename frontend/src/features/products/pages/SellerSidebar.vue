<template>
  <v-list density="comfortable">
    <v-list-item
      :active="active === 'profile'"
      @click="$router.push('/profile')"
    >
      <template #prepend><v-icon>mdi-account</v-icon></template>
      <v-list-item-title>Personal Information</v-list-item-title>
    </v-list-item>

    <v-list-item
      :active="active === 'products'"
      @click="$router.push('/products/mine')"
    >
      <template #prepend><v-icon>mdi-tag</v-icon></template>
      <v-list-item-title>My Listings</v-list-item-title>
    </v-list-item>

    <v-list-item>
      <template #prepend><v-icon>mdi-package-variant</v-icon></template>
      <v-list-item-title>My Orders</v-list-item-title>
    </v-list-item>

    <v-list-item @click="$emit('logout')">
      <template #prepend>
        <v-icon color="error">mdi-logout</v-icon>
      </template>
      <v-list-item-title class="text-error"> Log Out </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup>
defineProps({ active: String });
</script>
