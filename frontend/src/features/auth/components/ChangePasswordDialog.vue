
<template>
  <v-dialog v-model="model" max-width="520px">
    <v-card>
      <v-card-title>Change Password</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-text-field
            v-model="form.oldPassword"
            label="Current password"
            type="password"
            :rules="[v => !!v || 'Current password is required']"
            autocomplete="current-password"
            required
          />
          <v-text-field
            v-model="form.newPassword"
            label="New password"
            type="password"
            :rules="newPasswordRules"
            autocomplete="new-password"
            required
          />
          <v-text-field
            v-model="form.confirmPassword"
            label="Confirm new password"
            type="password"
            :rules="[v => v === form.newPassword || 'Passwords do not match']"
            autocomplete="new-password"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn
          class="bg-primary text-white"
          :loading="loading"
          @click="submit"
          :disabled="loading"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";
const props = defineProps({
  modelValue: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "changed"]); 
const store = useStore();
const model = ref(props.modelValue);
const loading = ref(false);
const valid = ref(true);
const formRef = ref(null);
const form = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const newPasswordRules = [
  v => !!v || "New password is required",
  v => (v && v.length >= 6) || "Password must be at least 6 characters",
];
watch(() => props.modelValue, (v) => {
  model.value = v;
  if (v) {

    form.value.oldPassword = "";
    form.value.newPassword = "";
    form.value.confirmPassword = "";
  }
});
watch(model, (v) => emit("update:modelValue", v));
function close() {
  model.value = false;
  emit("update:modelValue", false);
}
async function submit() {

  if (form.value.newPassword !== form.value.confirmPassword) {
    toast.error("New passwords do not match");
    return;
  }
  if (!form.value.oldPassword || !form.value.newPassword) {
    toast.error("Please fill all password fields");
    return;
  }
  loading.value = true;
  try {
    await store.dispatch("auth/changePassword", {
      oldPassword: form.value.oldPassword,
      newPassword: form.value.newPassword,
    });

    emit("changed");
    
    close();
  } catch (err) {

    const msg = err.response?.data?.message || err.message || "Failed to change password";
    toast.error(msg);
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
</style>





