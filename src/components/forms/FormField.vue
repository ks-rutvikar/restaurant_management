<template>
  <BaseLabel :label="label" />
  <slot></slot>
  <BaseErrorMessage :errorMessage="error" />
</template>

<script setup>
import { defineProps } from "vue";
import BaseLabel from "../ui/BaseLabel.vue";
import BaseErrorMessage from "../ui/BaseErrorMessage.vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  error: {
    type: String,
    default: "",
  },
});
</script>
