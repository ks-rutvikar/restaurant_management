<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gray-100">
    <div
      class="flex items-center justify-center w-full md:w-1/2 p-6 md:p-12 lg:p-20"
    >
      <form
        @submit.prevent="onSubmit"
        class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h1 class="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8 p-5">
          Sign-Up
        </h1>

        <FormField label="Name" :error="errors.name">
          <BaseInput
            v-model="name"
            placeholder="Enter your Name"
            class="w-full"
          />
        </FormField>
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
        <FormField label="Confirm Password" :error="errors.confirmpassword">
          <div class="relative">
            <BaseInput
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Enter your confirm password"
              autocomplete="new-password"
              class="w-full"
            />
            <button
              type="button"
              class="absolute inset-y-0 right-0 pr-6 flex items-center"
              @click="toggleConfirmPassword"
            >
              <EyeIcon
                v-if="showConfirmPassword"
                class="h-5 w-5 text-gray-500"
              />
              <EyeSlashIcon v-else class="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </FormField>
        <BaseButton
          label="Signup"
          type="submit"
          intent="default"
          class="w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
        </BaseButton>
        <div class="mt-4 text-center">
          <span> Already have an account?</span>
          <router-link to="/login" class="text-blue-600 hover:underline ml-2">
            Login
          </router-link>
        </div>
      </form>
    </div>
    <div class="hidden md:block w-1/2 rounded-3xl">
      <img
        src="/src/assets/loginfood1.jpg"
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
import { useForm, useField } from "vee-validate";
import { supabase } from "@/supabase";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

const router = useRouter();

const validationSchema = yup.object({
  name: yup
    .string()
    .min(4, "At least 4 characters long")
    .required("Name is Required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is Required"),
  password: yup
    .string()
    .min(8, "At least 8 characters long")
    .matches(/[a-zA-Z]/, "Contain at least one letter.")
    .matches(/[0-9]/, "Contain at least one number.")
    .matches(/[^a-zA-Z0-9]/, "Contain at least one special character.")
    .required("Password is required"),
  confirmpassword: yup
    .string()
    .min(8, "At least 8 characters long")
    .oneOf([yup.ref("password"), null], "Passwords don't match")
    .required("Confirm password is required"),
});

const { handleSubmit, errors } = useForm({
  validationSchema,
});

const { value: name, errorMessage: nameError } = useField("name");
const { value: email, errorMessage: emailError } = useField("email");
const { value: password, errorMessage: passwordError } = useField("password");
const { value: confirmPassword, errorMessage: confirmPasswordError } =
  useField("confirmpassword");

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    const { error: signupError } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: "http://localhost:5173/login",
      },
    });

    if (signupError) throw signupError;
    router.push("/login");
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