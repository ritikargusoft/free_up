<template>
  <v-autocomplete
    v-model="selectedId"
    :items="options"
    :loading="loading"
    label="Brand"
    :search-input.sync="search"
    item-text="name"
    item-value="brand_id"
    clearable
    hide-no-data
    @update:search-input="onSearch"
    @change="onSelect"
    @blur="onBlur"
  >
    <template #item="{ item }">
      <div class="d-flex align-center">
        <span class="mr-2">{{ item.name }}</span>
      </div>
    </template>
  </v-autocomplete>
</template>
<script setup>
import { ref, watch } from "vue";
import { autoCompleteBrands } from "../api/productService.js";
const props = defineProps({
  brandId: [Number, String, null],
  brandName: [String, null],
  brandId: [Number, String, null],
  brandName: [String, null],
});
const emit = defineEmits(["update:brandId", "update:brandName"]);
const search = ref("");
const options = ref([]);
const loading = ref(false);

const selectedId = ref(props.brandId ?? null);
watch(() => props.brandId, (v) => (selectedId.value = v));
watch(selectedId, (v) => {
  emit("update:brandId", v);
  if (v == null) {
    emit("update:brandName", null);
  } else {
    const found = options.value.find((o) => o.brand_id === v);
    if (found) emit("update:brandName", found.name);
  }
});
let timer = null;
async function onSearch(q) {
  clearTimeout(timer);
  search.value = q;
  search.value = q;
  if (!q || q.length < 1) {
    options.value = [];
    emit("update:brandName", q || null);
    emit("update:brandName", q || null);
    return;
  }
  timer = setTimeout(async () => {
    loading.value = true;
    try {
      const res = await autoCompleteBrands(q, 8);
      options.value = Array.isArray(res) ? res : [];
      console.debug("brand autocomplete for", q, " => ", options.value);
    } catch (err) {
      console.error("brand autocomplete error", err);
      console.error("brand autocomplete error", err);
      options.value = [];
    } finally {
      loading.value = false;
    }
  }, 250);
}
function onBlur() {
  if (!selectedId.value && search.value && search.value.trim()) {
    emit("update:brandName", search.value.trim());
  }
}
function onBlur() {
  if (!selectedId.value && search.value && search.value.trim()) {
    emit("update:brandName", search.value.trim());
  }
}
</script>