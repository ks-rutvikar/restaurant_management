<template>
  <div
    class="p-8 pt-43 bg-gray-100 min-h-screen flex flex-col justify-start items-center"
  >
    <div class="justify-start w-full">
      <h2 class="text-3xl font-bold mb-4 pl-1 text-black-700">Category</h2>

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
        </nav>
      </div>
    </div>

    <div
      class="absolute top-43 right-8 pr-4 pl-3 flex items-center cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300"
      @click="openModal"
    >
      <font-awesome-icon icon="plus" class="text-lg" />
      <span class="text-l font-semibold ml-1">Add New Category</span>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center text-gray-700 mt-6">
      <p class="text-lg">Loading Category details...</p>
    </div>

    <!-- No Menu Available -->
    <div
      v-else-if="categoryToShow.length === 0"
      class="text-center text-gray-700 mt-6"
    >
      <p class="text-lg">
        No category available. Click "Add New Category" to create one.
      </p>
    </div>

    <!-- Category Table -->
    <div
      v-else
      class="bg-white shadow-lg rounded-md overflow-hidden pt-4 mt-5 w-full lg:max-w-8xl"
    >
      <div class="overflow-x-auto">
        <BaseTable :data="categoryToShow" :columns="columns">
          <template #actions="{ row }">
            <div class="flex items-center space-x-8">
              <font-awesome-icon
                icon="eye"
                @click="viewCategory(row)"
                class="text-xl hover:text-gray-600 text-blue-800 cursor-pointer"
              />
              <font-awesome-icon
                icon="pen-to-square"
                @click="editCategory(row)"
                class="text-xl hover:text-gray-600 text-black-500 cursor-pointer"
              />
              <font-awesome-icon
                icon="trash"
                @click="removeCategory(row.id)"
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
      :totalItems="categories.length"
      :itemsPerPage="5"
      v-model:currentPage="currentPage"
      :loading="loading"
    />

    <!-- Add / Edit Category Modal -->
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
          {{ isEditing ? "Edit Category" : "Add Category" }}
        </h3>
        <BaseLabel label="Category Name" />
        <BaseInput
          v-model="newCategory.name"
          :value="splitText(newCategory.name).join('\n')"
          placeholder="Enter category name..."
        />

        <BaseLabel label="Description" />
        <BaseInput
          v-model="newCategory.description"
          :value="splitText(newCategory.description).join('\n')"
          placeholder="Enter description..."
          class=""
        />
        <BaseLabel label="Status" />

        <BaseSelect
          v-model="newCategory.active"
          :value="splitText(newCategory.active).join('\n')"
          :options="statusOptions"
          placeholder="Select Status"
          class="w-full p-3 border border-gray-300 rounded-md"
        />
        <BaseLabel label="Discount (%)" />
        <BaseInput
          v-model="newCategory.discount"
          :value="splitNumber(newCategory.discount).join('\n')"
          type="number"
          placeholder="Enter discount..."
          class=""
        />
        <BaseLabel label="Offers" />
        <BaseInput
          v-model="newCategory.offers"
          :value="splitText(newCategory.offers).join('\n')"
          placeholder="Enter offers..."
          class=""
        />
        <BaseLabel label="Rating" />
        <BaseInput
          v-model="newCategory.rating"
          :value="splitNumber(newCategory.rating).join('\n')"
          type="number"
          placeholder="Enter rating..."
          min="1"
          max="5"
          step="0.1"
          class="mb-1"
        />
        <div class="mb-5">
          <BaseLabel
            label="Category Image"
            class="block text-sm font-medium text-black-700 pl-1"
          />
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
            @click="saveCategory"
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
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import BaseTable from "@/components/ui/BaseTable.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseLabel from "@/components/ui/BaseLabel.vue";
import BaseSelect from "@/components/ui/BaseSelect.vue";
import ConfirmDelete from "@/components/logout/ConfirmDelete.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import Pagination from "@/components/pagination/Pagination.vue";
import { supabase } from "@/supabase";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
const route = useRoute();
const router = useRouter();
const id = route.params.id;
const menuName = route.params.name;

const categories = ref([]);
const loading = ref(true);
const showModal = ref(false);
const showDeleteConfirmation = ref(false);
const isEditing = ref(false);
const deleteMessage = ref("");


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

const newCategory = ref({
  id: null,
  name: "",
  description: "Delicious dishes made with fresh ingredients.",
  active: "active",
  discount: "8",
  rating: "4.8",
  offers: "No Available Offer",
  image: null,
});

const currentPage = ref(1);
const itemsPerPage = 5;

// Compute categories to show on current page
const categoryToShow = computed(() =>
  categories.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  )
);

const categoryToDelete = ref(null);

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

onMounted(async () => {
  await fetchCategory(); // Fetch data
  setTimeout(() => {
    loading.value = false; // Hide loading after 3 seconds
  }, 1000);
});

onMounted(fetchCategory);

