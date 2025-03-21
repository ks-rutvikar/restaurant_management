<template>
  <div v-if="!loading && totalPages > 1" class="mt-9 w-full flex items-center">
    <!-- Previous Button -->
    <div v-if="currentPage > 1" class="flex-1 flex justify-start">
      <div
        class="flex items-center cursor-pointer bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded-lg transition-colors duration-300"
        @click="prevLoad"
      >
        <font-awesome-icon icon="arrow-left" class="text-lg mr-2" />
        <span class="text-m font-semibold">Previous</span>
      </div>
    </div>

    <!-- Next Button -->
    <div v-if="currentPage < totalPages" class="flex-1 flex justify-end">
      <div
        class="flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg transition-colors duration-300"
        @click="nextLoad"
      >
        <span class="text-m font-semibold mr-2">Next</span>
        <font-awesome-icon icon="arrow-right" class="text-lg" />
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { computed, defineProps, defineEmits } from "vue";

// Props to make it reusable
const props = defineProps({
  totalItems: { type: Number, required: true }, // Total categories/items count
  itemsPerPage: { type: Number, default: 5 }, // Default 5 items per page
  currentPage: { type: Number, required: true }, // Current page number (sync with parent)
  loading: { type: Boolean, default: false }, // Loading state
});

// Emits event to update currentPage in parent
const emit = defineEmits(["update:currentPage"]);

// Compute total pages
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

// Next page function
const nextLoad = () => {
  if (props.currentPage < totalPages.value) {
    emit("update:currentPage", props.currentPage + 1);
  }
};

// Previous page function
const prevLoad = () => {
  if (props.currentPage > 1) {
    emit("update:currentPage", props.currentPage - 1);
  }
};
</script>
