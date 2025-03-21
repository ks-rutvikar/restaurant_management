<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
    @click.self="close"
  >
    <div
      class="bg-white p-6 rounded-md shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl transform transition-transform duration-300 ease-out"
    >
      <h3 class="text-lg font-bold mb-4 text-gray-700 text-center">
        {{ message || "Are you sure you want to delete this item?" }}
      </h3>
      <div class="flex justify-between mt-5">
        <BaseButton
          label="Delete"
          intent="danger"
          @click="confirm"
          class="w-28 sm:w-32"
        />
        <BaseButton
          label="Cancel"
          intent="success"
          @click="close"
          class="w-28 sm:w-32"
        />
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import { defineProps, defineEmits } from "vue";
import BaseButton from "../ui/BaseButton.vue";

const props = defineProps({
  show: Boolean, // Controls modal visibility from parent
  message: {
    type: String,
    default: "Are you sure you want to delete this item?",
  },
});

const emit = defineEmits(["confirm", "close"]);

const confirm = () => emit("confirm");
const close = () => emit("close");
</script>
  
  <style scoped></style>
  