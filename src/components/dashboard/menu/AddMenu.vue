<template>
  <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50"
    >
    <div class="bg-white p-6 rounded-md shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl">
    <h3 class="text-lg font-bold mb-4 text-gray-700 text-center">
      {{ isEditing ? "Edit Menu" : "Add Menu" }}
    </h3>

    <BaseInput v-model="newMenu.name" placeholder="Menu Name" class="mb-4" />
    
    <BaseSelect
      v-model="newMenu.currency"
      :options="currencyOptions"
      placeholder="Select Currency"
      class="w-full p-3 border border-gray-300 rounded-md mb-4"
    />

    <BaseSelect
      v-model="newMenu.active"
      :options="statusOptions"
      placeholder="Select Status"
      class="w-full p-3 border border-gray-300 rounded-md mb-4"
    />

    <BaseInput v-model="newMenu.discount" placeholder="Discount (%)" type="number" class="mb-4" />
    <BaseInput v-model="newMenu.offers" placeholder="Offers" class="mb-4" />
    
    <BaseInput
      v-model="newMenu.rating"
      placeholder="Rating"
      type="number"
      min="1"
      max="5"
      step="0.1"
      class="mb-4"
    />

    <div class="mb-5">
      <BaseLabel label="Menu Image" class="block text-sm font-medium text-black-700 pl-1" />
      <input
        type="file"
        accept="image/*"
        @change="handleImageUpload"
        class="mt-2 pl-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md h-7 pt-1"
      />
      <img v-if="imagePreview" :src="imagePreview" alt="Preview" class="mt-2 w-32 h-32 object-cover rounded-md" />
    </div>

    <div class="flex justify-between mt-4">
      <BaseButton label="Save" intent="success" @click="saveMenu" class="w-28 sm:w-32" />
      <BaseButton label="Cancel" intent="danger" @click="closeModal" class="w-28 sm:w-32" />
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { supabase } from "@/supabase";
import BaseLabel from "@/components/ui/BaseLabel.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";

const emit = defineEmits(["close", "save"]);
const menus = ref([]);
const imagePreview = ref(null);
const isEditing = ref(false);
const showModal = ref(false);


const newMenu = reactive({
  id: null,
  name: "",
  currency: "USD",
  active: "active",
  discount: 0,
  offers: "",
  rating: 0,
  image: null,
});

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
    newMenu.image = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const saveMenu = async () => {
  if (!newMenu.name) return alert("Menu name is required!");
  if (!newMenu.image && !newMenu.id) return alert("Menu image is required!");
  if (newMenu.active === null) return alert("Menu status is required!");

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) return alert("User authentication failed!");

  const userId = userData.user.id;
  let imageUrl = newMenu.image;

  if (newMenu.image instanceof File) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("menu-images")
      .upload(`menus/${Date.now()}_${newMenu.image.name}`, newMenu.image);

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return alert("Image upload failed!");
    }

    imageUrl = supabase.storage
      .from("menu-images")
      .getPublicUrl(uploadData.path).data.publicUrl;
  }

  if (newMenu.id) {
    const { error: updateError } = await supabase
      .from("menus")
      .update({
        name: newMenu.name,
        currency: newMenu.currency,
        active: newMenu.active,
        discount: newMenu.discount,
        offers: newMenu.offers,
        rating: newMenu.rating,
        image: imageUrl,
      })
      .eq("id", newMenu.id);

    if (updateError) {
      console.error("Error updating menu:", updateError);
      return alert("Failed to update menu!");
    } else {
      alert("Menu updated successfully!");
      fetchMenus();
      closeModal();
    }
  } else {
    const { error: insertError } = await supabase.from("menus").insert([
      {
        name: newMenu.name,
        currency: newMenu.currency,
        active: newMenu.active,
        discount: newMenu.discount,
        offers: newMenu.offers,
        rating: newMenu.rating,
        restaurant_id: userId,
        image: imageUrl,
      },
    ]);

    if (insertError) {
      console.error("Error inserting new menu:", insertError);
      return alert("Failed to save menu!");
    } else {
      alert("Menu saved successfully!");
      fetchMenus();
      closeModal();
    }
  }
};

const fetchMenus = async () => {
  const { data, error } = await supabase.from("menus").select("*");
  if (error) {
    console.error("Error fetching menus:", error);
  } else {
    menus.value = data;
  }
};

const closeModal = () => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }

  Object.assign(newMenu, {
    id: null,
    name: "",
    currency: "USD",
    active: "active",
    discount: 0,
    offers: "",
    rating: 0,
    image: null,
  });

  imagePreview.value = null;
  emit("close");
};

onMounted(fetchMenus);
</script>
