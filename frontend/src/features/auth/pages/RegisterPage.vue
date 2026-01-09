<template>
  <v-container class="">
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="10">
        <v-row align="stretch">
          <!-- IMAGE -->
          <v-col cols="12" md="6" class="d-none d-md-flex">
            <div
              style="
                width: 100%;
                border-radius: 24px;
                background-size: cover;
                background-position: center;
              "
              :style="`background-image:url(https://images.unsplash.com/photo-1512436991641-6745cdb1723f)`"
            >
              <div
                class="d-flex flex-column justify-end pa-10"
                style="
                  height: 100%;
                  border-radius: 24px;
                  background: linear-gradient(
                    to top,
                    rgba(0, 0, 0, 0.6),
                    rgba(0, 0, 0, 0.2)
                  );
                  color: white;
                "
              >
                <h2 class="font-weight-black mb-2">
                  Give items a second life.
                </h2>
                <p>
                  Join the circular economy. Buy, sell, and discover pre-loved
                  gems.
                </p>
              </div>
            </div>
          </v-col>

          <!-- FORM -->
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-sheet class="pa-10" max-width="420" width="100%" elevation="0">
              <h1 class="font-weight-black mb-2">Create your account</h1>
              <p class="mb-6" style="color: rgba(13, 27, 20, 0.6)">
                Start your journey to sustainable shopping.
              </p>

              <v-form @submit.prevent="onSubmit">
                <v-text-field
                  v-model="name"
                  label="Full name"
                  variant="solo"
                  rounded="xl"
                  hide-details
                  class="mb-4"
                  required
                />

                <v-text-field
                  v-model="email"
                  label="Email address"
                  variant="solo"
                  rounded="xl"
                  hide-details
                  class="mb-4"
                  required
                />

                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  variant="solo"
                  rounded="xl"
                  hide-details
                  class="mb-4"
                  required
                />

                <v-alert
                  v-if="error"
                  type="error"
                  density="compact"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>

                <v-btn
                  block
                  size="large"
                  class="rounded-pill font-weight-bold"
                  style="background: #13ec80; color: #062016"
                  :loading="loading"
                  type="submit"
                >
                  Create Account
                </v-btn>
              </v-form>

              <div class="mt-6 text-center">
                Already have an account?
                <v-btn variant="text" @click="$router.push('/login')">
                  Log in
                </v-btn>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const name = ref("");
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await store.dispatch("auth/register", {
      name: name.value,
      email: email.value,
      password: password.value,
    });
    router.replace({ name: "login" });
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Registration failed";
  } finally {
    loading.value = false;
  }
}
</script>
