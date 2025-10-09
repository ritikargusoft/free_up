<template>
  <v-card>
    <v-card-title class="text-h6">Login</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="onSubmit" ref="formRef">
        <v-text-field v-model="email" label="Email" required />
        <v-text-field v-model="password" label="Password" type="password" required />
        <v-alert type="error" v-if="error" class="mt-2">{{ error }}</v-alert>
        <v-card-actions class="mt-4">
          <v-spacer />
          <v-btn color=" " class="text-white bg-primary" :loading="loading" type="submit">Login</v-btn>
        </v-card-actions>
        <div class="mt-3">
          Don't have an account?
          <v-btn class="mx-2 " text small @click="$router.push('/register')">Register</v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const loading = ref(false);
    const error = ref("");
    const store = useStore();
    const router = useRouter();
    async function onSubmit() {
      error.value = "";
      loading.value = true;
      try {
        await store.dispatch("auth/login", { email: email.value, password: password.value });
        // ensure redirection to home
        router.replace({ name: "home" });
      } catch (err) {
        error.value = err.response?.data?.message || err.message || "Login failed";
      } finally {
        loading.value = false;
      }
    }
    return { email, password, loading, error, onSubmit };
  },
};
</script>
<style scoped></style>