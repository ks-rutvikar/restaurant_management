<template>
  <div
    v-if="visible"
    class="fixed top-4 right-4 p-4 rounded-lg shadow-lg text-white"
    :class="type === 'success' ? 'bg-green-500' : 'bg-red-500'"
  >
    {{ message }}
  </div>
</template>
  
<script setup>
import { ref } from "vue";

const visible = ref(false);
const message = ref("");
const type = ref("success");

const showNotification = (msg, msgType = "success", duration = 3000) => {
  message.value = msg;
  type.value = msgType;
  visible.value = true;

  setTimeout(() => {
    visible.value = false;
  }, duration);
};

defineExpose({ showNotification });
</script>
  