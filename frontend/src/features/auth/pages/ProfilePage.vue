<template>
  <v-container
    fluid
    class="pa-6 mt-16"
    style="background: #f6f8f7; min-height: 100vh"
  >
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-row>
          <!-- LEFT SIDEBAR -->
          <v-col cols="12" md="4">
            <v-sheet rounded="xl" class="pa-6">
              <div class="d-flex flex-column align-center mb-6">
                <v-avatar size="96" class="mb-3" elevation="2">
                  <v-img :src="avatarUrl" />
                </v-avatar>

                <div class="font-weight-bold text-h6">
                  {{ user.name || "User" }}
                </div>

                <div class="text-caption mb-4" style="color: #13ec80">
                  ✔ Verified Seller
                </div>

                <v-row class="text-center w-100">
                  <v-col>
                    <div class="font-weight-bold">42</div>
                    <div class="text-caption">Sold</div>
                  </v-col>
                  <v-col>
                    <div class="font-weight-bold">4.9</div>
                    <div class="text-caption">Rating</div>
                  </v-col>
                  <v-col>
                    <div class="font-weight-bold">128</div>
                    <div class="text-caption">Reviews</div>
                  </v-col>
                </v-row>
              </div>

              <v-list density="comfortable">
                <v-list-item active>
                  <template #prepend><v-icon>mdi-account</v-icon></template>
                  <v-list-item-title>Personal Information</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend
                    ><v-icon>mdi-package-variant</v-icon></template
                  >
                  <v-list-item-title>My Orders</v-list-item-title>
                </v-list-item>

                <v-list-item v-on:click="myListings">
                  <template #prepend><v-icon>mdi-tag</v-icon></template>
                  <v-list-item-title>My Listings</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend><v-icon>mdi-heart</v-icon></template>
                  <v-list-item-title>Wishlist</v-list-item-title>
                </v-list-item>

                <v-list-item @click="doLogout">
                  <template #prepend>
                    <v-icon color="error">mdi-logout</v-icon>
                  </template>
                  <v-list-item-title class="text-error">
                    Log Out
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <!-- RIGHT CONTENT -->
          <v-col cols="12" md="8">
            <v-sheet rounded="xl" class="pa-6">
              <div class="d-flex justify-space-between align-center mb-6">
                <div>
                  <h3 class="font-weight-black mb-1">Personal Information</h3>
                  <div class="text-caption">
                    Manage your personal details and account settings.
                  </div>
                </div>

                <v-btn
                  class="rounded-pill"
                  style="background: #13ec80; color: #062016"
                  @click="editing = true"
                >
                  Edit Profile
                </v-btn>
              </div>

              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    label="Full Name"
                    variant="solo"
                    readonly
                    :model-value="user.name"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Email Address"
                    variant="solo"
                    readonly
                    :model-value="user.email"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Phone Number"
                    variant="solo"
                    readonly
                    :model-value="user.phone || ''"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    label="Location"
                    variant="solo"
                    readonly
                    :model-value="user.location || ''"
                  />
                </v-col>

                <v-col cols="12">
                  <v-textarea
                    label="Shipping Address"
                    variant="solo"
                    readonly
                    rows="3"
                    :model-value="user.address || ''"
                  />
                </v-col>
              </v-row>

              <div
                class="d-flex justify-space-between align-center mt-6 pt-4"
                style="border-top: 1px solid #e7f3ed"
              >
                <div class="text-caption">Last updated on Oct 24, 2023</div>

                <div class="d-flex" style="gap: 12px">
                  <v-btn variant="outlined" @click="changingPassword = true">
                    Change Password
                  </v-btn>
                  <v-btn variant="outlined"> Activity Log </v-btn>
                </div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <EditProfileDialog v-model="editing" />
    <ChangePasswordDialog v-model="changingPassword" />
  </v-container>
</template>

<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import EditProfileDialog from "../components/EditProfileDialog.vue";
import ChangePasswordDialog from "../components/ChangePasswordDialog.vue";

const store = useStore();
const editing = ref(false);
const changingPassword = ref(false);

const user = computed(() => store.getters["auth/user"] || {});
const myListings = () => {
  window.location.href = "/products/mine";
};
const avatarUrl = computed(
  () =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.value.name || "U"
    )}&background=13ec80&color=062016`
);

async function doLogout() {
  await store.dispatch("auth/logout");
}
</script>
