<template>
  <div class="overflow-x-auto">
    <table
      class="min-w-full bg-white border border-gray-300 shadow-md rounded-lg table-auto"
    >
      <thead class="bg-blue-100 text-gray-700">
        <tr>
          <th
            v-if="hasmove"
            class="px-6 py-3 text-left text-s font-semibold uppercase tracking-wider border-b"
          ></th>
          <th
            v-for="(col, index) in columns"
            :key="index"
            class="px-6 py-3 text-left text-s font-semibold uppercase tracking-wider border-b"
          >
            {{ col.header }}
          </th>
          <th
            v-if="hasActions"
            class="px-6 py-3 text-left text-s font-semibold uppercase tracking-wider border-b"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!data || data.length === 0">
          <td
            :colspan="columns.length + (hasActions ? 1 : 0)"
            class="px-6 py-3 text-center text-gray-500"
          >
            No Data Found
          </td>
        </tr>
        <tr
          v-for="(row, rowIndex) in data"
          :key="rowIndex"
          class="hover:bg-gray-50 transition duration-200 ease-in-out even:bg-gray-50"
        >
          <td
            v-if="hasmove"
            class="px-6 py-4 whitespace-nowrap text-m font-medium border-b"
          >
            <slot name="move" :row="row"></slot>
          </td>
          <td
            v-for="(col, colIndex) in columns"
            :key="colIndex"
            class="px-6 py-4 whitespace-nowrap text-m font-medium text-gray-900 border-b"
          >
            <!-- Check if the column is the 'Image' column -->
            <template v-if="col.header === 'Image'">
              <img
                v-if="row.image"
                :src="row.image"
                alt="Menu Image"
                class="w-16 h-16 object-cover rounded-md"
              />
              <span v-else>No Image</span>
            </template>
            <template v-else>
              {{ col.render(row) }}
            </template>
          </td>
          <td
            v-if="hasActions"
            class="px-6 py-4 whitespace-nowrap text-m font-medium border-b"
          >
            <slot name="actions" :row="row"></slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
    required: true,
  },
  columns: {
    type: Array,
    default: () => [],
    required: true,
  },
});

const hasActions = props.columns.some((col) => col.actions);
const hasmove = props.columns.some((col) => col.actions);
</script>

<style scoped>
/* Optional: Customize further if needed */
</style>
