<template>
  <div
    class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"
    :class="{
      'opacity-50': disabled,
      'cursor-not-allowed': disabled,
    }"
  >
    <input
      type="checkbox"
      :id="id"
      v-model="isChecked"
      :disabled="disabled"
      :name="name"
      class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 cursor-pointer"
      :class="{
        'bg-green-400': isChecked,
        'bg-gray-400': !isChecked,
      }"
    />
    <label
      :for="id"
      class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
    >
      <span
        class="toggle-span absolute left-0 top-0 w-6 h-6 bg-white rounded-full transition transform duration-300 ease-in"
        :class="{
          'translate-x-4': isChecked,
          'translate-x-0': !isChecked,
        }"
      ></span>
    </label>
  </div>
</template>
  
  <script setup>
import { ref, watch } from "vue";

// Declare props using `defineProps` in setup()
const props = defineProps({
  value: { type: Boolean, default: false },
  id: { type: String, default: "toggle" },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: "" },
  onLabel: { type: String, default: "On" },
  offLabel: { type: String, default: "Off" },
});

// Create a reactive reference for the toggle state
const isChecked = ref(props.value);

// Watch for changes and emit the updated value to the parent
watch(isChecked, (newValue) => {
  emit("update:value", newValue);
});
</script>
  
  <style scoped>
/* Add any additional styling if needed */
</style>
  