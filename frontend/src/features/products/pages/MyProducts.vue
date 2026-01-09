<template>
  <v-container
    fluid
    class="pa-6 mt-16"
    style="background: #f6f8f7; min-height: 100vh"
  >
    <v-row justify="center">
      <v-col cols="12" lg="10">
        <v-row>
          <!-- LEFT SIDEBAR -->
          <v-col cols="12" md="4">
            <v-sheet rounded="xl" class="pa-6">
              <div class="d-flex flex-column align-center mb-6">
                <v-avatar size="96" class="mb-3" elevation="2">
                  <v-img :src="avatarUrl" />
                </v-avatar>

                <div class="font-weight-bold text-h6">
                  {{ user.name || "User" }}
                </div>

                <div class="text-caption mb-4" style="color: #13ec80">
                  ✔ Verified Seller
                </div>
              </div>

              <v-list density="comfortable">
                <v-list-item @click="$router.push('/profile')">
                  <template #prepend><v-icon>mdi-account</v-icon></template>
                  <v-list-item-title>Personal Information</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend
                    ><v-icon>mdi-package-variant</v-icon></template
                  >
                  <v-list-item-title>My Orders</v-list-item-title>
                </v-list-item>

                <v-list-item active>
                  <template #prepend><v-icon>mdi-tag</v-icon></template>
                  <v-list-item-title>My Listings</v-list-item-title>
                </v-list-item>

                <v-list-item>
                  <template #prepend><v-icon>mdi-heart</v-icon></template>
                  <v-list-item-title>Wishlist</v-list-item-title>
                </v-list-item>

                <v-list-item @click="doLogout">
                  <template #prepend>
                    <v-icon color="error">mdi-logout</v-icon>
                  </template>
                  <v-list-item-title class="text-error">
                    Log Out
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-sheet>
          </v-col>

          <!-- RIGHT CONTENT -->
          <v-col cols="12" md="8">
            <v-sheet rounded="xl" class="pa-6">
              <div class="d-flex justify-space-between align-center mb-6">
                <h3 class="font-weight-black">My Products</h3>

                <v-btn
                  class="rounded-pill"
                  style="background: #13ec80; color: #062016"
                  @click="$router.push({ name: 'product-create' })"
                >
                  Add Product
                </v-btn>
              </div>

              <!-- LOADING -->
              <v-row v-if="loading">
                <v-col cols="12" sm="6" md="6" v-for="i in 4" :key="i">
                  <v-skeleton-loader type="card" height="240" />
                </v-col>
              </v-row>

              <!-- PRODUCTS -->
              <v-row v-else>
                <v-col v-for="p in list" :key="p.product_uuid" cols="12" sm="6">
                  <ProductCard :product="p" />

                  <v-btn
                    size="small"
                    variant="text"
                    class="mt-1"
                    @click="editProduct(p.product_uuid)"
                  >
                    Edit
                  </v-btn>
                </v-col>

                <v-col v-if="!list.length" cols="12">
                  <v-alert variant="outlined">
                    You have not created any products yet.
                  </v-alert>
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import ProductCard from "./ProductCard.vue";

const store = useStore();
const router = useRouter();

const user = computed(() => store.getters["auth/user"] || {});
const list = computed(() => store.getters["products/all"] || []);
const loading = computed(() => store.getters["products/loading"]);

const avatarUrl = computed(
  () =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.value.name || "U"
    )}&background=13ec80&color=062016`
);

onMounted(async () => {
  if (!user.value?.user_uuid) return;
  await store.dispatch("products/fetchProducts", {
    seller_uuid: user.value.user_uuid,
    limit: 100,
  });
});

function editProduct(uuid) {
  router.push({ name: "product-show", params: { id: uuid } });
}

async function doLogout() {
  await store.dispatch("auth/logout");
}
</script>
