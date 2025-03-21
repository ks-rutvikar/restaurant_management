<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
      <h3 class="text-2xl font-bold mb-4">
        {{ isEditing ? "Edit Category" : "Add New Category" }}
      </h3>

      <form @submit.prevent="saveCategory">
        <div class="mb-4">
          <label for="name" class="block text-sm font-semibold"
            >Category Name</label
          >
          <input
            v-model="category.name"
            id="name"
            type="text"
            class="mt-2 w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div class="mb-4">
          <label for="description" class="block text-sm font-semibold"
            >Description</label
          >
          <input
            v-model="category.description"
            id="description"
            type="text"
            class="mt-2 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div class="mb-4">
          <label for="discount" class="block text-sm font-semibold"
            >Discount (%)</label
          >
          <input
            v-model="category.discount"
            id="discount"
            type="number"
            min="0"
            max="100"
            class="mt-2 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div class="mb-4">
          <label for="rating" class="block text-sm font-semibold"
            >Rating (out of 5)</label
          >
          <input
            v-model="category.rating"
            id="rating"
            type="number"
            min="0"
            max="5"
            class="mt-2 w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            @click="$emit('update:show', false)"
            class="px-4 py-2 bg-gray-300 rounded-md mr-4"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
  
  <script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  show: Boolean,
  category: Object,
  isEditing: Boolean,
});

const emit = defineEmits(["update:show", "save"]);

watch(
  () => props.show,
  (newVal) => {
    if (!newVal) {
      // Reset category when modal is closed
      props.category.name = "";
      props.category.description = "";
      props.category.discount = 0;
      props.category.offers = 0;
      props.category.rating = 0;
    }
  }
);

const saveCategory = () => {
  emit("save", props.category);
};
</script>
  
  <style scoped>
/* Add your custom styles */
</style>
  