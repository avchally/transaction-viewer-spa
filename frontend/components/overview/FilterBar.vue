<template>
  <div class="flex text-m border-t-2 border-b-2">
    <div :class="`${tailwindStyles.container} w-3/6`">
      <label for="search">Search</label>
      <input 
        type="text"
        name="search"
        value=""
        @input="event => $emit('get-search', event.target.value)"
        :class="tailwindStyles.input"
        placeholder="Search by bank, account, reference, category, amount, currency..."
      >
    </div>
    <div :class="`${tailwindStyles.container} w-1/6`">
      <label for="filter-bank">Bank</label>
      <select 
        name="filter-bank"
        :class="tailwindStyles.input"
      >
        <option value="0" disabled selected>
          No filter applied
        </option>
        <option v-for="bank in banks" value="bank">{{ bank }}</option>
      </select>
    </div>
    <div :class="`${tailwindStyles.container} w-1/6`">
      <label for="filter-account">Account</label>
      <select 
        name="filter-account"
        :class="tailwindStyles.input"
      >
        <option value="0" disabled selected>
          No filter applied
        </option>
        <option v-for="account in accounts" value="account">{{ account }}</option>
      </select>
    </div>
    <div :class="`${tailwindStyles.container}`">
      <label for="filter-start-date">Start Date</label>
      <input 
        type="date"
        name="filter-start-date"
        :class="tailwindStyles.input"
      >
    </div>
    <div :class="`${tailwindStyles.container}`">
      <label for="filter-end-date">End Date</label>
      <input 
        type="date"
        name="filter-end-date"
        :class="tailwindStyles.input"
      >
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag';
export default {
  props: ['banks', 'accounts', 'query'],
  
  data() {
    return {
      tailwindStyles: {
        input: 'border-2 py-1 px-2 md:rounded-sm',
        container: 'flex flex-col m-1'
      },
      searchTerm: null,
      filter: null,
    }
  }
}
</script>