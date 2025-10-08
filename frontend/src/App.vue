<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>

<script>
import AppLayout from "./app/components/AppLayout.vue";
export default {
  components: { AppLayout },
};
</script>
