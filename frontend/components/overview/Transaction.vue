<template>
  <!-- v-if="category && category.name" -->
  <tr 
    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    @click="() => $emit('send-modal', id)"
  >
    <th 
      v-if="reference"
      scope="row"
      class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      :id="id"
    >
      <!-- <button type="button" onclick="() => $emit('send-modal', id)"> -->
        {{ reference }}
      <!-- </button> -->
    </th>
    <th 
      v-else
      scope="row"
      class="py-4 px-6 font-normal text-gray-400 whitespace-nowrap dark:text-white"
      :id="id"
    >
      No reference available
    </th>
    <td class="font-medium text-black py-4 px-6">
      <span
        class="border-0 sm:rounded-md px-2 py-1"
        :style="categoryColor ? `background-color: #${categoryColor}` : ''"
      >
        {{ categoryName }}
      </span>
    </td>
    <td class="py-4 px-6">{{ (new Date(date)).toLocaleDateString() }}</td>
    <td class="py-4 px-6 text-right">{{ `${amount} ${currency}` }}</td>
  </tr>
</template>

<script>
  export default {
    props: [
      'id',
      'reference',
      'categoryName',
      'categoryColor',
      'date',
      'amount',
      'currency',
    ],
    methods: {
      // test() {
      //   this.$router.push(`/${this.id}`)
      // }
    },
  }
</script>

<style scoped>

</style>