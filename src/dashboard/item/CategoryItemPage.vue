<template>
  <div
    class="p-8 pt-43 bg-gray-100 min-h-screen flex flex-col justify-start items-center"
  >
    <div class="justify-start w-full">
      <h2 class="text-3xl font-bold mb-4 pl-1 text-black-700">Items</h2>

      <!-- Breadcrumb Section -->
      <div class="w-full mb-3">
        <nav class="flex items-center space-x-2 text-m text-gray-700 pl-1">
          <router-link to="/menu" class="text-black-300 hover:text-blue-800"
            >Menus</router-link
          >
          <span class="text-gray-500">></span>
          <router-link
            :to="`/menu/${id}/${menuName}`"
            class="text-black-300 hover:text-blue-800"
            >{{ menuName }}</router-link
          >
          <span class="text-gray-500">></span>
          <router-link
            :to="`/menu/${id}/${menuName}/${categoryId}/${categoryName}`"
            class="text-black-300 hover:text-blue-800"
          >
            {{ categoryName }}
          </router-link>
        </nav>
      </div>
    </div>

    <div
      class="absolute top-43 right-8 pr-4 pl-3 flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
      @click="openModal"
    >
      <font-awesome-icon icon="plus" class="text-lg" />
      <span class="text-l font-semibold ml-1">Add New Items</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-700 mt-6">
      <p class="text-lg">Loading Items details...</p>
    </div>

    <!-- No Items Available -->
    <div
      v-else-if="itemToShow.length === 0"
      class="text-center text-gray-700 mt-6"
    >
      <p class="text-lg">
        No items available. Click "Add New Items" to create one.
      </p>
    </div>

    <!-- Items Table -->
    <div
      v-else
      class="bg-white shadow-lg rounded-md overflow-hidden pt-4 mt-5 w-full lg:max-w-8xl"
    >
      <div class="overflow-x-auto">
        <BaseTable :data="itemToShow" :columns="columns">
          <template #actions="{ row }">
            <div class="flex items-center space-x-8">
              <font-awesome-icon
                icon="pen-to-square"
                @click="editItem(row)"
                class="text-xl hover:text-gray-600 text-black-500 cursor-pointer"
              />
              <font-awesome-icon
                icon="trash"
                @click="removeItem(row.id)"
                class="text-xl hover:text-gray-600 text-red-500 cursor-pointer"
              />
            </div>
          </template>

          <template #move="{ row }">
            <div class="flex items-center space-x-2">
              <font-awesome-icon
                icon="arrow-up"
                @click="moveUp(row)"
                class="text-xl hover:text-gray-600 text-gray-300 cursor-pointer"
              />
              <font-awesome-icon
                icon="arrow-down"
                @click="moveDown(row)"
                class="text-xl hover:text-gray-600 text-gray-300 cursor-pointer"
              />
            </div>
          </template>
        </BaseTable>
      </div>
    </div>

    <!-- Pagination Component -->
    <Pagination
      :totalItems="items.length"
      :itemsPerPage="5"
      v-model:currentPage="currentPage"
      :loading="loading"
    />

    <!-- Add / Edit Item Modal -->
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

        <h3 class="text-2xl font-bold mb-4 text-gray-700 text-left">
          {{ isEditing ? "Edit Item" : "Add Item" }}
        </h3>
        <BaseLabel label="Item Name" />
        <BaseInput
          v-model="newItems.name"
          :value="splitText(newItems.name).join('\n')"
          placeholder="Enter item name..."
          class=""
        />
        <BaseLabel label="Description" />
        <BaseInput
          v-model="newItems.description"
          :value="splitText(newItems.description).join('\n')"
          placeholder="Enter description..."
        />
        <BaseLabel label="Price" />
        <BaseInput
          v-model="newItems.price"
          :value="splitNumber(newItems.price).join('\n')"
          type="number"
          placeholder="Enter price..."
          class=""
        />
        <BaseLabel label="Status" />
        <BaseSelect
          v-model="newItems.active"
          :value="splitText(newItems.active).join('\n')"
          :options="statusOptions"
          placeholder="Select Status"
          class="w-full"
        />
        <BaseLabel label="Discount (%)" />
        <BaseInput
          v-model="newItems.discount"
          :value="splitNumber(newItems.discount).join('\n')"
          type="number"
          placeholder="Enter discount..."
        />
        <BaseLabel label="Offers" />
        <BaseInput
          v-model="newItems.offers"
          :value="splitNumber(newItems.offers).join('\n')"
          placeholder="Enter offers..."
        />
        <BaseLabel label="Rating" />
        <BaseInput
          v-model="newItems.rating"
          :value="splitNumber(newItems.rating).join('\n')"
          type="number"
          min="1"
          max="5"
          step="0.1"
          placeholder="Enter rating..."
        />

        <div class="mb-5">
          <BaseLabel
            label="Item Image"
            class="block text-sm font-medium text-black-700 pl-1"
          />
          <input
            type="file"
            accept="image/*"
            @change="handleImageUpload"
            class="mt-2 pl-1 block w-full text-sm text-gray-500 border border-gray-300 rounded-md h-7 pt-1"
          />
          <img
            v-if="previewImage"
            :src="previewImage"
            alt="Preview"
            class="mt-2 w-24 h-24 rounded-md object-cover"
          />
        </div>

        <div class="flex justify-between mt-4">
          <BaseButton
            label="Submit"
            intent="default"
            @click="saveItem"
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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import BaseTable from "@/components/ui/BaseTable.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import BaseLabel from "@/components/ui/BaseLabel.vue";
import Pagination from "@/components/pagination/Pagination.vue";
import ConfirmDelete from "@/components/logout/ConfirmDelete.vue";
import { supabase } from "@/supabase";
const route = useRoute();
const id = route.params.id;
const menuName = route.params.name;
const categoryId = route.params.categoryId;
const categoryName = route.params.categoryName;

