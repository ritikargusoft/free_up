<template>
  <v-dialog v-model="model" max-width="600px">
    <v-card>
      <v-card-title>Edit Profile</v-card-title>
      <v-card-text>
        <v-form ref="formRef" v-model="valid" lazy-validation>
          <v-text-field
            v-model="form.name"
            label="Name"
            :rules="[(v) => !!v || 'Name required']"
            required
          />
          <v-text-field v-model="form.phone" label="Phone" />
          <v-textarea v-model="form.address" label="Address" rows="3" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn class="bg-primary text-white" :loading="loading" @click="save"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { ref, watch } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";

const props = defineProps({
  modelValue: { type: Boolean, default: false },
});
const emit = defineEmits(["update:modelValue", "updated"]);

const model = ref(props.modelValue);
const loading = ref(false);
const valid = ref(true);
const formRef = ref(null);
const store = useStore();
const userFromStore = store.getters["auth/user"] || {};
const form = ref({
  name: userFromStore.name || "",
  phone: userFromStore.phone || "",
  address: userFromStore.address || "",
});

watch(
  () => props.modelValue,
  (value) => {
    model.value = value;
    if (value) {

      const u = store.getters["auth/user"] || {};
      form.value.name = u.name || "";
      form.value.phone = u.phone || "";
      form.value.address = u.address || "";
    }
  }
);

watch(model, (v) => {
  emit("update:modelValue", v);
});
function close() {
  model.value = false;
  emit("update:modelValue", false);
}
async function save() {


  loading.value = true;
  try {
    const payload = {
      name: form.value.name,
      phone: form.value.phone,
      address: form.value.address,
    };
    const updated = await store.dispatch("auth/updateProfile", payload);
   
    close();
  } catch (err) {
    console.error("Update profile failed", err);
    toast.error(
      err.response?.data?.message || err.message || "Failed to update profile"
    );
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
</style>
