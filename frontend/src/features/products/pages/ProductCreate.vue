<template>
  <SellerLayout>
    <v-sheet
      rounded="xl"
      class="pa-8 d-flex justify-center flex-column mt-16"
      elevation="1"
    >
      <h2 class="font-weight-black mb-1">Create New Listing</h2>
      <div class="text-caption mb-6">
        Give your item a second life in just a few steps.
      </div>

      <!-- IMAGE UPLOAD -->
      <v-sheet
        class="d-flex flex-column align-center justify-center pa-6 mb-8"
        rounded="xl"
        style="border: 2px dashed #cfeee0"
      >
        <v-icon size="40" color="green">mdi-image</v-icon>

        <!-- Hidden file input -->
        <v-file-input
          ref="fileInput"
          v-model="files"
          multiple
          accept="image/*"
          style="display: none"
        />

        <div class="font-weight-bold mt-2">Add Photos</div>

        <v-btn size="small" class="mt-2" @click="openFilePicker">
          Upload images
        </v-btn>
      </v-sheet>

      <!-- BASICS -->
      <h3 class="font-weight-bold mb-4">The Basics</h3>

      <v-text-field v-model="form.product_name" label="Product Name" />

      <v-text-field v-model="form.brand_name" label="Brand" />

      <v-textarea v-model="form.description" label="Description" rows="4" />

      <!-- INVENTORY -->
      <h3 class="font-weight-bold mt-8 mb-4">Inventory & Pricing</h3>

      <v-row c>
        <v-text-field v-model.number="form.price" label="Price" prefix="₹" />
        <v-select
          class="mx-4"
          v-model="form.target_audience"
          :items="['male', 'female', 'kids', 'unisex']"
          label="Target audience"
        />
        <v-text-field
          v-model.number="form.available_quantity"
          label="Quantity"
        />
      </v-row>

      <div class="d-flex justify-space-between mt-8">
        <v-btn variant="text">Cancel</v-btn>
        <v-btn
          class="rounded-pill px-8"
          style="background: #13ec80; color: #062016"
          @click="submit"
          :loading="loading"
        >
          Publish Listing
        </v-btn>
      </div>
    </v-sheet>
  </SellerLayout>
</template>
<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const store = useStore();
const router = useRouter();

const loading = ref(false);
const files = ref([]);
const fileInput = ref(null);

const openFilePicker = () => {
  fileInput.value?.click();
};

const form = ref({
  product_name: "",
  description: "",
  brand_id: null,
  brand_name: "",
  categories: [],
  condition: "used",
  status: "available",
  price: 0,
  available_quantity: 1,
  target_audience: "unisex",
});

async function submit() {
  loading.value = true;
  try {
    const payload = {
      product_name: form.value.product_name,
      description: form.value.description,
      brand_id: form.value.brand_id ?? null,
      brand_name: form.value.brand_name?.trim() || null,
      categories: form.value.categories,
      condition: form.value.condition,
      status: form.value.status,
      price: form.value.price ?? null,
      available_quantity: form.value.available_quantity,
      target_audience: form.value.target_audience,
    };

    await store.dispatch("products/create", {
      productPayload: payload,
      files: files.value,
    });

    toast.success("Product created");
    router.push({ name: "product-list" });
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || "Create failed");
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>
