<template>
    <label class="flex items-center space-x-2 p-1 m-2">
      <input
        type="checkbox"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5" 
        @change="$emit('update:modelValue', $event.target.checked)"
      />
      <span class="text-gray-900 dark:text-white">{{ label }}</span>
    </label>
</template>


<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "",
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
</style>