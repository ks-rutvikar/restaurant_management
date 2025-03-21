<template>
  <table>
    <thead>
      <tr>
        <th>Name</th>
        <th>Description</th>
        <th>Status</th>
        <th>Price</th>
        <th>Discount</th>
        <th>Rating</th>
        <th>Offers</th>
        <th>Image</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in items" :key="index">
        <td>{{ item.name }}</td>
        <td>{{ item.description }}</td>
        <td>{{ item.status }}</td>
        <td>${{ item.price }}</td>
        <td>{{ item.discount }}</td>
        <td>{{ item.rating }}</td>
        <td>{{ item.offers }}</td>
        <td v-if="item.image">
          <img
            :src="item.image"
            alt="Item Image"
            class="w-12 h-12 rounded-lg"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>
  
  <script setup>
import { defineProps } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});
</script>
  
  <style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

td {
  background-color: #fafafa;
}

img {
  max-width: 50px;
  max-height: 50px;
}
</style>
  