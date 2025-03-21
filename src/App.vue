<script setup>
import { useAuthStore } from "@/stores/authStore";
import { useRoute } from "vue-router";
import NavBar from "@/components/navbar/NavBar.vue";
// import Footer from "@/components/footer/Footer.vue";

const authStore = useAuthStore();
const route = useRoute();
</script>

<template>
  <div id="app">
    <header v-if="authStore.isAuthenticated && route.name !== 'menudisplay'">
      <nav>
        <NavBar />
      </nav>
    </header>

    <router-view />

    <!-- <Footer v-if="authStore.isAuthenticated && route.name !== 'menudisplay'" /> -->
  </div>
</template>
