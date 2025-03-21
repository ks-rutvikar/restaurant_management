<template>
  <button :class="buttonClass" @click="$emit('click')">
    {{ label }}
  </button>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  label: {
    type: String,
    default: "",
  },
  intent: {
    type: String,
    default: "primary",
  },
});

defineEmits(["click"]);

const buttonClass = computed(() => {
  const { intent, disabled } = props;

  let baseClasses =
    "transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none";

  let intentClass = "";
  switch (intent) {
    case "primary":
      intentClass =
        "py-2.5 px-5 me-2 mb-2 text-md font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";
      break;
    case "warning":
      intentClass =
        "focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900";
      break;
    case "danger":
      intentClass =
        "focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 transform transition duration-300 ease-in-out hover:scale-105";
      break;
    case "inverse":
      intentClass =
        "text-gray-900 bg-gray-200 border border-gray-300 focus:outline-none hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transform transition duration-300 ease-in-out hover:scale-105" ;
      break;
    case "success":
      intentClass =
        "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-md px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transform transition duration-300 ease-in-out hover:scale-105";
      break;
    case "purple":
      intentClass =
        "focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-md px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900";
      break;
    case "default":
    default:
      intentClass =
        "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-bold rounded-lg text-md px-4 py-2 mb-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transform transition duration-300 ease-in-out hover:scale-105";
      break;
  }

  const disabledClass = disabled
    ? "mb-6 text-sm rounded-lg block p-2.5 cursor-not-allowed"
    : "";

  const combinedClass = `${baseClasses} ${intentClass} ${disabledClass} || ""
  }`;

  return combinedClass;
});
</script>
