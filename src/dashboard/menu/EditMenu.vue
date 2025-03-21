<template>
  <div>
    <h3 class="text-lg font-bold mb-4 text-gray-700 text-center">Edit Menu</h3>
    <BaseInput v-model="menu.name" placeholder="Menu Name" class="mb-4" />
    <BaseSelect
      v-model="menu.currency"
      :options="currencyOptions"
      placeholder="Select Currency"
      class="w-full p-3 border border-gray-300 rounded-md mb-4"
    />
    <BaseSelect
      v-model="menu.active"
      :options="statusOptions"
      placeholder="Select Status"
      class="w-full p-3 border border-gray-300 rounded-md mb-4"
    />
    <BaseInput
      v-model="menu.discount"
      placeholder="Discount (%)"
      type="number"
      class="mb-4"
    />
    <BaseInput v-model="menu.offers" placeholder="Offers" class="mb-4" />
    <BaseInput
      v-model="menu.rating"
      placeholder="Rating"
      type="number"
      min="1"
      max="5"
      step="0.1"
      class="mb-4"
    />

    <div class="mb-5">
      <BaseLabel
        label="Menu Image"
        class="block text-sm font-medium text-black-700 pl-1"
      ></BaseLabel>
      <input
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        class="mt-2 pl-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md h-7 pt-1"
      />
    </div>

    <div class="flex justify-between mt-4">
      <BaseButton
        label="Update"
        intent="success"
        @click="updateMenu"
        class="w-28 sm:w-32"
      />
      <BaseButton
        label="Cancel"
        intent="danger"
        @click="$emit('close')"
        class="w-28 sm:w-32"
      />
    </div>
  </div>
</template>
  
  <script setup>
import { reactive, defineProps, defineEmits } from "vue";

const props = defineProps({
  menuData: Object,
});

const emit = defineEmits(["close", "update"]);

const menu = reactive({ ...props.menuData });

const currencyOptions = [
  { value: "$", label: "USD" },
  { value: "€", label: "EUR" },
  { value: "₹", label: "INR" },
  { value: "£", label: "GBP" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    menu.image = file;
  }
};

const updateMenu = () => {
  if (!menu.name) {
    alert("Menu name is required!");
    return;
  }
  emit("update", menu);
  emit("close");
};
</script>
  
  <style scoped>
</style>