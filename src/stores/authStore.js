import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = ref(localStorage.getItem("auth") === "true");

  const login = () => {
    isAuthenticated.value = true;
    localStorage.setItem("auth", "true");
  };

  const logout = () => {
    isAuthenticated.value = false;
    localStorage.removeItem("auth");
  };

  return { isAuthenticated, login, logout };
});
