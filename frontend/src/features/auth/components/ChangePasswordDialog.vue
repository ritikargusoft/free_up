<template>
  <v-dialog v-model="model" max-width="480">
    <v-sheet rounded="xl" class="pa-6">
      <div class="d-flex justify-space-between align-center mb-2">
        <h3 class="font-weight-bold">Change Password</h3>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <p class="text-caption mb-6">
        To secure your account, enter your current password and create a new
        one.
      </p>

      <v-form @submit.prevent="submit">
        <v-text-field
          v-model="form.oldPassword"
          label="Current Password"
          type="password"
          variant="solo"
          class="mb-4"
        />

        <v-text-field
          v-model="form.newPassword"
          label="New Password"
          type="password"
          variant="solo"
          class="mb-2"
        />

        <v-text-field
          v-model="form.confirmPassword"
          label="Confirm New Password"
          type="password"
          variant="solo"
          class="mb-6"
        />

        <div class="d-flex justify-end" style="gap: 12px">
          <v-btn variant="outlined" @click="close">Cancel</v-btn>
          <v-btn
            class="rounded-pill"
            style="background: #13ec80; color: #062016"
            type="submit"
            :loading="loading"
          >
            Update Password
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);

const store = useStore();
const model = ref(props.modelValue);
const loading = ref(false);

const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

watch(
  () => props.modelValue,
  (v) => {
    model.value = v;
    if (v) {
      form.value = { oldPassword: "", newPassword: "", confirmPassword: "" };
    }
  }
);

watch(model, (v) => emit("update:modelValue", v));

function close() {
  model.value = false;
}

async function submit() {
  if (form.value.newPassword !== form.value.confirmPassword) return;
  loading.value = true;
  try {
    await store.dispatch("auth/changePassword", {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword,
    });
    close();
  } finally {
    loading.value = false;
  }
}
</script>
