<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="d-flex justify-space-between align-center">
        <h2>My Products</h2>
        <v-btn color="primary" @click="$router.push({ name: 'product-create' })"
          >Add Product</v-btn
        >
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="loading" cols="12"><v-skeleton-loader type="card" /></v-col>
      <v-col v-for="p in list" :key="p.product_uuid" cols="12" sm="6" md="4">
        <product-card :product="p" />
        <v-btn small text @click="editProduct(p.product_uuid)">Edit</v-btn>
      </v-col>
      <v-col v-if="!list.length && !loading" cols="12">
        <v-alert variant="outlined"
          >You have not created any products yet.</v-alert
        >
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import ProductCard from "./ProductCard.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useStore();
const list = computed(() => store.getters["products/all"] || []);
const loading = computed(() => store.getters["products/loading"]);

onMounted(async () => {
  const me = store.getters["auth/user"];
  if (!me) return;
  try {
    await store.dispatch("products/fetchProducts", {
      seller_uuid: me.user_uuid,
      limit: 100,
    });
  } catch (e) {
    console.error(e);
  }
});

function editProduct(uuid) {
 
  router.push({ name: "product-show", params: { id: uuid } });
}
</script>
