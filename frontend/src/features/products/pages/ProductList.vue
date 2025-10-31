
<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2>Products</h2>
        <!-- <v-btn color="primary" @click="$router.push({ name: 'product-create' })">Add Product</v-btn> -->
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="loading" cols="12">
        <v-skeleton-loader type="card" />
      </v-col>
      <v-col
        v-for="p in products"
        :key="p.product_uuid"
        cols="12"
        sm="6"
        md="4"
      >
        <product-card :product="p" />
      </v-col>
      <v-col v-if="!products?.length && !loading" cols="12">
        <v-alert variant="outlined">No products found.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ProductCard from "./ProductCard.vue";
const store = useStore();
const route = useRoute();
const products = computed(() => store.getters["products/all"]);
const loading = computed(() => store.getters["products/loading"]);
function buildParamsFromQuery(q) {
  const params = {};
  if (q.limit) params.limit = Number(q.limit);
  if (q.offset) params.offset = Number(q.offset);
  if (q.brand_id) params.brand_id = Number(q.brand_id);
  if (q.category_id) params.category_id = Number(q.category_id);
  if (q.target_audience) params.target_audience = q.target_audience;
  if (q.q) params.q = q.q;
  return params;
}
async function fetchWithQuery() {
  const params = buildParamsFromQuery(route.query || {});
  if (!params.limit) params.limit = 50;
  try {
    await store.dispatch("products/fetchProducts", params);
  } catch (err) {
    console.error("Failed to fetch products", err);
  }
}
onMounted(fetchWithQuery);
watch(() => route.query, fetchWithQuery, { deep: true });
</script>





