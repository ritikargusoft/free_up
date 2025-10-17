<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2>Products</h2>
        <v-btn color="primary" @click="$router.push({ name: 'product-create' })"
          >Add Product</v-btn
        >
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
import { onMounted, computed } from "vue";
import { useStore } from "vuex";
import ProductCard from "./ProductCard.vue";

const store = useStore();

const products = computed(() => store.getters["products/all"]);
const loading = computed(() => store.getters["products/loading"]);

onMounted(async () => {
  try {
    await store.dispatch("products/fetchProducts", { limit: 50 });
  } catch (err) {
  }
});
</script>
