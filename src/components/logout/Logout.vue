<template>
  <!-- Logout Confirmation Popup -->
  <div
    v-if="isVisible"
    class="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 z-50 p-4"
  >
    <div class="bg-white rounded-lg p-6 w-full max-w-sm shadow-2xl">
      <h2 class="text-xl font-semibold text-center mb-4 text-gray-900">
        Are you sure you want to logout?
      </h2>
      <div class="flex justify-between gap-4">
        <!-- Cancel Button -->
        <BaseButton
          label="Cancel"
          intent="inverse"
          @click="onCancel"
          class="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md py-2"
        />

        <!-- Logout Button -->
        <BaseButton
          label="Logout"
          intent="danger"
          @click="onConfirm"
          class="w-1/2 bg-red-500 hover:bg-red-600 text-white rounded-md py-2"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const props = defineProps({
  isVisible: Boolean,
  onCancel: Function,
  onConfirm: Function,
});
</script>