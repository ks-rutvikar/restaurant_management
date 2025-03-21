<template>
  <div class="relative w-full h-auto bg-gray-50 dark:bg-gray-900 py-10">
    <!-- Floating Background Images -->
    <div
      class="absolute top-0 left-0 w-24 h-24 sm:w-44 sm:h-44 md:w-64 md:h-64 opacity-90"
    >
      <img
        src="/src/assets/man.png"
        alt="Background"
        class="object-cover w-full h-full"
      />
    </div>

    <div class="relative max-w-7xl mx-auto px-6">
      <!-- Restaurant Logo and Name -->
      <div v-if="restaurant" class="text-center mb-12">
        <img
          :src="restaurant.logo || '/default-logo.png'"
          alt="Restaurant Logo"
          class="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full shadow-lg border-4 border-gray-300 dark:border-gray-600"
        />
        <h1
          class="text-4xl sm:text-5xl font-extrabold text-gray-800 dark:text-gray-100 mt-4"
        >
          {{ restaurant.name }}
        </h1>
        <div class="w-full h-1 bg-gray-200 dark:bg-gray-600 mx-auto mt-3"></div>

        <h2 class="text-6xl font-bold text-gray-500 mt-6 tracking-wide">
          MENU
        </h2>
        <div class="w-full h-1 bg-gray-200 dark:bg-gray-600 mx-auto mt-3"></div>
      </div>

      <!-- Categories Section -->
      <div v-if="categories.length" class="mt-12 space-y-10">
        <div v-for="category in categories" :key="category.name" class="w-full">
          <details
            class="group bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out open:shadow-2xl open:ring-2 open:ring-gray-400/50"
          >
            <!-- Category Title -->
            <summary
              class="cursor-pointer text-xl font-bold text-gray-900 dark:text-gray-100 flex justify-between items-center py-4 px-6 rounded-lg bg-gradient-to-r from-gray-200 to-gray-50 dark:from-gray-800 dark:to-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <span
                class="group-open:text-gray-700 dark:group-open:text-gray-300"
              >
                {{ category.name }}
              </span>
              <svg
                class="w-6 h-6 text-gray-800 dark:text-gray-300 transition-transform duration-300 group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>

            <!-- Items Grid -->
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-8 mt-6"
            >
              <div
                v-for="item in category.items"
                :key="item.name"
                class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-300 dark:border-gray-700 transition-all duration-300 transform hover:scale-[1.05] hover:shadow-2xl hover:border-gray-500"
              >
                <!-- Image Wrapper -->
                <div class="relative">
                  <!-- Status Badge -->
                  <span
                    :class="{
                      'bg-green-600 text-white border-green-700 shadow-lg':
                        item.active === 'active',
                      'bg-red-500 text-white border-red-700 shadow-lg':
                        item.active === 'inactive',
                    }"
                    class="absolute top-0 right-0 px-4 py-1.5 text-sm font-extrabold rounded-none shadow-md border transition-all duration-300 ease-in-out transform hover:scale-105"
                  >
                    {{
                      item.active === "active" ? "Available" : "Not Available"
                    }}
                  </span>

                  <!-- Item Image -->
                  <img
                    v-if="item.image"
                    :src="item.image"
                    alt="Item Image"
                    class="w-full h-60 object-cover rounded-lg mb-4 shadow-md"
                  />
                </div>

                <!-- Item Name and Price -->
                <h3
                  class="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 flex justify-between items-center border-b pb-2"
                >
                  <span class="truncate">{{ item.name }}</span>
                  <span
                    class="font-semibold text-blue-900 dark:text-gray-400 text-lg"
                  >
                    {{ currency || "USD" }}{{ item.price }}
                  </span>
                </h3>

                <!-- Item Details -->
                <div class="space-y-3 text-gray-700 dark:text-gray-300">
                  <p class="flex items-center">
                    <span class="font-semibold text-gray-900 dark:text-gray-100"
                      >Discount:</span
                    >
                    <span
                      :class="{
                        'text-green-600 bg-green-100 px-2 py-1 rounded-md':
                          item.discount > 0,
                        'text-red-600 bg-red-100 px-2 py-1 rounded-md': item.discount === 0,
                      }"
                      class="ml-2 font-medium"
                    >
                      {{ item.discount }}%
                    </span>
                  </p>

                  <p class="flex items-center">
                    <span class="font-semibold text-gray-900 dark:text-gray-100"
                      >Rating:</span
                    >
                    <span
                      :class="{
                        'text-yellow-500 font-semibold': item.rating >= 4,
                        'text-red-500 font-semibold': item.rating < 4,
                      }"
                      class="ml-2"
                    >
                      ⭐ {{ item.rating }}
                    </span>
                  </p>

                  <p class="flex items-center">
                    <span class="font-semibold text-gray-900 dark:text-gray-100"
                      >Offers:</span
                    >
                    <span
                      class="ml-2 font-semibold text-blue-600 dark:text-blue-400"
                    >
                      {{ item.offers }}
                    </span>
                  </p>

                  <p
                    class="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed mt-2 p-4 border-l-4 border-gray-500 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm"
                  >
                    {{ item.description }}
                  </p>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>

    <!-- Floating Image Right -->
    <div
      class="absolute top-0 right-0 w-24 h-24 sm:w-44 sm:h-44 md:w-64 md:h-64 opacity-90"
    >
      <img
        src="/src/assets/man1.png"
        alt="Background"
        class="object-cover w-full h-full"
      />
    </div>
  </div>
</template>
  
  
  <script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "@/supabase";

const restaurant = ref(null);
const categories = ref([]);
const menus = ref([]);
const currency = ref("USD");

const route = useRoute();
const shortId = ref(route.params.shortId);

const fetchMenuData = async () => {
  if (!shortId.value) {
    console.error("Short ID is missing in URL!");
    return;
  }

  try {
    // Fetch menu_id from the shortId
    const { data: menuMapping, error: menuMappingError } = await supabase
      .from("url")
      .select("menu_id")
      .eq("shortId", shortId.value)
      .maybeSingle();

    if (menuMappingError || !menuMapping) {
      console.error("Menu not found for given shortId:", menuMappingError);
      return;
    }

    const menuId = menuMapping.menu_id;

    // Fetch the menu details including currency
    const { data: menuDetails, error: menuError } = await supabase
      .from("menus")
      .select("currency")
      .eq("id", menuId)
      .single();

    if (menuError) {
      console.error("Error fetching menu currency:", menuError);
      return;
    }

    if (menuDetails) {
      currency.value = menuDetails.currency || "USD"; // Ensure a fallback value
    }

    // Fetch restaurant details
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { data: restaurantData, error: restaurantError } = await supabase
      .from("user_profile")
      .select("name, logo")
      .eq("id", user.id)
      .single();

    if (restaurantError) {
      console.error("Error fetching restaurant details:", restaurantError);
      return;
    }
    restaurant.value = restaurantData;

    // Fetch menu categories and items
    const { data: menuData, error: menuDataError } = await supabase
      .from("category")
      .select("*, items(*)")
      .eq("menu_id", menuId);

    if (menuDataError) {
      console.error("Error fetching menu:", menuDataError);
      return;
    }

    categories.value = menuData;
  } catch (err) {
    console.error("Error in fetchMenuData:", err);
  }
};

onMounted(() => {
  fetchMenuData();
});
</script>
  
  <style scoped>
h1 {
  font-family: "Times New Roman", Times, serif;
}
</style>