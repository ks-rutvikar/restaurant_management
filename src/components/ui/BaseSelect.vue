<template>
    <select
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-3 w-100"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="modelValue">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
</template>


<script setup>
import { defineProps, defineEmits } from "vue";
const props = defineProps({
  label: { type: String, default: "" },
  options: { type: Array, required: true },
  placeholder: { type: String, default: "Select an option" },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
</style>