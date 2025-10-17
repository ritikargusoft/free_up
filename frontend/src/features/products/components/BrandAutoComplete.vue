
<template>
  <v-autocomplete
    v-model="selected"
    :items="options"
    :loading="loading"
    label="Brand"
    :search-input.sync="search"
    item-text="name"
    item-value="brand_id"
    clearable
    hide-no-data
    @update:search-input="onSearch"
  >
    <template v-slot:item="{ item }">
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
  modelValue: [Number, String, null],
});
const emit = defineEmits(["update:modelValue"]);

const search = ref("");
const options = ref([]);
const loading = ref(false);
const selected = ref(props.modelValue);

watch(() => props.modelValue, (v) => (selected.value = v));
watch(selected, (v) => emit("update:modelValue", v));

let timer = null;
function onSearch(q) {
  clearTimeout(timer);
  if (!q || q.length < 1) {
    options.value = [];
    return;
  }
  timer = setTimeout(async () => {
    loading.value = true;
    try {
      const res = await autoCompleteBrands(q, 8);
      options.value = res;
    } catch (err) {
      options.value = [];
    } finally {
      loading.value = false;
    }
  }, 250);
}
</script>
