<template>
      <input
        type="radio"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 " 
        :value="value"
        :checked="modelValue === value"
        @change="$emit('update:modelValue', value)"
      />
      <span class="text-gray-900 dark:text-white">{{ label }}</span>
</template>


<script setup>
  import { defineProps, defineEmits } from "vue";
  
  const props = defineProps({
    label: { type: String, default: "" },
    value: { type: String, required: true },
    modelValue: { type: String, default: "" },
  });
  
  defineEmits(["update:modelValue"]);
</script>

<style scoped>
</style>