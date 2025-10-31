<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Create Product</v-card-title>
          <v-card-text>
            <v-form ref="formRef" @submit.prevent="submit">
              <v-text-field
                v-model="form.product_name"
                label="Product name"
                required
              />
              <v-textarea
                v-model="form.description"
                label="Description"
                rows="3"
              />
              <v-text-field
                v-model="form.brand_name"
                label="Brand"
                placeholder="e.g. Zara"
                clearable
              />
              <category-select v-model="form.categories" />
              <v-text-field
                v-model.number="form.price"
                label="Price"
                type="number"
                min="0"
              />
              <v-select
                v-model="form.target_audience"
                :items="['male', 'female', 'kids', 'unisex']"
                label="Target audience"
              />
              <v-text-field
                v-model.number="form.available_quantity"
                label="Quantity"
                type="number"
                min="1"
              />
              <v-file-input
                v-model="files"
                multiple
                show-size
                accept="image/*"
                label="Product images"
              />
              <v-row class="mt-4">
                <v-spacer />
                <v-btn :loading="loading" color="primary" type="submit">
                  Create
                </v-btn>
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
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import CategorySelect from "../components/CategorySelect.vue";
const store = useStore();
const router = useRouter();
const formRef = ref(null);
const loading = ref(false);
const files = ref([]);
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
      // brand_id left null for backend resolution by brand_name
      brand_id: form.value.brand_id ?? null,
      brand_name: form.value.brand_name?.trim() || null,
      categories: form.value.categories,
      condition: form.value.condition,
      status: form.value.status,
      price: form.value.price ?? null,
      available_quantity: form.value.available_quantity,
      target_audience: form.value.target_audience,
    };
    // dispatch create (store handles image uploads afterwards)
    const created = await store.dispatch("products/create", {
      productPayload: payload,
      files: files.value,
    });
    toast.success("Product created");
    router.push({ name: "product-list" });
  } catch (err) {
    toast.error(err.response?.data?.message || err.message || "Create failed");
    console.error("Create product error:", err);
  } finally {
    loading.value = false;
  }
}
</script>





