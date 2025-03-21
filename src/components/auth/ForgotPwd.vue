<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-gray-100">
    <div
      class="flex items-center justify-center w-full md:w-1/2 p-6 md:p-12 lg:p-20"
    >
      <form
        @submit.prevent="onSubmit"
        class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
      >
        <h1
          class="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8 p-5"
        >
          Password Recovery
        </h1>
        <p class="text-center mb-6 text-sm text-gray-600">
          Enter your registered email address. We'll send you a link or code to
          reset your password.
        </p>

        <FormField label="Email Address" :error="errors.email">
          <BaseInput
            v-model="email"
            type="email"
            placeholder="Enter your Email"
            autocomplete="email"
            class="w-full"
          />
        </FormField>

        <BaseButton
          label="Reset Password"
          type="submit"
          intent="default"
          class="w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
        >
        </BaseButton>

        <div class="mt-4 text-center">
          <span class="text-sm text-gray-600">Remembered your password?</span>
          <router-link to="/login" class="text-blue-600 hover:underline ml-2">
            Login
          </router-link>
        </div>
      </form>
    </div>

    <div class="hidden md:block w-1/2 rounded-3xl">
      <img
        src="@/assets/loginfood2.jpg"
        alt="Background"
        class="w-full h-screen object-cover"
      />
    </div>
  </div>
</template>
    
  <script setup>
import { useForm } from "vee-validate";
import * as yup from "yup";
import { supabase } from "@/supabase";
import BaseInput from "../ui/BaseInput.vue";
import FormField from "../forms/FormField.vue";
import BaseButton from "../ui/BaseButton.vue";

const validationSchema = yup.object({
  email: yup
    .string()
    .required("Email is Required")
    .email("Invalid email format"),
});

const { handleSubmit, errors, defineField } = useForm({
  validationSchema,
});

const [email] = defineField("email");

const onSubmit = handleSubmit(async (values) => {
  try {
    const { error: ResetError } = await supabase.auth.resetPasswordForEmail(
      values.email,
      {
        emailRedirectTo: "http://localhost:5173/resetform",
      }
    );

    if (ResetError) throw ResetError;
    alert("Password reset email sent! Please check your inbox.");
  } catch (error) {
    alert(error.error_description || error.message);
  }
});
</script>
    
  <style scoped>
h1
 {
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
  