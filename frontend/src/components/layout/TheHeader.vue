<template>
  <v-app-bar app flat height="72" class="renew-header">
    <div class="header-container mx-10">
      <!-- LEFT : LOGO + SEARCH -->
      <div class="header-left mx-10">
        <v-btn icon class="logo-btn" @click="goHome" aria-label="home">
          <v-icon size="28" color="primary">mdi-leaf</v-icon>
          <span class="logo-text">FreeUp</span>
        </v-btn>

        <!-- SEARCH (desktop only) -->
        <v-text-field
          v-if="showSearch"
          v-model="q"
          placeholder="Search brands, items..."
          hide-details
          density="compact"
          variant="solo"
          rounded="xl"
          clearable
          prepend-inner-icon="mdi-magnify"
          class="search-input mx-10"
          @keyup.enter="onSearch"
          @click:clear="onClear"
        />
      </div>

      <!-- RIGHT : NAV + ACTIONS -->
      <div class="header-right">
        <!-- NAV LINKS (desktop only) -->
        <div class="nav-links">
          <v-btn
            v-for="l in ['Men', 'Women', 'Kids']"
            :key="l"
            variant="text"
            class="nav-link"
            @click="go('product-list')"
          >
            {{ l }}
          </v-btn>
        </div>

        <!-- SELL -->
        <v-btn v-if="isAuth" class="sell-btn" @click="go('product-create')">
          Sell
        </v-btn>

        <!-- ICONS -->
        <v-btn icon class="icon-btn" aria-label="cart" @click="go('cart')">
          <v-icon>mdi-cart-outline</v-icon>
        </v-btn>

        <v-btn icon class="icon-btn" aria-label="account" @click="go('login')">
          <v-icon>mdi-account-outline</v-icon>
        </v-btn>

        <!-- USER MENU -->
        <v-menu v-if="isAuth" offset-y>
          <template #activator="{ props }">
            <v-btn v-bind="props" variant="text" class="user-btn">
              <span class="user-name">{{ displayName }}</span>
              <v-icon size="18">mdi-chevron-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="go('profile')">
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item>
            <v-list-item @click="go('product-mine')">
              <v-list-item-title>My Products</v-list-item-title>
            </v-list-item>
            <v-divider />
            <v-list-item @click="doLogout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- AUTH BUTTONS -->
        <template v-else>
          <v-btn variant="text" @click="go('login')">Login</v-btn>
          <v-btn variant="text" @click="go('register')">Register</v-btn>
        </template>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();

const isAuth = computed(() => store.getters["auth/isAuthenticated"]);
const user = computed(() => store.getters["auth/user"] || {});
const displayName = computed(
  () => user.value?.name || user.value?.email || "User"
);

const q = ref("");
const showSearch = true;

function go(name) {
  // Accept either route name or path; keep original behaviour
  router.push({ name });
}
function goHome() {
  router.push({ name: "home" });
}
async function doLogout() {
  await store.dispatch("auth/logout");
  router.push({ name: "login" });
}
function onSearch() {
  router.push({ name: "product-list", query: { q: q.value } });
}
function onClear() {
  q.value = "";
  if (route.name === "product-list") {
    router.replace({ name: "product-list", query: {} });
  }
}
</script>

<style scoped>
/* HEADER BASE */
.renew-header {
  background: rgba(246, 248, 247, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e7f3ed;
  z-index: 1200;
}

/* CONTAINER */
.header-container {
  /* max-width: 1280px; */
  margin: 0 auto;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  gap: 12px;
}

/* LEFT */
.header-left {
  display: flex;
  align-items: center;
  gap: 30px;
  flex: 1;
  min-width: 0; /* let the search shrink */
}

/* LOGO */
.logo-btn {
  /* display: flex; */
  /* align-items: center; */
  /* gap: 8px;   */
  /* padding: 0; */
}
.logo-text {
  font-size: 18px;
  font-weight: 800;
  color: #0d1b14;
  line-height: 1;
}

/* SEARCH */
.search-input {
  max-width: 420px;
  width: 100%;
}

/* override v-text-field background and input weight without heavy selectors */
.search-input :deep(.v-field) {
  background: #e7f3ed;
  border-radius: 999px;
}
.search-input :deep(input) {
  font-weight: 500;
}

/* RIGHT */
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 0 0 auto;
}

/* NAV LINKS */
.nav-links {
  display: flex;
  gap: 16px;
}
.nav-link {
  font-weight: 600;
  color: #0d1b14;
  text-transform: none;
}

/* SELL */
.sell-btn {
  background: #13ec80;
  color: #062016;
  font-weight: 700;
  border-radius: 999px;
  padding-left: 18px;
  padding-right: 18px;
  text-transform: none;
}

/* ICON BUTTONS */
.icon-btn {
  background: #e7f3ed;
  border-radius: 8px;
  width: 40px;
  height: 40px;
}

/* USER */
.user-btn {
  font-weight: 600;
  text-transform: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

/* responsiveness */
@media (max-width: 960px) {
  .search-input,
  .nav-links {
    display: none;
  }
  .logo-text {
    display: none;
  }
  .header-container {
    padding: 0 12px;
  }
}

/* minor focus / hover polish */
.logo-btn:hover .logo-text {
  text-decoration: none;
}

/* keep heavy overrides minimal — Vuetify styling remains */
</style>
