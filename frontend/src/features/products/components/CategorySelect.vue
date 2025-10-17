
<template>
  <v-combobox
    v-model="selected"
    :items="options"
    label="Categories"
    multiple
    chips
    hide-no-data
    :loading="loading"
    :search-input.sync="search"
    @update:search-input="onSearch"
    item-text="name"
    item-value="category_id"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import { autoCompleteCategories } from "../api/productService.js";

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
});
const emit = defineEmits(["update:modelValue"]);

const search = ref("");
const options = ref([]);
const loading = ref(false);
const selected = ref([...props.modelValue]);

watch(() => props.modelValue, (v) => (selected.value = [...v]));
watch(selected, (v) => emit("update:modelValue", v));

let timer;
function onSearch(q) {
  clearTimeout(timer);
  if (!q || q.length < 1) {
    // do not fetch until user types
    options.value = [];
    return;
  }
  timer = setTimeout(async () => {
    loading.value = true;
    try {
      const res = await autoCompleteCategories(q, 8);
      options.value = res;
    } catch {
      options.value = [];
    } finally {
      loading.value = false;
    }
  }, 250);
}
</script>