<template>
  <v-container>
    <v-row class="fill-height" align="center" justify="center">
      <v-col cols="12" md="10">
        <v-row align="stretch">
          <!-- FORM -->
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-sheet class="pa-10" max-width="420" width="100%" elevation="0">
              <h1 class="font-weight-black mb-2">Welcome back!</h1>
              <p class="mb-6" style="color: rgba(13, 27, 20, 0.6)">
                Continue your sustainable shopping journey.
              </p>

              <v-form @submit.prevent="onSubmit">
                <v-text-field
                  v-model="email"
                  label="Email address"
                  prepend-inner-icon="mdi-email-outline"
                  variant="solo"
                  rounded="xl"
                  hide-details
                  class="mb-4"
                  required
                />

                <v-text-field
                  v-model="password"
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  type="password"
                  variant="solo"
                  rounded="xl"
                  hide-details
                  class="mb-2"
                  required
                />

                <div class="text-right mb-4">
                  <v-btn variant="text" size="small"> Forgot password? </v-btn>
                </div>

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
                  Log In
                </v-btn>
              </v-form>

              <div class="mt-6 text-center">
                Don’t have an account?
                <v-btn variant="text" @click="$router.push('/register')">
                  Register
                </v-btn>
              </div>
            </v-sheet>
          </v-col>

          <!-- IMAGE -->
          <v-col cols="12" md="6" class="d-none d-md-flex">
            <div
              style="
                width: 100%;
                border-radius: 24px;
                background-size: cover;
                background-position: center;
              "
              :style="`background-image:url(https://images.unsplash.com/photo-1489987707025-afc232f7ea0f)`"
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
                <v-chip class="mb-4" color="white">
                  <v-icon start>mdi-leaf</v-icon>
                  Sustainable Choice
                </v-chip>

                <h2 class="font-weight-black mb-2">
                  Give pre-loved items a new story.
                </h2>
                <p>Join millions buying and selling unique vintage finds.</p>
              </div>
            </div>
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

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

async function onSubmit() {
  error.value = "";
  loading.value = true;
  try {
    await store.dispatch("auth/login", {
      email: email.value,
      password: password.value,
    });
    router.replace({ name: "home" });
  } catch (err) {
    error.value = err.response?.data?.message || err.message || "Login failed";
  } finally {
    loading.value = false;
  }
}
</script>
