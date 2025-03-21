<template>
  <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 shadow-md transition-all duration-300 p-2.5">
    <div class="max-w-screen-3xl flex flex-wrap items-center justify-between mx-auto p-4">
      <router-link to="/about" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">BiteBliss</span>
      </router-link>

      <div class="flex items-center space-x-6">
        <router-link to="/home" class="text-m text-black hover:text-blue-700 dark:text-gray-400 dark:hover:text-white transition duration-300 font-bold">Home</router-link>
        <router-link to="/about" class="text-m font-bold text-black hover:text-blue-700 dark:text-gray-400 dark:hover:text-white transition duration-300">About</router-link>
        <router-link to="/contact" class="text-m font-bold text-black hover:text-blue-700 dark:text-gray-400 dark:hover:text-white transition duration-300">Contact</router-link>

        <div v-if="auth.isAuthenticated" class="relative flex">
          <BaseButton label="My Profile" intent="default" @click="toggleDropdown" class="w-42" />
          <div v-if="dropdownVisible" class="absolute right-0 mt-2 w-42 top-11 bg-white shadow-lg !rounded-none z-10">
            <ul>
              <li @click="goToUserProfile" class="px-4 py-2 hover:bg-gray-200 cursor-pointer">User Profile</li>
              <li @click="goToMenuManagement" class="px-4 py-2 hover:bg-gray-200 cursor-pointer">Menu Management</li>
              <li @click="showLogoutConfirmation" class="px-4 py-2 bg-blue-700 cursor-pointer hover:bg-red-400 text-white">Logout</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Hamburger -->
      <button @click="toggleMobileMenu" class="md:hidden text-gray-600 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="h-6 w-6">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    <div v-if="mobileMenuVisible" class="md:hidden bg-white dark:bg-gray-900 shadow-md w-full">
      <router-link to="/home" class="block text-sm font-medium text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-white transition duration-300 p-4">Home</router-link>
      <router-link to="/about" class="block text-sm font-medium text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-white transition duration-300 p-4">About</router-link>
      <router-link to="/contact" class="block text-sm font-medium text-gray-600 hover:text-blue-700 dark:text-gray-400 dark:hover:text-white transition duration-300 p-4">Contact</router-link>

    </div>
  </nav>

  <Logout :isVisible="isLogoutVisible" :onCancel="cancelLogout" :onConfirm="confirmLogout" />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "../ui/BaseButton.vue";
import Logout from "../logout/Logout.vue";
import { useAuthStore } from "@/stores/authStore";

const router = useRouter();
const auth = useAuthStore();

const dropdownVisible = ref(false);
const isLogoutVisible = ref(false);
const mobileMenuVisible = ref(false);

const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value;
};

const goToUserProfile = () => {
  router.push("/profile");
  dropdownVisible.value = false;
};

const goToMenuManagement = () => {
  router.push("/menu");
  dropdownVisible.value = false;
};

const showLogoutConfirmation = () => {
  isLogoutVisible.value = true;
  dropdownVisible.value = false;
};

const cancelLogout = () => {
  isLogoutVisible.value = false;
};

const confirmLogout = () => {
  auth.logout();
  console.log("Logging out...");
  router.push("/login");
  isLogoutVisible.value = false;
};

const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value;
};
</script>

<style scoped>
nav:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 8px 16px;
}

/* Mobile Menu Styles */
@media (max-width: 768px) {
  /* Make the menu visible on smaller devices */
  .md\:hidden {
    display: block !important;
  }

  .md\:order-2 {
    order: 1;
  }

  /* Ensure the mobile dropdown menu is fully visible when toggled */
  .md\:hidden + div {
    display: block;
  }

  /* Adjust logo size for small screens */
  .h-8 {
    height: 40px;
  }

  /* Make the profile button full width on small screens */
  .w-42 {
    width: 100%;
  }
}

@media (max-width: 640px) {
  /* Mobile-friendly padding */
  .p-4 {
    padding: 16px;
  }

  /* Ensure mobile menu uses full screen width */
  .w-full {
    width: 100%;
  }

  /* Adjust hamburger menu for very small screens (iPhone SE) */
  button {
    width: 100%;
  }
}

@media (max-width: 375px) {
  /* Small screen adjustments for devices like iPhone SE */
  .h-8 {
    height: 35px; /* Smaller logo for smaller screens */
  }
}
</style>