const previewImage = ref(null);
const items = ref([]);
const showModal = ref(false);
const loading = ref(true);
const isEditing = ref(false);
const showDeleteConfirmation = ref(false);
const itemToDelete = ref(null);
const deleteMessage = ref("");

const newItems = ref({
  id: null,
  name: "",
  description: "Delicious dishes made with fresh ingredients.",
  active: "active",
  price: "185",
  discount: "7",
  rating: "4.6",
  offers: "No Available Offer",
  image: null,
});

const truncateText = (text, limit = 5) => {
  if (!text) return text;
  
  const words = text.split(" ");
  
  if (words.length <= limit) {
    return text;
  }
  
  return words.slice(0, limit).join(" ") + "...";
};

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
  if (typeof number !== "number" && typeof number !== "string") return []; // Ensure input is a number or string
  const numberString = number.toString(); // Convert number to a string if it's a number
  const words = numberString.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += 5) {
    chunks.push(words.slice(i, i + 5).join(" "));
  }
  return chunks;
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

const modalRef = ref(null);

onMounted(() => {
  if (modalRef.value) {
    modalRef.value.focus();
  }
});

// Pagination logic
const itemsPerPage = 5;
const currentPage = ref(1);
// const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage));
const itemToShow = computed(() =>
  items.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  )
);

//Open Model
const openModal = () => {
  isEditing.value = false;
  resetitems();
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  if (newItems.value.image && newItems.value.image instanceof Object) {
    URL.revokeObjectURL(newItems.value.image);
  }
  showModal.value = false;
};

// Reset category data
const resetitems = () => {
  newItems.value = {
    id: null,
    name: "",
    description: "",
    active: "",
    price: "",
    discount: "",
    rating: "",
    offers: "",
    image: null,
  };
};

// Handle image upload
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newItems.value.image = file;
  }
};

// Edit category
const editItem = (row) => {
  isEditing.value = true;
  newItems.value = { ...row };
  showModal.value = true;
};

// Remove category
const removeItem = (id) => {
  itemToDelete.value = id; // Set the category ID
  deleteMessage.value = "Are you sure you want to delete this item?";
  showDeleteConfirmation.value = true; // Show confirmation modal
};

