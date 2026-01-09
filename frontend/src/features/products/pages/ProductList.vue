<template>
  <!-- <SellerLayout> -->
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h2 class="font-weight-black">Products</h2>
    </div>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="12" sm="6" md="4" v-for="i in 6" :key="i">
        <v-skeleton-loader type="card" height="260" />
      </v-col>
    </v-row>

    <!-- Product Grid -->
    <v-row v-else>
      <v-col
        v-for="p in products"
        :key="p.product_uuid"
        cols="12"
        sm="6"
        md="4"
      >
        <ProductCard :product="p" />
      </v-col>

      <v-col v-if="!products?.length" cols="12">
        <v-alert variant="outlined">No products found.</v-alert>
      </v-col>
    </v-row>
  </v-container>
  <!-- </SellerLayout> -->
</template>

<script setup>
import { onMounted, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import ProductCard from "./ProductCard.vue";
// import SellerLayout from "./SellerLayout.vue";

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
  await store.dispatch("products/fetchProducts", params);
}

onMounted(fetchWithQuery);
watch(() => route.query, fetchWithQuery, { deep: true });
</script>
