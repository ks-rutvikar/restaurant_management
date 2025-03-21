<template>
  <div
    class="p-8 pt-43 bg-gray-100 min-h-screen flex flex-col justify-start items-center"
  >
    <div class="justify-start w-full">
      <h2 class="text-3xl font-bold mb-4 pl-1 text-black-700">Menus</h2>
      <div class="w-full mb-3">
        <nav class="flex items-center space-x-2 text-m text-gray-700 pl-1">
          <router-link to="/menu" class="text-black-300 hover:text-blue-800"
            >Menus</router-link
          >
        </nav>
      </div>
    </div>
    <div
      class="absolute top-43 right-8 pr-4 pl-3 flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
      @click="openAddModal"
    >
      <font-awesome-icon icon="plus" class="text-lg" />
      <span class="text-l font-semibold ml-1">Add New Menu</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-700 mt-6">
      <p class="text-lg">Loading Menu details...</p>
    </div>

    <!-- No Menu Available -->
    <div
      v-else-if="menusToShow.length === 0"
      class="text-center text-gray-700 mt-6"
    >
      <p class="text-lg">
        No menus available. Click "Add New Menu" to create one.
      </p>
    </div>
    <!-- Menu Table -->
    <div
      v-else
      class="bg-white shadow-lg rounded-md overflow-hidden pt-4 mt-5 w-full lg:max-w-8xl"
    >
      <div class="overflow-x-auto">
        <BaseTable :data="menusToShow" :columns="columns">
          <template #actions="{ row }">
            <div class="flex items-center space-x-8">
              <font-awesome-icon
                icon="eye"
                @click="viewMenu(row)"
                class="text-xl hover:text-gray-600 text-blue-800 cursor-pointer"
              />
              <font-awesome-icon
                icon="pen-to-square"
                @click="openEditModal(row)"
                class="text-xl hover:text-gray-600 text-black-500 cursor-pointer"
              />
              <font-awesome-icon
                icon="trash"
                @click="removeMenu(row.id)"
                class="text-xl hover:text-gray-600 text-red-500 cursor-pointer"
              />

              <ShareMenu :menu="row" />
            </div>
          </template>
        </BaseTable>
      </div>
    </div>

    <!-- Pagination Component -->
    <Pagination
      :totalItems="menus.length"
      :itemsPerPage="5"
      v-model:currentPage="currentPage"
      :loading="loading"
    />

    <div
      v-if="showModal"
      class="fixed inset-0 bg-gray-100 bg-opacity-50 flex justify-center items-center z-50"
      @keydown.enter="saveMenu"
      tabindex="0"
      ref="modalRef"
    >
      <div
        class="bg-white p-6 rounded-md shadow-lg w-full max-w-md sm:max-w-lg lg:max-w-xl relative"
      >
        <!-- Close Icon (X Mark) -->
        <font-awesome-icon
          icon="xmark"
          @click="closeModal"
          class="text-xl hover:text-red-600 text-black cursor-pointer absolute top-6 right-4 border-2 border-black px-2 py-1 rounded-md hover:border-red-600"
        />
        <h3 class="text-2xl font-bold text-gray-700 text-left">
          {{ isEditing ? "Edit Menu" : "Add Menu" }}
        </h3>

        <BaseLabel label="Menu Name" class="" />
        <BaseInput
          v-model="newMenu.name"
          :value="splitText(newMenu.name).join('\n')"
          placeholder="Enter menu name..."
          class=""
        />
        <BaseLabel label="Currency" />
        <BaseSelect
          v-model="newMenu.currency"
          :options="currencyOptions"
          :value="splitText(newMenu.currency).join('\n')"
          placeholder="Select Currency"
          class="w-full p-3 border border-gray-300 rounded-md"
        />
        <BaseLabel label="Status" />
        <BaseSelect
          v-model="newMenu.active"
          :options="statusOptions"
          :value="splitText(newMenu.active).join('\n')"
          placeholder="Select Status"
          class="w-full p-3 border border-gray-300 rounded-md"
        />
        <BaseLabel label="Discount (%)" />
        <BaseInput
          v-model="newMenu.discount"
          :value="splitNumber(newMenu.discount).join('\n')"
          placeholder="Enter discount..."
          type="number"
          class=""
        />
        <BaseLabel label="Rating" />
        <BaseInput
          v-model="newMenu.rating"
          :value="splitNumber(newMenu.rating).join('\n')"
          placeholder="Enter rating..."
          type="number"
          min="1"
          max="5"
          step="0.1"
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
        <div class="flex justify-between mt-8">
          <BaseButton
            label="Submit"
            intent="default"
            @click="saveMenu"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <ConfirmDelete
      v-if="showDeleteConfirmation"
      :show="showDeleteConfirmation"
      :message="deleteMessage"
      @confirm="confirmDelete"
      @close="closeDeleteConfirmation"
    />
  </div>
</template>
  
  
  <script setup>