onMounted(async () => {
  await fetchItem();
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

// Fetch categories on component mount
onMounted(fetchItem);

// Table columns
const columns = [
  {
    header: "",
    render: (row) => row.move,
  },
  { header: "Item Name", render: (row) => row.name },
  { header: "Description", render: (row) => truncateText(row.description) },
  {
    header: "Status",
    render: (row) => (row.active === "active" ? "Active" : "Inactive"),
  },
  {
    header: "Price",
    render: (row) => {
      return `${row.category?.menus?.currency || "₹"} ${row.price || 0}`;
    },
  },

  { header: "Discount", render: (row) => row.discount + "%" },
  { header: "Rating", render: (row) => row.rating + " / 5" },
  { header: "Offers", render: (row) => truncateText(row.offers) },
  {
    header: "Image",
    render: (row) =>
      row.image
        ? `<img src="${row.image}" alt="${row.name}" class="w-16 h-16 object-cover rounded-md" />`
        : "No Image",
  },
  { header: "", render: () => {}, actions: true },
];

//  Move item Up
const moveUp = async (row) => {
  const index = items.value.findIndex((item) => item.id === row.id);
  if (index === -1 || index === 0) return;

  const temp = items.value[index - 1];
  items.value[index - 1] = items.value[index];
  items.value[index] = temp;

  await updateItemOrder(items.value[index].id, index);
  await updateItemOrder(items.value[index - 1].id, index - 1);
};

//  Move item Down
const moveDown = async (row) => {
  const index = items.value.findIndex((item) => item.id === row.id);
  if (index === -1 || index === items.value.length - 1) return;

  const temp = items.value[index + 1];
  items.value[index + 1] = items.value[index];
  items.value[index] = temp;

  await updateItemOrder(items.value[index].id, index);
  await updateItemOrder(items.value[index + 1].id, index + 1);
};

//  Update item Order in Database
const updateItemOrder = async (id, position) => {
  const { error } = await supabase
    .from("items")
    .update({ position })
    .eq("id", id);

  if (error) {
    console.error(
      `Failed to update category ${id} to position ${position}:`,
      error
    );
  }
};

fetchItem();

// Fetch categories based on the category_id
async function fetchItem() {
  const { data, error } = await supabase
    .from("items")
    .select("*,category:category_id(menus:menu_id!inner(currency))")
    .eq("category_id", categoryId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching item:", error);
  } else {
    items.value = data;
    loading.value = false;
  }
}

// Save or update category
const saveItem = async () => {
  if (!newItems.value.name) return alert("Item name is required!");
  if (!newItems.value.image && !newItems.value.id)
    return alert("Item image is required!");
  if (newItems.value.active === null) return alert("Item status is required!");

  let imageUrl = newItems.value.image;

  // Upload image if it's a new file
  if (newItems.value.image instanceof File) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("item-images")
      .upload(
        `items/${Date.now()}_${newItems.value.image.name}`,
        newItems.value.image
      );

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return alert("Image upload failed!");
    }

    imageUrl = supabase.storage
      .from("item-images")
      .getPublicUrl(uploadData.path).data.publicUrl;
  }

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("category_id", id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = data ? (data.position || 0) + 1 : 1;

  const itemData = {
    category_id: categoryId,
    name: newItems.value.name,
    description: newItems.value.description || null,
    price: newItems.value.price || 0,
    active: newItems.value.active,
    discount: newItems.value.discount || 0,
    offers: newItems.value.offers || 0,
    rating: newItems.value.rating || 0,
    image: imageUrl,
    position: newPosition,
  };

  if (newItems.value.id) {
    const { error: updateError } = await supabase
      .from("items")
      .update(itemData)
      .eq("id", newItems.value.id);

    if (updateError) {
      console.error("Error updating item", updateError);
      return alert("Failed to update item!");
    }

    alert("Item updated successfully!");
  } else {
    const { error: insertError } = await supabase
      .from("items")
      .insert([itemData]);

    if (insertError) {
      console.error("Insert Error:", insertError);
      return alert(`Failed to save item! ${insertError.message}`);
    }

    alert("Item saved successfully!");
  }

  fetchItem();
  closeModal();
};

const confirmDelete = async () => {
  if (!itemToDelete.value) {
    console.error("No Item selected for deletion.");
    return;
  }

  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", itemToDelete.value);

  if (error) {
    console.error("Error removing item:", error);
    return alert("Failed to remove item!");
  }

  // Refresh the category list
  fetchItem();

  // Reset values
  itemToDelete.value = null;
  showDeleteConfirmation.value = false;
};

const closeDeleteConfirmation = () => {
  itemToDelete.value = null;
  showDeleteConfirmation.value = false;
};
</script>


<style scoped>
</style>
