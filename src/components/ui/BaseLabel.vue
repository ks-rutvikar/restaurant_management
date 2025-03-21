<template>
  <label
    class="mb-2 block text-sm font-medium text-gray-900 mt-6"
  >
    {{ label }}
  </label>
</template>


<script setup>
import { defineProps } from "vue";

defineProps({
  label: { type: String, required: true },
});
</script>

<style scoped>
</style>