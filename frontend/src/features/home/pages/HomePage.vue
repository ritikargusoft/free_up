<template>
  <v-container fluid class="pa-4">
    <v-row class="d-flex justify-center mb-4" justify="center">
      <v-col class="" cols="12" md="10">
        <div class="d-flex justify-space-between flex-wrap">
          <v-chip
            v-for="a in audiences"
            variant="text"
            :key="a.key"
            class="ma-1 pa-2 h-25 rounded-xl primary-light-bg"
            @click="onAudience(a.key)"
          >
            <div class="d-flex ma-1 align-center">
              <v-avatar size="100" class="mr-3">
                <v-img :src="a.img" class="object-center"></v-img>
              </v-avatar>
              <div class="d-flex flex-column">
                <span class="text-subtitle-1 font-weight-thin">{{
                  a.label
                }}</span>
              </div>
            </div>
          </v-chip>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <v-sheet class="pa-8 elevation-2" rounded>
          <div class="d-flex align-center justify-space-between">
            <div>
              <h2 class="mb-2">Discover pre-loved finds</h2>
              <div class="mb-4">
                Filtered, curated, and ready to ship — find great second-hand
                items from sellers near you.
              </div>
              <v-btn
                color="primary"
                class="mr-2"
                @click="$router.push({ name: 'product-list' })"
                >Shop All</v-btn
              >
              <v-btn outlined @click="$router.push({ name: 'product-create' })"
                >Sell an item</v-btn
              >
            </div>
            <v-img :src="banner01" height="450px" loading="lazy"> </v-img>
          </div>
        </v-sheet>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="10">
        <div class="d-flex align-center justify-space-between mb-2">
          <h3 class="ma-0">Shop by brands</h3>
          <v-btn text small @click="viewAllBrands">View all</v-btn>
        </div>
        <div class="d-flex flex-row flex-wrap py-2">
          <v-chip
            v-for="b in brands"
            :key="b.brand_id || b.brand_uuid || b.id"
            class="ma-1"
            @click="onBrand(b)"
            role="button"
          >
            {{ b.name || b.brand_name }}
          </v-chip>
          <v-chip class="ma-1" outlined @click="viewAllBrands">
            All brands
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <v-row class="mt-6">
      <v-col cols="12" md="10">
        <div class="d-flex align-center justify-space-between mb-2">
          <h3 class="ma-0">Shop by categories</h3>
          <v-btn text small @click="viewAllCategories">View all</v-btn>
        </div>
        <div class="d-flex flex-row flex-wrap py-2">
          <v-chip
            v-for="c in categories"
            :key="c.category_id || c.category_uuid || c.id"
            class="ma-1"
            @click="onCategory(c)"
            role="button"
          >
            {{ c.name }}
          </v-chip>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/plugins/axios.js";
import { useRouter } from "vue-router";
import banner01 from "../../../assets/images/banner01.png";
import men from "../../../assets/images/men.webp";
import women from "../../../assets/images/women.webp";
import kids from "../../../assets/images/kids.jpg";
import unisex from "../../../assets/images/unisex.jpeg";

const router = useRouter();
const selectedAudience = ref(null);
const brands = ref([]);
const categories = ref([]);
const audiences = [
  { key: "male", label: "Men", img: men },
  { key: "female", label: "Women", img: women },
  { key: "kids", label: "Kids", img: kids },
  { key: "unisex", label: "Unisex", img: unisex },
];

async function loadLists() {
  try {
    const [bRes, cRes] = await Promise.all([
      api
        .get("/brands")
        .then((r) => r.data)
        .catch(() => ({ rows: [], data: [] })),
      api
        .get("/category")
        .then((r) => r.data)
        .catch(() => ({ rows: [], data: [] })),
    ]);
    brands.value = Array.isArray(bRes) ? bRes : bRes.rows || bRes.data || [];
    categories.value = Array.isArray(cRes)
      ? cRes
      : cRes.rows || cRes.data || [];
  } catch (err) {
    console.error("Failed to load brands/categories", err);
  }
}

onMounted(loadLists);

function onAudience(key) {
  selectedAudience.value = selectedAudience.value === key ? null : key;
  const q = selectedAudience.value
    ? { target_audience: selectedAudience.value }
    : {};
  router.push({ name: "product-list", query: q });
}
function onBrand(b) {
  const id = b.brand_id ?? b.brand_id ?? b.brand_id ?? b.id;
  if (!id) return;
  router.push({ name: "product-list", query: { brand_id: id } });
}
function onCategory(c) {
  const id = c.category_id ?? c.category_id ?? c.id;
  if (!id) return;
  router.push({ name: "product-list", query: { category_id: id } });
}
function viewAllBrands() {
  router.push({ name: "product-list" });
}
function viewAllCategories() {
  router.push({ name: "product-list" });
}
</script>
