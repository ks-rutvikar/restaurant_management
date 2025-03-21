<template>
  <textarea
    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-100"
    @input="$emit('update:modelValue', $event.target.value)"
  ></textarea>
</template>


<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  type: {
    type: String,
    detault: "text",
  },
});
defineEmits(["update:modelValue"]);
</script>

<style scoped>
</style>