<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Create Product</v-card-title>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="submit">
              <v-text-field v-model="form.product_name" label="Product name" required />
              <v-textarea v-model="form.description" label="Description" rows="3" />
              <brand-autocomplete v-model="form.brand_id" />
              <category-select v-model="form.categories" />
              <v-select
                v-model="form.target_audience"
                :items="['male','female','kids','unisex']"
                label="Target audience"
              />
              <v-text-field v-model.number="form.available_quantity" label="Quantity" type="number" min="1" />
              <v-file-input
                v-model="files"
                multiple
                show-size
                accept="image/*"
                label="Product images"
              />
              <v-row class="mt-4">
                <v-spacer />
                <v-btn :loading="loading" color="primary" type="submit">Create</v-btn>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

import BrandAutocomplete from "../components/BrandAutoComplete.vue";
import CategorySelect from "../components/CategorySelect.vue";

const form = ref({
  product_name: "",
  description: "",
  brand_id: null,
  brand_name: null, 
  categories: [],
  condition: "used",
  status: "available",
  available_quantity: 1,
  target_audience: "unisex",
});
const files = ref([]);
const loading = ref(false);
const formRef = ref(null);
const store = useStore();

async function submit() {
  loading.value = true;
  try {
    const payload = {
      product_name: form.value.product_name,
      description: form.value.description,
      brand_id: form.value.brand_id,
      brand_name: form.value.brand_name,
      categories: form.value.categories,
      condition: form.value.condition,
      status: form.value.status,
      available_quantity: form.value.available_quantity,
      target_audience: form.value.target_audience,
    };

    const created = await store.dispatch("products/create", {
      productPayload: payload,
      files: files.value,
    });

    toast.success("Product created");
    // redirect to product list or product page
    router.push({ name: 'product-list' })
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || "Create failed");
  } finally {
    loading.value = false;
  }
}
</script>