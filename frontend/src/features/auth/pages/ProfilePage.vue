<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card elevation="3">
          <v-row class="pa-4" no-gutters>
            <v-col cols="12" md="4" class="d-flex align-center justify-center">
              <v-avatar size="140" class="elevation-2">
                <v-img :src="avatarUrl" />
              </v-avatar>
            </v-col>
            <v-col cols="12" md="8">
              <v-card-title class="text-h5">{{
                user.name || user.email
              }}</v-card-title>
              <v-card-subtitle class="mb-2">{{ user.email }}</v-card-subtitle>
              <v-list dense two-line>
                <v-list-item>
                  <v-list-item-icon
                    ><v-icon>mdi-phone</v-icon></v-list-item-icon
                  >
                  <v-list-item-content>
                    <v-list-item-title>{{
                      user.phone || "Not provided"
                    }}</v-list-item-title>
                    <v-list-item-subtitle>Phone</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon
                    ><v-icon>mdi-map-marker</v-icon></v-list-item-icon
                  >
                  <v-list-item-content>
                    <v-list-item-title>{{
                      user.address || "Not provided"
                    }}</v-list-item-title>
                    <v-list-item-subtitle>Address</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div class="mt-4">
                <v-btn
                  class="bg-primary text-white"
                  @click="openEdit"
                  elevation="2"
                >
                  Edit Profile
                </v-btn>
                <v-btn text color="primary" @click="openChangePassword"
                  >Change Password</v-btn
                >
                <v-btn text color="primary" @click="doLogout">Logout</v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <EditProfileDialog v-model="editing" @updated="onUpdated" />
    <ChangePasswordDialog
      v-model="changingPassword"
      @changed="onPasswordChanged"
    />
  </v-container>
</template>
<script setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import EditProfileDialog from "../components/EditProfileDialog.vue";
import ChangePasswordDialog from "../components/ChangePasswordDialog.vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
const store = useStore();
const router = useRouter();
const editing = ref(false);
const changingPassword = ref(false);
const user = computed(() => store.getters["auth/user"] || {});
const avatarUrl = computed(() => {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user.value.name || user.value.email || "U"
  )}&background=FFD600&color=000000`;
});
function openEdit() {
  editing.value = true;
}
function openChangePassword() {
  changingPassword.value = true;
}
async function doLogout() {
  await store.dispatch("auth/logout");
  toast.success("Logged out");
  router.push({ name: "login" });
}
function onUpdated(updatedUser) {
  toast.success("Profile saved");
}
function onPasswordChanged() {
  changingPassword.value = false;

  // await store.dispatch('auth/logout');
  // router.push({ name: 'login' });
}
</script>
<style scoped>
.v-avatar img {
  object-fit: cover;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
