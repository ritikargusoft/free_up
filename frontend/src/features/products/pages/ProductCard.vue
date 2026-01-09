<template>
  <v-card rounded="xl" elevation="1" class="pa-2 product-card">
    <!-- Image -->
    <v-img :src="thumb" height="180" cover class="rounded-lg">
      <!-- View button overlay -->
      <div class="image-overlay d-flex align-end justify-end pa-2">
        <v-btn
          size="small"
          variant="flat"
          color="white"
          class="text-black"
          @click="goToProduct"
        >
          View
        </v-btn>
      </div>
    </v-img>

    <!-- Content -->
    <v-card-text>
      <v-chip size="x-small" class="mb-2">
        {{ product.target_audience || "Unisex" }}
      </v-chip>

      <div class="font-weight-bold mb-1 text-truncate">
        {{ product.product_name }}
      </div>

      <div class="d-flex justify-space-between align-center">
        <span class="font-weight-bold price">
          ₹{{ product.price ?? "—" }}
        </span>

        <v-chip
          size="x-small"
          color="green"
          v-if="product.available_quantity > 0"
        >
          ACTIVE
        </v-chip>
        <v-chip size="x-small" color="red" v-else> OUT </v-chip>
      </div>

      <div class="text-caption mt-1">
        {{ product.available_quantity }} in stock
      </div>
    </v-card-text>
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

<style scoped>
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.35), transparent);
}

.price {
  color: #13ec80;
}
</style>
