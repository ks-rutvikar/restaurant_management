<template>
  <footer
    class="bg-white dark:bg-gray-900 fixed bottom-0 w-full z-20 border-t border-gray-200 dark:border-gray-600 shadow-md transition-all duration-300 p-2"
  >
    <div
      class="max-w-screen-3xl flex flex-wrap items-center justify-between mx-auto p-4"
    >
      <div class="flex items-center space-x-3 rtl:space-x-reverse">
        <span
          class="self-center text-sm font-medium text-gray-600 dark:text-gray-400"
        >
          © 2025 BiteBliss™. All Rights Reserved
        </span>
      </div>

      <!-- Additional content could go here if needed -->
    </div>
  </footer>
</template>
  
<script setup>
</script>
  
<style scoped>
footer:hover {
  box-shadow: 0 -4px 6px rgba(0, 0, 0, 0.1), 0 -1px 3px rgba(0, 0, 0, 0.08);
}

footer .text-gray-600:hover {
  text-decoration: underline;
}

/* Responsive Styles */
@media (max-width: 768px) {
  footer .flex-wrap {
    flex-direction: column;
    align-items: center;
  }

  footer .space-x-6 {
    margin-top: 10px;
  }

  footer .text-sm {
    font-size: 0.875rem; /* Small text size for mobile */
  }

  footer .w-full {
    width: 100%;
  }

  footer .sm\:w-auto {
    width: auto;
  }

  /* Optional: Increase spacing for smaller screens */
  footer .space-x-3 {
    margin-bottom: 10px;
  }
}

@media (min-width: 769px) {
  footer .flex-wrap {
    flex-direction: row;
  }

  footer .space-x-3 {
    margin-bottom: 0; /* Remove extra margin on larger screens */
  }
}
</style>


  