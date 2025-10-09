<template>
  <v-card>
    <v-card-title class="text-h6">Register</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="onSubmit" ref="formRef">
        <v-text-field v-model="name" label="Name" required />
        <v-text-field v-model="email" label="Email" required />
        <v-text-field v-model="password" label="Password" type="password" required />
        <v-alert type="error" v-if="error" class="mt-2">{{ error }}</v-alert>
        <v-card-actions class="mt-4">
          <v-spacer />
          <v-btn class="bg-primary "  :loading="loading" type="submit">Register</v-btn>
        </v-card-actions>
        <div class="mt-3">
          Already have an account?
          <v-btn class="mx-2" text small @click="$router.push('/login')">Login</v-btn>
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
    const name = ref("");
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
        await store.dispatch("auth/register", { name: name.value, email: email.value, password: password.value });
        router.replace({ name: "login" });
      } catch (err) {
        error.value = err.response?.data?.message || err.message || "Registration failed";
      } finally {
        loading.value = false;
      }
    }
    return { name, email, password, loading, error, onSubmit };
  },
};
</script>
<style scoped></style>