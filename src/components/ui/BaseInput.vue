<template>
  <input
    :type="type"
    class="w-full p-3 border border-gray-300 rounded-md"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
import { defineEmits, defineProps } from "vue";
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