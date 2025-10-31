<template>
  <v-combobox
    v-model="localModel"
    :items="options"
    label="Categories"
    multiple
    chips
    clearable
    hide-no-data
    :loading="loading"
    :search-input.sync="search"
    item-text="name"
    item-value="category_id"
  />
</template>
<script setup>
import { ref, computed, watchEffect } from "vue";
import { autoCompleteCategories } from "../api/productService.js";
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
});
const emit = defineEmits(["update:modelValue"]);
const search = ref("");
const options = ref([]);
const loading = ref(false);
const localModel = computed({
  get() {
    return props.modelValue ?? [];
  },
  set(newVal) {
    const cleaned = (newVal || []).map((v) => {
      if (typeof v === "string") return v.trim();
      if (v && typeof v === "object") {
        return v;
      }
      return v;
    }).filter((x) => (typeof x === "string" ? x.length > 0 : x !== null && x !== undefined));
    try {
      const curr = JSON.stringify(props.modelValue || []);
      const next = JSON.stringify(cleaned || []);
      if (curr !== next) emit("update:modelValue", cleaned);
    } catch (e) {
      emit("update:modelValue", cleaned);
    }
  }
});
let timer = null;
async function fetchOptions(q) {
  loading.value = true;
  try {
    const res = await autoCompleteCategories(q, 8);
    options.value = Array.isArray(res) ? res : [];
  } catch (err) {
    options.value = [];
  } finally {
    loading.value = false;
  }
}
function onSearch(q) {
  clearTimeout(timer);
  if (!q || q.length < 1) {
    options.value = [];
    return;
  }
  timer = setTimeout(() => fetchOptions(q), 250);
}
watchEffect(() => {
  onSearch(search.value);
});
</script>