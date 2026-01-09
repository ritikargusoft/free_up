<template>
  <v-container
    fluid
    class="pa-0 mt-12"
    style="
      background: #f6f8f7;
      color: #0d1b14;
      min-height: 100vh;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, 'Segoe UI',
        Roboto, Arial;
    "
  >
    <v-row justify="center">
      <v-col cols="12" md="10" class="py-10 px-4">
        <v-row align="center" class="flex-nowrap" style="gap: 40px">
          <v-col cols="12" md="7" class="pa-0">
            <v-chip
              small
              class="mb-3 font-weight-bold"
              style="background: rgba(19, 236, 128, 0.12)"
            >
              <v-icon start size="16">mdi-check-circle</v-icon>
              Verified Sustainable
            </v-chip>

            <h1
              class="font-weight-black mb-4"
              style="
                font-size: 3.2rem;
                line-height: 0.98;
                letter-spacing: -0.02em;
              "
            >
              Give Pre-Loved Items a
              <span
                style="
                  background: linear-gradient(90deg, #13ec80, #009e5f 70%);
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                "
              >
                New Story.
              </span>
            </h1>

            <p
              class="mb-5"
              style="max-width: 520px; color: rgba(13, 27, 20, 0.6)"
            >
              Buy and sell the best brands at a fraction of the price. Join the
              circular fashion revolution today.
            </p>

            <div class="d-flex mb-5" style="gap: 12px">
              <v-btn
                size="large"
                color="#13ec80"
                class="text-black rounded-pill px-8"
                elevation="3"
                @click="$router.push({ name: 'product-list' })"
              >
                Shop Now
              </v-btn>

              <v-btn
                size="large"
                variant="outlined"
                class="rounded-pill px-8"
                @click="$router.push({ name: 'product-create' })"
              >
                Sell Item
              </v-btn>
            </div>

            <div class="d-flex align-center" style="gap: 14px">
              <div class="d-flex align-center">
                <v-avatar
                  v-for="(u, i) in sampleAvatars"
                  :key="i"
                  size="40"
                  class="elevation-2"
                  :style="i > 0 ? 'margin-left:-10px' : ''"
                >
                  <v-img :src="u" />
                </v-avatar>
                <div
                  class="ml-2 px-3 py-1 rounded-pill font-weight-bold"
                  style="background: #13ec80"
                >
                  +2k
                </div>
              </div>
              <span style="color: rgba(13, 27, 20, 0.6)">
                Happy sellers this week
              </span>
            </div>
          </v-col>

          <!-- RIGHT IMAGE -->
          <v-col cols="12" md="5" class="pa-0 d-flex justify-center">
            <div
              style="
                width: 100%;
                max-width: 520px;
                aspect-ratio: 4/3;
                background-size: cover;
                background-position: center;
                border-radius: 28px;
                position: relative;
                overflow: hidden;
                box-shadow: 0 30px 50px rgba(10, 20, 15, 0.06);
              "
              :style="`background-image:url(${banner01})`"
            >
              <div
                style="
                  position: absolute;
                  inset: -10%;
                  background: radial-gradient(
                    circle at 30% 30%,
                    rgba(19, 236, 128, 0.12),
                    rgba(90, 180, 220, 0.06)
                  );
                  filter: blur(56px);
                "
              />

              <v-sheet
                elevation="3"
                rounded
                class="d-flex align-center pa-3"
                style="
                  position: absolute;
                  bottom: 18px;
                  right: 18px;
                  background: rgba(255, 255, 255, 0.92);
                "
              >
                <v-icon size="16" color="#13ec80">mdi-leaf</v-icon>
                <div class="ml-2">
                  <div class="text-caption font-weight-bold">Kurti</div>
                  <div class="text-caption">Saved 1kg CO₂</div>
                </div>
              </v-sheet>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- AUDIENCE -->
    <v-row justify="center">
      <v-col cols="12" md="10" class="px-4">
        <h3 class="font-weight-black mb-6">Who are you shopping for?</h3>

        <v-row>
          <v-col
            v-for="a in audiences"
            :key="a.key"
            cols="12"
            sm="6"
            md="3"
            class="d-flex justify-center"
          >
            <v-sheet
              elevation="0"
              rounded="lg"
              class="d-flex flex-column align-center pa-4 transition-fast-in-fast-out"
              :class="{ 'elevation-6': selectedAudience === a.key }"
              :style="
                selectedAudience === a.key ? 'transform:translateY(-6px)' : ''
              "
              @click="onAudience(a.key)"
              style="cursor: pointer"
            >
              <v-avatar size="160" elevation="3" class="mb-3">
                <v-img :src="a.img" height="100%" width="100%" cover />
              </v-avatar>

              <div class="font-weight-bold">
                {{ a.label }}
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- BRANDS -->
    <v-row justify="center">
      <v-col cols="12" md="10" class="px-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <h3 class="font-weight-black">Trending Brands</h3>
          <v-btn text size="small" color="#13ec80" @click="viewAllBrands">
            View all
          </v-btn>
        </div>

        <div class="d-flex flex-wrap" style="gap: 12px">
          <v-chip
            v-for="b in brands"
            :key="b.id"
            outlined
            class="rounded-pill font-weight-bold"
            @click="onBrand(b)"
          >
            {{ b.name || b.brand_name }}
          </v-chip>
        </div>
      </v-col>
    </v-row>

    <!-- CATEGORIES -->
    <v-row justify="center" class="pb-12">
      <v-col cols="12" md="10" class="px-4">
        <div class="d-flex justify-space-between align-center mb-3">
          <h3 class="font-weight-black">Browse by Category</h3>
          <v-btn text size="small" color="#13ec80" @click="viewAllCategories">
            View all
          </v-btn>
        </div>

        <div class="d-flex flex-wrap" style="gap: 12px">
          <v-btn
            v-for="c in categories"
            :key="c.id"
            size="small"
            rounded
            style="background: rgba(19, 236, 128, 0.08)"
            @click="onCategory(c)"
          >
            {{ c.name }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/plugins/axios.js";
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

const sampleAvatars = [
  "https://i.pravatar.cc/100?img=1",
  "https://i.pravatar.cc/100?img=10",
  "https://i.pravatar.cc/100?img=5",
];

onMounted(async () => {
  const [b, c] = await Promise.all([
    api
      .get("/brands")
      .then((r) => r.data)
      .catch(() => []),
    api
      .get("/category")
      .then((r) => r.data)
      .catch(() => []),
  ]);
  brands.value = b;
  categories.value = c;
});

function onAudience(key) {
  selectedAudience.value = selectedAudience.value === key ? null : key;
  router.push({
    name: "product-list",
    query: selectedAudience.value ? { target_audience: key } : {},
  });
}
function onBrand(b) {
  router.push({ name: "product-list", query: { brand_id: b.id } });
}
function onCategory(c) {
  router.push({ name: "product-list", query: { category_id: c.id } });
}
function viewAllBrands() {
  router.push({ name: "product-list" });
}
function viewAllCategories() {
  router.push({ name: "product-list" });
}
</script>
