<template>
    <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
      {{ errorMessage }}
    </p>
</template>
  
<script setup>
import { defineProps } from "vue";

defineProps({
  errorMessage: { type: String, default: "" },
});
</script>
  
  <style scoped>
</style>