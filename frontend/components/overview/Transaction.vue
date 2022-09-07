<template>
  <tr 
    v-if="category && category.name"
    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
    @click="test"
  >
    <th 
      v-if="reference"
      scope="row"
      class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      :id="id"
      >
      {{ reference }}
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
        :style="`background-color: #${category.color || '00ffff'};`"
      >
        {{ category.name }}
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
      'category',
      'date',
      'amount',
      'currency',
    ],
    methods: {
      test() {
        // console.log(this.category)
      }
    },
    created() {
      // this.test()
    }
  }
</script>

<style scoped>

</style>