// Table columns
const columns = [
  {
    header: "",
    render: (row) => row.move,
  },

  { header: "Category Name", render: (row) => row.name },
  { header: "Description", render: (row) => truncateText(row.description) },
  {
    header: "Status",
    render: (row) => (row.active === "active" ? "Active" : "Inactive"),
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

// Open modal for new category
const openModal = () => {
  isEditing.value = false;
  resetCategory();
  showModal.value = true;
};

// Close modal
const closeModal = () => {
  if (newCategory.value.image && newCategory.value.image instanceof Object) {
    URL.revokeObjectURL(newCategory.value.image);
  }
  showModal.value = false;
};

// Reset category data
const resetCategory = () => {
  newCategory.value = {
    id: null,
    name: "",
    description: "",
    active: "",
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
    newCategory.value.image = file;
  }
};

const viewCategory = (row) => {
  router.push({
    name: "categoryitempage",
    params: {
      id,
      name: menuName,
      categoryId: row.id,
      categoryName: row.name, // Pass the category name
    },
  });
};

//  Move Category Up
const moveUp = async (row) => {
  const index = categories.value.findIndex((item) => item.id === row.id);
  if (index === -1 || index === 0) return;

  const temp = categories.value[index - 1];
  categories.value[index - 1] = categories.value[index];
  categories.value[index] = temp;

  await updateCategoryOrder(categories.value[index].id, index);
  await updateCategoryOrder(categories.value[index - 1].id, index - 1);
};

//  Move Category Down
const moveDown = async (row) => {
  const index = categories.value.findIndex((item) => item.id === row.id);
  if (index === -1 || index === categories.value.length - 1) return;

  const temp = categories.value[index + 1];
  categories.value[index + 1] = categories.value[index];
  categories.value[index] = temp;

  await updateCategoryOrder(categories.value[index].id, index);
  await updateCategoryOrder(categories.value[index + 1].id, index + 1);
};

//  Update Category Order in Database
const updateCategoryOrder = async (id, position) => {
  const { error } = await supabase
    .from("category")
    .update({ position })
    .eq("id", id);

  if (error) {
    console.error(
      `Failed to update category ${id} to position ${position}:`,
      error
    );
  }
};

fetchCategory();

//  Fetch Categories from Supabase
async function fetchCategory() {
  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("menu_id", id)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching category:", error);
  } else {
    categories.value = data || []; // Ensures categories is never undefined
    loading.value = false;
  }
}

// Save or update category
const saveCategory = async () => {
  if (!newCategory.value.name) return alert("Category name is required!");
  if (!newCategory.value.image && !newCategory.value.id)
    return alert("Category image is required!");
  if (newCategory.value.active === null)
    return alert("Category status is required!");

  let imageUrl = newCategory.value.image;

  // Upload image if it's a new file
  if (newCategory.value.image instanceof File) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("category-images")
      .upload(
        `category/${Date.now()}_${newCategory.value.image.name}`,
        newCategory.value.image
      );

    if (uploadError) {
      console.error("Image upload failed:", uploadError);
      return alert("Image upload failed!");
    }

    imageUrl = supabase.storage
      .from("category-images")
      .getPublicUrl(uploadData.path).data.publicUrl;
  }

  const { data, error } = await supabase
    .from("category")
    .select("*")
    .eq("menu_id", id)
    .order("position", { ascending: false })
    .limit(1)
    .single();

  const newPosition = data ? (data.position || 0) + 1 : 1;

  const categoryData = {
    menu_id: id, // Add this line
    name: newCategory.value.name,
    description: newCategory.value.description,
    active: newCategory.value.active,
    discount: newCategory.value.discount || 0,
    offers: newCategory.value.offers || 0,
    rating: newCategory.value.rating || 0,
    position: newPosition,
    image: imageUrl,
  };

  if (newCategory.value.id) {
    const { error: updateError } = await supabase
      .from("category")
      .update(categoryData)
      .eq("id", newCategory.value.id);

    if (updateError) {
      console.error("Error updating category:", updateError);
      return alert("Failed to update category!");
    }

    alert("Category updated successfully!");
  } else {
    const { error: insertError } = await supabase
      .from("category")
      .insert([categoryData]);

    if (insertError) {
      console.error("Insert Error:", insertError);
      return alert(`Failed to save category! ${insertError.message}`);
    }

    alert("Category saved successfully!");
  }

  fetchCategory();
  closeModal();
};

// Edit category
const editCategory = (row) => {
  isEditing.value = true;
  newCategory.value = { ...row };
  showModal.value = true;
};

// Remove category
const removeCategory = (id) => {
  categoryToDelete.value = id; // Set the category ID
  deleteMessage.value = "Are you sure you want to delete this category?";
  showDeleteConfirmation.value = true; // Show confirmation modal
};

const confirmDelete = async () => {
  if (!categoryToDelete.value) {
    console.error("No category selected for deletion.");
    return;
  }

  const { error } = await supabase
    .from("category")
    .delete()
    .eq("id", categoryToDelete.value);

  if (error) {
    console.error("Error removing category:", error);
    return alert("Failed to remove category!");
  }

  // Refresh the category list
  fetchCategory();

  // Reset values
  categoryToDelete.value = null;
  showDeleteConfirmation.value = false;
};

const closeDeleteConfirmation = () => {
  showDeleteConfirmation.value = false;
  categoryToDelete.value = null;
};
</script>

<style>
/* Style for table cells that contain the BaseInput */
.table-cell {
  display: block;
  width: 200px; /* You can adjust the width based on your layout */
  white-space: normal; /* Allow wrapping of words */
  word-wrap: break-word; /* Handle breaking long words */
  max-width: 100%; /* Ensure it doesn't exceed the container's width */
}

/* Limit the number of words to 5 per line */
.table-cell input {
  display: inline-block;
  max-width: 100%;
  word-break: break-word; /* Allow words to break */
  white-space: normal;
  overflow-wrap: break-word; /* Breaks the words into the next line */
}

/* Optional: Limit the height of the cell if desired */
.table-cell {
  max-height: 5rem; /* Adjust based on the expected size of the content */
  overflow: hidden;
}
</style>

