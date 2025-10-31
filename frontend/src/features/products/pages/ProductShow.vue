<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>{{ product?.product_name }}</v-card-title>
          <v-card-text>
            <div>{{ product?.description }}</div>
            <div>Brand: {{ product?.brand_name || "—" }}</div>
            <div>Price: {{ product?.price || "-"}}</div>
            <div>Qty: {{ product?.available_quantity }}</div>
            <div v-if="product?.categories?.length">
              Categories:
              <span
                v-for="c in product.categories"
                :key="c.category_id"
                class="mr-2"
                >{{ c.name }}</span
              >
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getProduct } from "../api/productService.js";

const route = useRoute();
const product = ref(null);
console.log(product)
onMounted(async () => {
  try {
    product.value = await getProduct(route.params.id);
    console.log(product)

  } catch (err) {
    console.error(err);
  }
});
</script>
