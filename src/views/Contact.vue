<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
    >
      <div class="relative">
        <h1 class="text-3xl font-semibold text-center mb-8">Contact Us</h1>

        <!-- X mark icon at the top-right corner -->
        <font-awesome-icon
          icon="xmark"
          class="text-2xl hover:text-red-600 text-black cursor-pointer absolute top-[-3vh] right-[-3vh] border-2 border-black px-2 py-1 mt-0 rounded-md"
          @click="goBack"
        />
      </div>

      <!-- Name Field -->
      <FormField label="Name" :error="errors.name">
        <BaseInput
          v-model="name"
          placeholder="Enter your Name"
          class="w-full p-3 border border-gray-300 rounded-md"
        />
      </FormField>

      <!-- Email Field -->
      <FormField label="Email" :error="errors.email">
        <BaseInput
          v-model="email"
          type="email"
          placeholder="Enter your Email"
          autocomplete="email"
          class="w-full p-3 border border-gray-300 rounded-md"
        />
      </FormField>

      <!-- Message Field -->
      <FormField label="Message" :error="errors.message">
        <textarea
          v-model="message"
          placeholder="Enter your message"
          class="w-full p-3 border border-gray-300 rounded-md"
          rows="5"
        ></textarea>
      </FormField>

      <!-- Submit Button -->
      <BaseButton
        label="Send Message"
        type="submit"
        intent="default"
        class="w-full py-3 mt-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      />

      <!-- Success/Error Message -->
      <div v-if="successMessage" class="mt-4 text-center text-green-600">
        <p>{{ successMessage }}</p>
      </div>
      <div v-if="errorMessage" class="mt-4 text-center text-red-600">
        <p>{{ errorMessage }}</p>
      </div>
    </form>
  </div>
</template>
  
  <script setup>
import * as yup from "yup";
import FormField from "@/components/forms/FormField.vue";
import BaseInput from "@/components/ui/BaseInput.vue";
import BaseButton from "@/components/ui/BaseButton.vue";
import { useForm, useField } from "vee-validate";
import { ref } from "vue";
import { supabase } from "@/supabase";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  message: yup
    .string()
    .min(10, "Message must be at least 10 characters")
    .required("Message is required"),
});

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
});

const { value: name } = useField("name");
const { value: email } = useField("email");
const { value: message } = useField("message");

const successMessage = ref(null);
const errorMessage = ref(null);

const onSubmit = handleSubmit(async (values, { resetForm }) => {
  try {
    const { error } = await supabase.from("contacts").insert([
      {
        name: values.name,
        email: values.email,
        message: values.message,
      },
    ]);

    if (error) throw error;

    successMessage.value = "Your message has been sent successfully!";
    errorMessage.value = null;

    resetForm();
  } catch (error) {
    successMessage.value = null;
    errorMessage.value =
      error.message || "An error occurred, please try again later.";
  }
});

const goBack = () => window.history.back();
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
  