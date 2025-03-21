<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img
        v-if="imageSrc"
        :src="imageSrc"
        :alt="imageAlt"
        class="w-full h-48 object-cover"
      />
      <div class="px-6 py-4">
        <h2 class="font-bold text-xl mb-2 text-gray-900">{{ title }}</h2>
        <p class="text-gray-700 text-base">{{ description }}</p>
      </div>
      <div v-if="footer" class="px-6 py-4 bg-gray-100">
        <slot name="footer"></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    imageSrc: {
      type: String,
      default: null
    },
    imageAlt: {
      type: String,
      default: 'Card Image'
    },
    footer: {
      type: Boolean,
      default: false
    }
  })
  </script>
  
  <style scoped>
  /* You can add custom styling here if needed */
  </style>
  