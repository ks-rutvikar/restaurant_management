<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gray-100">
    <!-- Left side: Login Form -->
    <div class="flex items-center justify-center w-full md:w-1/2 p-6 md:p-12 lg:p-20">
      <form
        @submit.prevent="onSubmit"
        class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 class="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8 p-5">
          Welcome to BiteBliss!!
        </h1>
        <FormField label="Email" :error="errors.email">
          <BaseInput
            v-model="email"
            type="email"
            placeholder="Enter your Email"
            autocomplete="email"
            class="w-full"
          />
        </FormField>
        <FormField label="Password" :error="errors.password">
          <div class="relative">
            <BaseInput
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your Password"
              autocomplete="current-password"
              class="w-full"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-6 flex items-center"
              @click="togglePassword"
            >
              <EyeIcon v-if="showPassword" class="h-5 w-5 text-gray-500" />
              <EyeSlashIcon v-else class="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </FormField>
        <BaseButton
          label="Login"
          type="submit"
          intent="default"
          class="w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
        </BaseButton>
        <div class="mt-4 text-center">
          <span>Don't have an account?</span>
          <router-link to="/signup" class="text-blue-600 hover:underline ml-2"
            >SignUp</router-link
          >
        </div>
        <div class="mt-2 text-center">
          <router-link to="/resetform" class="text-sm text-blue-600 hover:underline"
            >Forgot password?</router-link
          >
        </div>
      </form>
    </div>

    <!-- Right side: Background Image -->
    <div class="hidden md:block w-1/2 rounded-3xl">
      <img
        src="/src/assets/loginfood2.jpg"
        alt="Background"
        class="w-full h-screen object-cover"
      />
    </div>
  </div>
</template>

<script setup>
import * as yup from "yup";
import BaseInput from "../ui/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";
import FormField from "../forms/FormField.vue";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import { ref } from "vue";
import { useForm } from "vee-validate";
import { supabase } from "@/supabase";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();

const router = useRouter();

const { handleSubmit, errors, defineField } = useForm({
  LoginSchema: yup.object({
    email: yup
      .string()
      .required("Email is Required")
      .email("Invalid email format"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  }),
});

const [email] = defineField("email");
const [password] = defineField("password");

const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    const { error: LoginError } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (LoginError) throw LoginError;

    authStore.login(); // ✅ Updates authentication state immediately
    router.push("/menu");
  } catch (error) {
    alert(error.error_description || error.message);
  }
});
</script>

<style scoped>
h1 {
  font-family: "Times New Roman", Times, serif;
  font-weight: 600;
}

.relative {
  position: relative;
}

@media (max-width: 768px) {
  .md\:w-1-2 {
    width: 100%;
  }
  .md\:block {
    display: none;
  }
}

@media (min-width: 768px) {
  .md\:w-1-2 {
    width: 50%;
  }
  .md\:block {
    display: block;
  }
}
</style>