import { ref, reactive, onMounted, computed, watch, render } from "vue";
import BaseLabel from "@/components/ui/BaseLabel.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseTable from "@/components/ui/BaseTable.vue";
import Pagination from "@/components/pagination/Pagination.vue";
import ShareMenu from "./ShareMenu.vue";
import ConfirmDelete from "@/components/logout/ConfirmDelete.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { supabase } from "@/supabase";
import { useRouter } from "vue-router";
const router = useRouter();

const menus = ref([]);
const loading = ref(true);
const showModal = ref(false);
const deleteMessage = ref("");
const showDeleteConfirmation = ref(false);
const isEditing = ref(false);
const newMenu = reactive({
  id: null,
  name: "",
  currency: "USD",
  active: "active",
  discount: "0",
  rating: "4.8",
  image: null,
});

const splitText = (text) => {
  if (!text || typeof text !== "string") return []; // Ensure text is a string
  const words = text.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += 5) {
    chunks.push(words.slice(i, i + 5).join(" "));
  }
  return chunks;
};

const splitNumber = (number) => {
  if (typeof number !== "number" && typeof number !== "string") return [];
  const numberString = number.toString();
  const words = numberString.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += 5) {
    chunks.push(words.slice(i, i + 5).join(" "));
  }
  return chunks;
};

const menuToDelete = ref(null);

const currencies = ["$", "€", "₹", "£"];

const currencyOptions = currencies.map((currency) => ({
  value: currency,
  label: currency,
}));

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const props = defineProps({
  showModal: Boolean,
  isEditing: Boolean,
  data: Array,
});

// Table columns
const columns = [
  { header: "Menu Name", render: (row) => row.name },
  { header: "Currency", render: (row) => row.currency },
  {
    header: "Status",
    render: (row) => (row.active === "active" ? "Active" : "Inactive"),
  },
  { header: "Discount", render: (row) => row.discount + "%" },
  { header: "Rating", render: (row) => row.rating + " / 5" },
  {
    header: "Image",
    render: (row) => {
      return row.image
        ? `<img src="${row.image}" alt="${row.name}" class="w-20 h-20 object-cover rounded-md" />`
        : "No Image";
    },
  },

  { header: "", render: () => {}, actions: true },
];

// Pagination logic
const itemsPerPage = 5;
const currentPage = ref(1);
// const totalPages = computed(() => Math.ceil(menus.value.length / itemsPerPage));
const menusToShow = computed(() =>
  menus.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  )
);

// Add new menu
const openAddModal = () => {
  isEditing.value = false;
  Object.assign(newMenu, {
    id: null,
    name: "",
    currency: "",
    active: "",
    discount: "",
    rating: "",
    image: null,
  });
  showModal.value = true;
};

const openEditModal = (menu) => {
  isEditing.value = true;
  Object.assign(newMenu, { ...menu });
  if (newMenu.image && newMenu.image instanceof File) {
    newMenu.image = URL.createObjectURL(newMenu.image);
  }

  showModal.value = true;
};

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newMenu.image = file;
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

const saveMenu = async () => {
  if (!newMenu.name) return alert("Menu name is required!");
  if (!newMenu.image && !newMenu.id) return alert("Menu image is required!"); 
  if (newMenu.active === null) return alert("Menu status is required!");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  // console.log(user);

  if (!userId) return alert("User ID not found!");

  const { data } = await supabase
    .from("menus")
    .select("*")
    .eq("restaurant_id", userId);

  let imageUrl = newMenu.image;

  if (newMenu.image && newMenu.image instanceof File) {
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
      fetchMenus(); // Fetch the latest menus from Supabase
      closeModal();
    }
  }
};

onMounted(fetchMenus);

onMounted(async () => {
  await fetchMenus(); // Fetch data
  setTimeout(() => {
    loading.value = false; // Hide loading after 3 seconds
  }, 1000);
});

const closeModal = () => {
  if (newMenu.image && newMenu.image instanceof Object) {
    URL.revokeObjectURL(newMenu.image);
  }

  showModal.value = false;
};

const viewMenu = (row) => {
  router.push({
    name: "menucategorypage",
    params: { id: row.id, name: row.name },
  });
};

const removeMenu = (id) => {
  menuToDelete.value = id;
  deleteMessage.value = "Are you sure you want to delete this menu?";
  showDeleteConfirmation.value = true;
};

const closeDeleteConfirmation = () => {
  showDeleteConfirmation.value = false;
  menuToDelete.value = null;
};

const confirmDelete = async () => {
  if (!menuToDelete.value) {
    console.error("No menu selected for deletion.");
    return;
  }

  const { error } = await supabase
    .from("menus")
    .delete()
    .eq("id", menuToDelete.value);

  if (error) {
    console.error("Error deleting menu from Supabase:", error);
    alert("Failed to delete menu! Please try again.");
  } else {
    menus.value = menus.value.filter((menu) => menu.id !== menuToDelete.value);
    alert("Menu deleted successfully!");
  }

  closeDeleteConfirmation();
};
</script>
  
  <style>
h2,
nav {
  font-family: "Times New Roman", Times, serif;
}

@media (max-width: 640px) {
  .table-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
  