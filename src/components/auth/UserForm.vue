<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form
      @submit.prevent="onSubmit"
      class="bg-white p-8 rounded-none shadow-lg w-full max-w-4xl relative"  
    >
      <h1 class="text-3xl font-bold mb-6 text-center">Profile Management</h1>

      <!-- Close Icon (X mark) at top-right -->
      <font-awesome-icon
        icon="xmark"
        class="text-2xl hover:text-red-600 text-black cursor-pointer absolute top-6 right-6 border-2 border-black px-2 py-1 rounded-md hover:border-red-600"
        @click="goBack"  
      />

      <!-- Logo Upload Section -->
      <div class="flex flex-col items-center mb-6">
        <img
          :src="logoPreview || defaultLogo"
          class="w-24 h-24 rounded-full border-4 border-gray-300 mb-4"
        />
        <input
          type="file"
          @change="handleFileUpload"
          class="hidden"
          ref="fileInput"
        />
        <BaseButton
          label="Upload Logo"
          intent="default"
          @click="triggerFileInput"
          type="button"
        />
      </div>

      <!-- Input Fields Section -->
      <div class="grid grid-cols-2 gap-6 pt-6 mb-2">
        <label class="block">
          <span class="mb-2 block text-m font-medium text-gray-900"
            >Restaurant Name</span
          >
          <input
            v-model="formData.name"
            type="text"
            placeholder="Restaurant Name"
            class="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
          />
        </label>

        <label class="block">
          <span class="mb-2 block text-m font-medium text-gray-900"
            >Contact Number</span
          >
          <input
            v-model="formData.phone"
            type="text"
            placeholder="Contact Number"
            class="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
          />
        </label>

        <label class="block">
          <span class="mb-2 block text-m font-medium text-gray-900">Email</span>
          <input
            v-model="formData.email"
            type="email"
            placeholder="Email"
            class="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
          />
        </label>

        <label class="block">
          <span class="mb-2 block text-m font-medium text-gray-900"
            >Location</span
          >
          <input
            v-model="formData.address"
            type="text"
            placeholder="Location"
            class="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 w-full"
          />
        </label>
      </div>

      <!-- Save Button -->
      <BaseButton label="Save Profile" intent="default" class="mt-6 w-full" />

      <div
        class="col-span-2 text-right cursor-pointer text-gray-400 hover:text-blue-700 pt-4"
        @click="goBack"
      >
        <font-awesome-icon icon="backward" class="pr-2" />
        <span class="text-m font-semibold">Back to the Page</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "@/supabase";
import BaseButton from "../ui/BaseButton.vue";

const formData = ref({ name: "", phone: "", email: "", address: "", logo: "" });
const fileInput = ref(null);
const logoPreview = ref(null);
const defaultLogo = "/logo.png";

onMounted(async () => {
  const { data, error } = await supabase
    .from("user_profile")
    .select("*")
    .single();
  if (data) {
    formData.value = data;
    logoPreview.value = data.logo || defaultLogo;
  }
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    logoPreview.value = URL.createObjectURL(file);
    formData.value.logo = file;
  }
};

const onSubmit = async () => {
  let imageUrl = formData.value.logo;

  if (formData.value.logo instanceof File) {
    const { data, error } = await supabase.storage
      .from("logo-images")
      .upload(
        `user_profile/${Date.now()}_${formData.value.logo.name}`,
        formData.value.logo,
        { upsert: true }
      );

    if (error) {
      alert("Image upload failed!");
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("logo-images")
      .getPublicUrl(data.path);
    imageUrl = publicUrlData.publicUrl;
  }

  const { error: updateError } = await supabase.from("user_profile").upsert({
    ...formData.value,
    logo: imageUrl,
  });

  if (updateError) {
    alert("Profile update failed!");
  } else {
    alert("Profile updated successfully!");
  }
};

const goBack = () => window.history.back();
</script>

<style scoped>
h1 {
  font-family: "Times New Roman", Times, serif;
}

@media (max-width: 640px) {
  form {
    max-width: 100%;
    padding: 6px;
  }
}

@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>
