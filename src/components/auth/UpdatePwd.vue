<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
    >
      <input
        type="text"
        name="username"
        id="username"
        class="hidden"
        aria-hidden="true"
        autocomplete="username"
      />

      <h1
        class="text-2xl md:text-3xl font-semibold text-center mb-6 md:mb-8 p-5"
      >
        Update Your Password
      </h1>

      <FormField label="New Password" :error="errors.newPassword">
        <div class="relative">
          <BaseInput
            v-model="newPassword"
            :type="showNewPassword ? 'text' : 'password'"
            placeholder="Enter your New Password"
            autocomplete="new-password"
            class="w-full"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-6 flex items-center"
            @click="toggleNewPassword"
          >
            <EyeIcon v-if="showNewPassword" class="h-5 w-5 text-gray-500" />
            <EyeSlashIcon v-else class="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </FormField>

      <FormField label="Confirm New Password" :error="errors.confirmPassword">
        <div class="relative">
          <BaseInput
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            placeholder="Confirm your New Password"
            autocomplete="new-password"
            class="w-full"
          />
          <button
            type="button"
            class="absolute inset-y-0 right-0 pr-6 flex items-center"
            @click="toggleConfirmPassword"
          >
            <EyeIcon v-if="showConfirmPassword" class="h-5 w-5 text-gray-500" />
            <EyeSlashIcon v-else class="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </FormField>

      <BaseButton
        label="Update Password"
        type="submit"
        intent="default"
        class="w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      ></BaseButton>

      <div class="mt-4 text-center">
        <router-link to="/menu" class="text-blue-600 hover:underline">
          Back to Menu
        </router-link>
      </div>
    </form>
  </div>
</template>
  
  
  <script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import * as yup from "yup";
import { useForm } from "vee-validate";
import { supabase } from "@/supabase"; 
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";
import BaseInput from "../ui/BaseInput.vue";
import BaseButton from "../ui/BaseButton.vue";
import FormField from "../forms/FormField.vue";

const router = useRouter();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: yup.object({
    newPassword: yup
      .string()
      .required("New Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match")
      .required("Confirm New Password is required"),
  }),
});

const [newPassword] = defineField("newPassword");
const [confirmPassword] = defineField("confirmPassword");

const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

const onSubmit = handleSubmit(async (values) => {
  try {
    await supabase.auth.getSession();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("User not authenticated. Please log in again.");
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: values.newPassword,
    });

    if (updateError) throw updateError;

    alert("Password updated successfully! Please log in again.");
    await supabase.auth.signOut(); 
    router.push("/login");
  } catch (error) {
    alert(error.message || "An error occurred while updating the password.");
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
</style>
  