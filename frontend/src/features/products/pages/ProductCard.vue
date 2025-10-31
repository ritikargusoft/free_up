<template>
  <v-card elevation="2">
    <v-img :src="thumb" height="200" cover />
    <v-card-title>{{ product.product_name }}</v-card-title>
    <v-card-subtitle>Brand: {{ product.brand_name || "—" }}</v-card-subtitle>
    <v-card-text>
      <div class="mb-2">{{ product.description }}</div>
      <div class="d-flex justify-space-between">
        <div>Price: {{ product?.price ?? "—" }}</div>

        <div>Qty: {{ product.available_quantity }}</div>
        <div>{{ product.target_audience }}</div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="goToProduct">View</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
const props = defineProps({ product: Object });
const router = useRouter();

const thumb = computed(() => {
  return (
    props.product?.thumbnail_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      props.product?.product_name || "P"
    )}&background=FFD600&color=000000`
  );
});

function goToProduct() {
  if (
    router.resolve({
      name: "product-show",
      params: { id: props.product.product_uuid },
    }).matched.length
  ) {
    router.push({
      name: "product-show",
      params: { id: props.product.product_uuid },
    });
  } else {
    router.push(`/products/${props.product.product_uuid}`);
  }
}
</script>
