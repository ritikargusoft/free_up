<template>
  <v-dialog v-model="model" max-width="480">
    <v-sheet rounded="xl" class="pa-6">
      <div class="d-flex justify-space-between align-center mb-4">
        <h3 class="font-weight-bold">Edit Profile</h3>
        <v-btn icon variant="text" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <div class="d-flex flex-column align-center mb-6">
        <v-avatar size="88" elevation="2">
          <v-img :src="avatarUrl" />
        </v-avatar>
        <v-btn variant="text" size="small" class="mt-2"> Change Photo </v-btn>
      </div>

      <v-form @submit.prevent="save">
        <v-text-field
          v-model="form.name"
          label="Full Name"
          variant="solo"
          class="mb-4"
        />

        <v-text-field
          v-model="form.phone"
          label="Phone Number"
          variant="solo"
          class="mb-4"
        />

        <v-textarea
          v-model="form.address"
          label="Shipping Address"
          variant="solo"
          rows="3"
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
            Save Changes
          </v-btn>
        </div>
      </v-form>
    </v-sheet>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";

const props = defineProps({ modelValue: Boolean });
const emit = defineEmits(["update:modelValue"]);

const store = useStore();
const model = ref(props.modelValue);
const loading = ref(false);

const user = computed(() => store.getters["auth/user"] || {});
const avatarUrl = computed(
  () =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.value.name || "U"
    )}`
);

const form = ref({ name: "", phone: "", address: "" });

watch(
  () => props.modelValue,
  (v) => {
    model.value = v;
    if (v) {
      form.value = {
        name: user.value.name || "",
        phone: user.value.phone || "",
        address: user.value.address || "",
      };
    }
  }
);

watch(model, (v) => emit("update:modelValue", v));

function close() {
  model.value = false;
}

async function save() {
  loading.value = true;
  try {
    await store.dispatch("auth/updateProfile", form.value);
    close();
  } finally {
    loading.value = false;
  }
}
</script>
