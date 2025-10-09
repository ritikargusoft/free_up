<!-- src/features/auth/components/LoginMixin.vue -->
<script setup>
import { ref } from "vue";

const form = ref({});
const error = ref("");
const loading = ref(false);

function setError(err) {
  error.value = err;
}

function clearError() {
  error.value = "";
}

export { form, error, loading, setError, clearError };
</script>
